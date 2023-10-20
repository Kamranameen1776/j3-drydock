import { Column, Entity } from 'typeorm';

@Entity('LIB_FLEETS', { schema: 'dbo' })
export class LIB_FLEETS {
    @Column('int', {
        nullable: false,
        primary: true,
        name: 'FleetCode',
    })
    FleetCode: number;

    @Column('varchar', {
        nullable: false,
        length: 50,
        name: 'FleetName',
    })
    FleetName: string;

    @Column('int', {
        nullable: true,
        name: 'Created_By',
    })
    Created_By: number | null;

    @Column('datetime', {
        nullable: true,
        default: '(getdate())',
        name: 'Date_Of_Creation',
    })
    Date_Of_Creation: Date | null;

    @Column('int', {
        nullable: true,
        name: 'Modified_By',
    })
    Modified_By: number | null;

    @Column('datetime', {
        nullable: true,
        name: 'Date_Of_Modification',
    })
    Date_Of_Modification: Date | null;

    @Column('int', {
        nullable: true,
        name: 'Deleted_By',
    })
    Deleted_By: number | null;

    @Column('datetime', {
        nullable: true,
        name: 'Date_Of_Deletion',
    })
    Date_Of_Deletion: Date | null;

    @Column('int', {
        nullable: false,
        default: true,
        name: 'Active_Status',
    })
    Active_Status: boolean;

    @Column('int', {
        nullable: true,
        name: 'Vessel_Owner',
    })
    Vessel_Owner: number | null;

    @Column('int', {
        nullable: true,
        name: 'Vessel_Manager',
    })
    Vessel_Manager: number | null;

    @Column('varchar', {
        nullable: true,
        length: 4000,
        name: 'Super_MailID',
    })
    Super_MailID: string | null;

    @Column('varchar', {
        nullable: true,
        length: 4000,
        name: 'TechTeam_MailID',
    })
    TechTeam_MailID: string | null;

    @Column('varchar', {
        nullable: true,
        length: 4000,
        name: 'TA_MailID',
    })
    TA_MailID: string | null;

    @Column('varchar', {
        nullable: true,
        length: 4000,
        name: 'Purchaser_MailID',
    })
    Purchaser_MailID: string | null;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'uid',
    })
    uid: string;
}
