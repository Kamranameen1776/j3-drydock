import { Request } from 'express';
import { AccessRights, DataUtilService, SynchronizerService } from 'j2utils';

import { SpecificationDetailsAuditService } from '../../../bll/drydock/specification-details/specification-details-audit.service';
import { SpecificationService } from '../../../bll/drydock/specification-details/SpecificationService';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { CreateInspectionsDto } from '../../../dal/drydock/specification-details/dtos';
import { CreateSpecificationFromStandardJobDto } from '../../../dal/drydock/specification-details/dtos/ICreateSpecificationFromStandardJobDto';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { SpecificationDetailsSubItemsRepository } from '../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { LibVesselsEntity, SpecificationDetailsEntity } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateSpecificationDetailsDto } from './dtos/UpdateSpecificationDetailsDto';

export class CreateSpecificationFromStandardJobsCommand extends Command<Request, SpecificationDetailsEntity[]> {
    specificationRepository = new SpecificationDetailsRepository();
    uow = new UnitOfWork();
    specificationDetailsService = new SpecificationService();
    vesselsRepository = new VesselsRepository();
    projectRepository = new ProjectsRepository();
    subItemsRepository = new SpecificationDetailsSubItemsRepository();
    specificationDetailsAudit = new SpecificationDetailsAuditService();

    tableName = 'dry_dock.specification_details';
    tableNameInspections = 'dry_dock.specification_details_LIB_Survey_CertificateAuthority';

    protected async MainHandlerAsync(request: Request) {
        const { UserUID: createdBy } = AccessRights.authorizationDecode(request);
        const body: CreateSpecificationFromStandardJobDto = request.body;
        const token: string = request.headers.authorization as string;

        const [project] = await this.projectRepository.GetProject(request.body.ProjectUid);
        const vessel: LibVesselsEntity = await this.vesselsRepository.GetVesselByUID(project.VesselUid);

        return this.uow.ExecuteAsync(async (queryRunner) => {
            const specifications = await this.specificationRepository.createSpecificationFromStandardJob(
                body,
                createdBy,
                queryRunner,
            );

            await Promise.all(
                specifications.map(async (specification) => {
                    const tmResult = await this.specificationDetailsService.TaskManagerIntegration(
                        { Subject: specification.Subject },
                        vessel,
                        token,
                    );

                    await this.specificationRepository.updateSpecificationTmUid(
                        specification.uid,
                        tmResult.uid,
                        queryRunner,
                    );

                    // SYNCING specification_details
                    await SynchronizerService.dataSynchronizeManager(
                        queryRunner.manager,
                        this.tableName,
                        'uid',
                        specification.uid,
                        vessel.VesselId,
                    );

                    specification.TecTaskManagerUid = tmResult.uid;

                    const inspections = specification.inspections;

                    if (inspections.length) {
                        const data: CreateInspectionsDto[] = inspections.map((inspection) => {
                            const item: CreateInspectionsDto = {
                                uid: DataUtilService.newUid(),
                                LIBSurveyCertificateAuthorityID: inspection.ID!,
                                SpecificationDetailsUid: specification.uid,
                            };
                            return item;
                        });

                        await this.specificationRepository.CreateSpecificationInspection(data, queryRunner);

                        // SYNC inspection
                        const condition = `uid IN ('${data.map((i) => i.uid).join(`','`)}')`;
                        await SynchronizerService.dataSynchronizeByConditionManager(
                            queryRunner.manager,
                            this.tableNameInspections,
                            vessel.VesselId,
                            condition,
                        );
                    }

                    // #TODO Uncomment once known how to handle unitTypes
                    // const subItems = specification.SubItems;
                    //
                    // if (subItems.length) {
                    //     const data: CreateManyParams = {
                    //         createdBy,
                    //         specificationDetailsUid: specification.uid,
                    //         subItems: subItems.map((subItem) => ({
                    //           subject: subItem.subject,
                    //         })) as SubItemEditableProps[],
                    //     };
                    //
                    //     await this.subItemsRepository.createRawSubItems(data, queryRunner);
                    // }

                    const specificationAuditData: UpdateSpecificationDetailsDto = {
                        uid: specification.uid,
                        Subject: specification.Subject,
                        Inspections: specification.inspections.map((inspection) => inspection.ID!),
                        Description: specification.Description,
                        DoneByUid: specification.DoneByUid,
                    };

                    // AUDIT
                    await this.specificationDetailsAudit.auditCreatedSpecificationDetails(
                        specificationAuditData,
                        createdBy,
                        queryRunner,
                    );
                }),
            );

            return specifications;
        });
    }
}
