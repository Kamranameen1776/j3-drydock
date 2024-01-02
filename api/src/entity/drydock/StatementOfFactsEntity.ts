import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('statement_of_facts', { schema: 'dry_dock' })
export class StatementOfFactsEntity {
    @PrimaryGeneratedColumn('uuid', {
        name: 'uid',
    })
    uid: string;

    @Column('varchar', {
        nullable: false,
        name: 'fact',
        length: 350,
    })
    Fact: string;

    @Column('varchar', {
        nullable: false,
        name: 'date',
    })
    DateAndTime: Date;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'project_uid',
    })
    ProjectUid: string;

    @Column('datetimeoffset', {
        nullable: false,
        name: 'created_at',
        default: () => 'getutcdate()()',
    })
    CreatedAt: Date | null;

    @Column('bit', {
        nullable: false,
        name: 'active_status',
    })
    ActiveStatus: boolean;
}
