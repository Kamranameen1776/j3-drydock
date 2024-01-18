/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('VesselInfo_VesselfieldDtl')
export class VesselFieldDetailEntity {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column({ type: 'int', nullable: true })
    Vessel_ID: number;

    @Column({ type: 'int', nullable: true })
    FieldID: number;

    @Column({ type: 'varchar', length: 500, nullable: true })
    FieldValue: string;

    @Column({ type: 'datetime', nullable: true })
    Expiry_Date: Date;

    @Column({ type: 'datetime', nullable: true })
    Effective_Date: Date;

    @Column({ type: 'int', nullable: true })
    Active_Status: number;

    @Column({ type: 'int', nullable: true })
    Created_By: number;

    @Column({ type: 'datetime', nullable: true })
    Date_Of_Creation: Date;

    @Column({ type: 'int', nullable: true })
    Modified_By: number;

    @Column({ type: 'datetime', nullable: true })
    Date_Of_Modification: Date;

    @Column({ type: 'int', nullable: true })
    Deleted_By: number;

    @Column({ type: 'datetime', nullable: true })
    Date_Of_Deletion: Date;

    @Column({ type: 'int', nullable: true })
    indexFieldID: number;

    @Column({ type: 'int', nullable: true })
    indexVessel_ID: number;
}
