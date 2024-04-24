import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';

import { QueryStrings } from '../../shared/enum/queryStrings.enum';
import { BaseDatesEntity } from '../baseDatesEntity';
import { LibSurveyCertificateAuthority, LibVesseltypes, TmDdLibDoneBy, TmDdLibMaterialSuppliedBy } from './dbo';
import { ProjectTemplateStandardJobEntity } from './ProjectTemplate/ProjectTemplateStandardJobEntity';
import { StandardJobsSubItems } from './StandardJobsSubItemsEntity';

@Entity('standard_jobs', { schema: 'dry_dock' })
export class StandardJobs extends BaseDatesEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'subject',
        length: 250,
    })
    subject: string;

    @Column('varchar', {
        nullable: true,
        name: 'function',
        length: 250,
    })
    function: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'function_uid',
    })
    functionUid: string;

    @Column('varchar', {
        nullable: true,
        name: 'code',
        length: 250,
    })
    code: string;

    @Column({
        name: 'estimated_duration',
        type: 'decimal',
        precision: 20,
        scale: 2,
        default: 0,
    })
    estimatedDuration: number;

    @Column({
        name: 'buffer_time',
        type: 'decimal',
        precision: 20,
        scale: 2,
        default: 0,
    })
    bufferTime: number;

    @Column({
        name: 'estimated_budget',
        type: 'decimal',
        precision: 20,
        scale: 2,
        default: 0,
    })
    estimatedBudget: number;

    @Column('int', {
        nullable: false,
        name: 'number',
    })
    number: number;

    @Column('nvarchar', {
        nullable: true,
        name: 'scope',
        length: 'max',
    })
    scope: string;

    @Column('varchar', {
        nullable: false,
        name: 'job_required',
        default: QueryStrings.Yes,
    })
    jobRequired: string;

    @Column('uniqueidentifier', {
        name: 'gl_account_uid',
    })
    glAccountUid: string;

    @Column('uniqueidentifier', {
        name: 'job_execution_uid',
    })
    jobExecutionUid: string;

    @ManyToOne(() => TmDdLibDoneBy)
    @JoinColumn({
        name: 'done_by_uid',
    })
    doneBy: Partial<TmDdLibDoneBy>;
    @RelationId((entity: StandardJobs) => entity.doneBy)
    doneByUid: string;

    @ManyToOne(() => TmDdLibMaterialSuppliedBy)
    @JoinColumn({
        name: 'material_supplied_by_uid',
    })
    materialSuppliedBy: Partial<TmDdLibMaterialSuppliedBy>;
    @RelationId((entity: StandardJobs) => entity.materialSuppliedBy)
    materialSuppliedByUid: string;

    @OneToMany(() => StandardJobsSubItems, (standard_jobs_sub_items) => standard_jobs_sub_items.standardJob)
    subItems: StandardJobsSubItems[];

    @Column('bit', {
        nullable: true,
        name: 'vessel_type_specific',
    })
    vesselTypeSpecific: boolean;

    @ManyToMany(() => LibVesseltypes, (LIB_VESSELTYPES) => LIB_VESSELTYPES.standard_jobs)
    @JoinTable({
        name: 'standard_jobs_vessel_type',
        schema: 'dry_dock',
        joinColumn: {
            name: 'standard_job_uid',
            referencedColumnName: 'uid',
        },
        inverseJoinColumn: {
            name: 'vessel_type_id',
            referencedColumnName: 'ID',
        },
    })
    vesselType: Partial<LibVesseltypes>[];

    @ManyToMany(
        () => LibSurveyCertificateAuthority,
        (LIB_Survey_CertificateAuthority) => LIB_Survey_CertificateAuthority.standard_jobs,
    )
    @JoinTable({
        name: 'standard_jobs_survey_certificate_authority',
        schema: 'dry_dock',
        joinColumn: {
            name: 'standard_job_uid',
            referencedColumnName: 'uid',
        },
        inverseJoinColumn: {
            name: 'survey_id',
            referencedColumnName: 'ID',
        },
    })
    inspection: Partial<LibSurveyCertificateAuthority>[];

    @Column('nvarchar', {
        nullable: true,
        name: 'description',
        length: 'max',
    })
    description: string;

    @OneToMany(() => ProjectTemplateStandardJobEntity, (entity) => entity.StandardJob)
    @JoinColumn({
        name: 'uid',
        referencedColumnName: 'standard_job_uid',
    })
    ProjectTemplateStandardJobs: ProjectTemplateStandardJobEntity[];
}
