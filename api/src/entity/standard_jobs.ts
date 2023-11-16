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

import { BaseDatesEntity } from './baseDatesEntity';
import { LibSurveyCertificateAuthority } from './LIB_Survey_CertificateAuthority';
import { LibVesseltypes } from './LIB_VESSELTYPES';
import { StandardJobsSubItems } from './standard_jobs_sub_items';
import { TmDdLibDoneBy } from './tm_dd_lib_done_by';
import { TmDdLibItemCategory } from './tm_dd_lib_item_category';
import { TmDdLibMaterialSuppliedBy } from './tm_dd_lib_material_supplied_by';

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
    function_uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'code',
        length: 250,
    })
    code: string;

    @Column('int', {
        nullable: false,
        name: 'number',
        generated: 'increment',
    })
    number: number;

    @Column('varchar', {
        nullable: true,
        name: 'scope',
        length: 250,
    })
    scope: string;

    @ManyToOne(() => TmDdLibItemCategory)
    @JoinColumn({
        name: 'category_uid',
    })
    category: Partial<TmDdLibItemCategory>;
    @RelationId((entity: StandardJobs) => entity.category)
    category_uid: string;

    @ManyToOne(() => TmDdLibDoneBy)
    @JoinColumn({
        name: 'done_by_uid',
    })
    done_by: Partial<TmDdLibDoneBy>;
    @RelationId((entity: StandardJobs) => entity.done_by)
    done_by_uid: string;

    @ManyToOne(() => TmDdLibMaterialSuppliedBy)
    @JoinColumn({
        name: 'material_supplied_by_uid',
    })
    material_supplied_by: Partial<TmDdLibMaterialSuppliedBy>;
    @RelationId((entity: StandardJobs) => entity.material_supplied_by)
    material_supplied_by_uid: string;

    @OneToMany(() => StandardJobsSubItems, (standard_jobs_sub_items) => standard_jobs_sub_items.standard_job)
    sub_items: StandardJobsSubItems[];

    @Column('bit', {
        nullable: true,
        name: 'vessel_type_specific',
    })
    vessel_type_specific: boolean;

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
    vessel_type: Partial<LibVesseltypes>[];

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

    @Column('varchar', {
        nullable: true,
        name: 'description',
        length: 5000,
    })
    description: string;
}
