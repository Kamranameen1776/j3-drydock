/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { RelationshipTableEntity } from '../relationshipTableEntity';

@Entity('async_jobs', { schema: 'dry_dock' })
export class AsyncJobsEntity extends RelationshipTableEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'module_code',
    })
    ModuleCode: string;

    @Column('varchar', {
        nullable: false,
        length: 50,
        name: 'function_code',
    })
    FunctionCode: string;

    @Column('varchar', {
        nullable: false,
        name: 'topic',
        length: 255,
    })
    Topic: Date;

    @Column('int', {
        nullable: true,
        name: 'status_code',
    })
    Status: number;
}
