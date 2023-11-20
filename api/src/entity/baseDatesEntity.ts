import { Column } from 'typeorm';

export abstract class BaseDatesEntity {
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
