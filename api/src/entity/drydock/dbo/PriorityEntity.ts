import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lib_urgency', { schema: 'dbo' })
export class PriorityEntity {
    @PrimaryGeneratedColumn()
    uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'urgencys',
        length: 50,
    })
    Urgencys: string;

    @Column('varchar', {
        nullable: true,
        name: 'display_name',
        length: 50,
    })
    DisplayName: string;

    @Column('bit', {
        nullable: true,
        name: 'active_status',
    })
    ActiveStatus: boolean;
}
