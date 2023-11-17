import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TEC_LIB_Worklist_Type', { schema: 'dbo' })
export class TecLibWorklistTypeEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column('varchar', {
        nullable: true,
        name: 'Worklist_Type',
        length: 50,
    })
    WorklistType: string;

    @Column('varchar', {
        nullable: true,
        name: 'Worklist_Type_Display',
        length: 50,
    })
    WorklistTypeDisplay: string;

    @Column('bit', {
        nullable: true,
        name: 'Active_Status',
    })
    ActiveStatus: boolean;
}
