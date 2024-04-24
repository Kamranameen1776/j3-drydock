import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Lib_Vessels', { schema: 'dbo' })
export class LibVesselsEntity {
    @PrimaryGeneratedColumn()
    uid: string;

    @Column('int', {
        nullable: false,
        name: 'Vessel_ID',
    })
    VesselId: number;

    @Column('int', {
        nullable: false,
        name: 'Vessel_type',
    })
    VesselType: number;

    @Column('varchar', {
        nullable: true,
        name: 'Vessel_Name',
        length: 50,
    })
    VesselName: string;

    @Column('int', {
        nullable: true,
        name: 'Managed_By_Comp',
    })
    ManagementCompany: number;

    @Column('int', {
        nullable: false,
        name: 'FleetCode',
    })
    FleetCode: number;

    @Column('bit', {
        nullable: true,
        name: 'Active_Status',
    })
    ActiveStatus: boolean;
}
