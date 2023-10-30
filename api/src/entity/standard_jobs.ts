import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    JoinTable,
    ManyToOne,
    JoinColumn, RelationId
} from "typeorm";
import { LIB_VESSELTYPES } from './LIB_VESSELTYPES';
import { LIB_Survey_CertificateAuthority } from "./LIB_Survey_CertificateAuthority";
import { tm_dd_lib_material_supplied_by } from "./tm_dd_lib_material_supplied_by";
import { tm_dd_lib_done_by } from "./tm_dd_lib_done_by";
import { tm_dd_lib_item_category } from "./tm_dd_lib_item_category";

@Entity('standard_jobs', { schema: 'drydock' })
export class standard_jobs {
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

    @Column('varchar', {
        nullable: true,
        name: 'code',
        length: 250,
    })
    code: string;

    @Column('varchar', {
        nullable: true,
        name: 'scope',
        length: 250,
    })
    scope: string;

    @ManyToOne(() => tm_dd_lib_item_category)
    @JoinColumn({
        name: 'category_uid',
    })
    category: Partial<tm_dd_lib_item_category>;
    @RelationId((entity: standard_jobs) => entity.category)
    category_uid: string;

    @ManyToOne(() => tm_dd_lib_done_by)
    @JoinColumn({
        name: 'done_by_uid',
    })
    done_by: Partial<tm_dd_lib_done_by>;
    @RelationId((entity: standard_jobs) => entity.done_by)
    done_by_uid: string;

    @ManyToOne(() => tm_dd_lib_material_supplied_by)
    @JoinColumn({
        name: 'material_supplied_by_uid',
    })
    material_supplied_by: Partial<tm_dd_lib_material_supplied_by>;
    @RelationId((entity: standard_jobs) => entity.material_supplied_by)
    material_supplied_by_uid: string;

    @Column('bit', {
        nullable: true,
        name: 'vessel_type_specific',
    })
    vessel_type_specific: boolean;

    @ManyToMany(() => LIB_VESSELTYPES, (LIB_VESSELTYPES) => LIB_VESSELTYPES.standard_jobs)
    @JoinTable({
        name: 'standard_jobs_vessel_type',
        schema: 'drydock',
        joinColumn: {
            name: 'standard_job_uid',
            referencedColumnName: 'uid',
        },
        inverseJoinColumn: {
            name: 'vessel_type_id',
            referencedColumnName: 'ID',
        },
    })
    vessel_type: Partial<LIB_VESSELTYPES>[];

    @ManyToMany(() => LIB_Survey_CertificateAuthority, (LIB_Survey_CertificateAuthority) => LIB_Survey_CertificateAuthority.standard_jobs)
    @JoinTable({
        name: 'standard_jobs_survey_certificate_authority',
        schema: 'drydock',
        joinColumn: {
            name: 'standard_job_uid',
            referencedColumnName: 'uid',
        },
        inverseJoinColumn: {
            name: 'survey_id',
            referencedColumnName: 'ID',
        },
    })
    inspection: Partial<LIB_Survey_CertificateAuthority>[];

    @Column('varchar', {
        nullable: true,
        name: 'description',
        length: 5000,
    })
    description: string;

    @Column('bit', {
        nullable: true,
        name: 'active_status',
    })
    active_status: boolean;

    @Column('uuid', {
        nullable: true,
        name: 'created_by',
    })
    created_by: string;

    @Column('datetime', {
        nullable: true,
        name: 'created_at',
    })
    created_at: Date;

    @Column('uuid', {
        nullable: true,
        name: 'updated_by',
    })
    updated_by: string;

    @Column('datetime', {
        nullable: true,
        name: 'updated_at',
    })
    updated_at: Date;

    @Column('uuid', {
        nullable: true,
        name: 'deleted_by',
    })
    deleted_by: string;

    @Column('datetime', {
        nullable: true,
        name: 'deleted_at',
    })
    deleted_at: Date;
}
