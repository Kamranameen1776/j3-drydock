import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Lib_Vessels', { schema: 'dbo' })
export class LibVesselsEntity {
    @PrimaryGeneratedColumn()
    uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'Vessel_Name',
        length: 50,
    })
    VesselName: string;

    @Column('bit', {
        nullable: true,
        name: 'Active_Status',
    })
    ActiveStatus: boolean;

    @Column('integer', {
        nullable: true,
        name: 'Vessel_ID',
    })
    VesselId: number;
}
