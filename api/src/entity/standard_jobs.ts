import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

import { LIB_VESSELTYPES } from './LIB_VESSELTYPES';

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
        name: 'code',
        length: 250,
    })
    code: string;

    @Column('varchar', {
        nullable: true,
        name: 'category',
        length: 250,
    })
    category: string;

    @Column('datetime', {
        nullable: true,
        name: 'due_date',
    })
    due_date: Date;

    @Column('bit', {
        nullable: true,
        name: 'vessel_type_specific',
    })
    vessel_type_specific: boolean;

    @ManyToOne(() => LIB_VESSELTYPES, (LIB_VESSELTYPES) => LIB_VESSELTYPES.standard_jobs)
    @JoinColumn({
        name: 'vessel_type_uid',
        referencedColumnName: 'uid',
    })
    readonly vessel_type: LIB_VESSELTYPES;
    @RelationId((entity: standard_jobs) => entity.vessel_type)
    readonly vessel_type_uid: string;

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

    @Column('int', {
        nullable: true,
        name: 'created_by',
    })
    created_by: number;

    @Column('datetime', {
        nullable: true,
        name: 'date_of_creation',
    })
    date_of_creation: Date;

    @Column('int', {
        nullable: true,
        name: 'modified_by',
    })
    modified_by: number;

    @Column('datetime', {
        nullable: true,
        name: 'date_of_modification',
    })
    date_of_modification: Date;

    @Column('int', {
        nullable: true,
        name: 'deleted_by',
    })
    deleted_by: number;

    @Column('datetime', {
        nullable: true,
        name: 'date_of_deletion',
    })
    date_of_deletion: Date;
}
