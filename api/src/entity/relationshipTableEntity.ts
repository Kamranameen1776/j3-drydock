/* eslint-disable @typescript-eslint/naming-convention */
import { Column } from 'typeorm';

export abstract class RelationshipTableEntity {
    @Column('bit', {
        nullable: true,
        name: 'active_status',
    })
    active_status: boolean;

    @Column('uuid', {
        nullable: true,
        name: 'modified_by',
    })
    modified_by: string;

    @Column('datetimeoffset', {
        name: 'modified_at',
        nullable: true,
        default: () => 'getutcdate()()',
    })
    modified_at: Date | null;
}
