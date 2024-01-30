import axios from 'axios';
import { readFileSync } from 'fs';
import { ApiRequestService, ConfigurationService } from 'j2utils';

import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import {
    SpecificationDetailsRepository,
    SpecificationForReport,
} from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { SpecificationDetailsSubItemsRepository } from '../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { SpecificationDetailsSubItemEntity } from '../../../entity/drydock/SpecificationDetailsSubItemEntity';
import {
    JmsAttachmentFileType,
    JmsAttachmentsDetails,
    TaskManagerService,
} from '../../../external-services/drydock/TaskManager';
import { log } from '../../../logger';
import { InfraConstants } from '../../../shared/constants/infra';
import { BusinessException } from '../core/exceptions';
import { ProjectService } from './ProjectService';

const BASE64_PREFIX = 'data:image/jpg;base64,';
const COMPANY_LOGO_URL_SUFFIX = '/images/company_logo.jpg';
export enum eLocation {
    Location = 'location',
    Office = 'office',
    Vessel = 'vessel',
}

export class ProjectDetailReport {
    private projectsRepository = new ProjectsRepository();
    private vesselRepository = new VesselsRepository();
    private taskManagerService = new TaskManagerService();
    private projectsService = new ProjectService();
    private jibeLogo =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAjCAYAAAADp43CAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpBRDhDMDM1NkI1MzExMUU2QUQ1NkMxNDNENkI3NjE5RiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowNzdCMDUzOUI2Q0QxMUU2Qjg1MENCMzNBNTI1QTBDMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNzdCMDUzOEI2Q0QxMUU2Qjg1MENCMzNBNTI1QTBDMyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2ZDViMjI4NC1hMTRjLTdjNDEtOTE5MC0wMzdkYzk3ODg5MjkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QUQ4QzAzNTZCNTMxMTFFNkFENTZDMTQzRDZCNzYxOUYiLz4gPC9yZGY6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';

    public async getProjectDetailReport(projectUid: string, token: string) {
        const [project] = await this.projectsRepository.GetProject(projectUid);
        if (!project) {
            throw new BusinessException(
                `The project identified by UID: ${projectUid} could not be found or has been deleted.`,
            );
        }
        const vesselType = await this.vesselRepository.GetVesselType(Number(project.VesselType));
        const vesselFields = await this.vesselRepository.GetVesselFields(Number(project.VesselId));
        const specifications = await new SpecificationDetailsRepository().findSpecificationsForProjectReport(
            projectUid,
        );
        const attachmentsBySpecification: { [key: string]: JmsAttachmentsDetails[] } = {};
        for (const spec of specifications) {
            const [files, media] = await Promise.all([
                this.taskManagerService.getJmsAttachmentDetails(token, {
                    taskManagerUid: spec.TecTaskManagerUid,
                    vesselId: project.VesselId!,
                    officeId: await this.projectsService.IsOffice(),
                    fileType: JmsAttachmentFileType.File,
                }),
                this.taskManagerService.getJmsAttachmentDetails(token, {
                    taskManagerUid: spec.TecTaskManagerUid,
                    vesselId: project.VesselId!,
                    officeId: await this.projectsService.IsOffice(),
                    fileType: JmsAttachmentFileType.Media,
                }),
            ]);
            attachmentsBySpecification[spec.uid] = files.concat(media);
        }
        const subItems = await new SpecificationDetailsSubItemsRepository().getBySpecificationDetailsUid(
            specifications.map((spec) => spec.uid),
        );
        const subItemsBySpecification = subItems.reduce((acc, curr) => {
            if (!acc[curr.specificationDetailsUid]) {
                acc[curr.specificationDetailsUid] = [];
            }
            acc[curr.specificationDetailsUid].push({
                number: curr.number,
                subject: curr.subject,
                description: curr.description,
            });
            return acc;
        }, {} as { [key: string]: Partial<SpecificationDetailsSubItemEntity>[] });
        const Vessel_Number = project.VesselId;

        const tableOfContents = this.tableOfContents(specifications);

        return {
            fileName: `Dry Dock - ${project.VesselName} - ${project.ProjectCode}`,
            Report_Id: project.ProjectCode,
            Vessel_Name: project.VesselName ?? '-',
            Vessel_Type: vesselType ?? '-',
            Vessel_Number: Vessel_Number ?? '-',
            Vessel_Details: {
                Builder_Year: vesselFields['Date Of Build'] ?? '-',
                Classification_Society: vesselFields['Classification Society'] ?? '-',
                Type_Of_Vessel: vesselFields['Type of Vessel'] ?? '-',
                Main_Dimensions: {
                    Length_Overall: vesselFields['Length overall (LOA)'],
                    Length_Between_PP: vesselFields['Length between perpendiculars (LBP)'],
                    Breadth_moulded: vesselFields['Breadth o.a.'],
                    Draft: vesselFields['Loadline - Normal Ballast Condition - Draft'],
                    Gross_Tonnage: vesselFields['Gross Tonnage'],
                    Dwt_Tonnage: vesselFields['Vessel DWT'],
                },
            },
            Table_Of_Contents: tableOfContents,
            Specifications: specifications.map((spec) => ({
                Root_Function: spec.functionTree.rootFunction,
                Subject: spec.Subject,
                Code: spec.SpecificationCode,
                Function_Path: spec.functionTree.functionPath || spec.functionTree.rootFunction,
                Description: spec.Description,
                Sub_Items: subItemsBySpecification[spec.uid] ?? [],
                Attachments: attachmentsBySpecification[spec.uid].map((file) => ({
                    FileName: file.upload_file_name,
                })),
            })),
            Company_Logo: await this.getCompanyLogoForReport(token),
        };
    }

    private tableOfContents(specifications: SpecificationForReport[]) {
        const grouped = specifications.reduce((acc, curr) => {
            const key = curr.functionTree.rootFunction;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(curr);
            return acc;
        }, {} as Record<string, SpecificationForReport[]>);

        let page = 2;

        const tableOfContents = Object.entries(grouped).map(([key, value]) => {
            const subPages = value.filter((spec) => !!spec.functionTree.functionPath);
            const table = {
                Root_Function: key,
                page,
                Sub_Functions: subPages.map((spec) => {
                    const subTable = {
                        name: spec.functionTree.functionPath,
                        page,
                    };
                    page += 3;
                    return subTable;
                }),
            };
            if (subPages.length === 0) {
                page += 3;
            }
            return table;
        });

        return tableOfContents;
    }

    private async getCompanyLogoForReport(token: string): Promise<string | null> {
        // this function does not work locally, so using static jibe logo
        if (process.env.NODE_ENV === 'development') {
            return this.jibeLogo;
        }

        try {
            const appLocation = await ConfigurationService.getConfiguration(eLocation.Location);
            const envDetails = token ? await this.getEnvironmentDetails(token) : null;

            if (appLocation === eLocation.Vessel) {
                return this.getLocalCompanyLogo();
            } else if (envDetails?.data?.j2) {
                return await this.getRemoteCompanyLogo(envDetails.data.j2.baseURL);
            }

            return null;
        } catch (error) {
            log.error(error, 'Error getting company logo for report');
            return null;
        }
    }

    private async getEnvironmentDetails(token: string) {
        return new ApiRequestService().infra(token, 'infra/configuration/get-environment', 'get');
    }

    private getLocalCompanyLogo(): string {
        const logoData = readFileSync(InfraConstants.vesselCompanyLogoPath, { encoding: 'base64' });
        return BASE64_PREFIX.concat(logoData);
    }

    private async getRemoteCompanyLogo(baseURL: string): Promise<string> {
        const jibeImage = await axios.get(`${baseURL}${COMPANY_LOGO_URL_SUFFIX}`, {
            responseType: 'arraybuffer',
        });
        return BASE64_PREFIX + Buffer.from(jibeImage.data).toString('base64');
    }
}
