/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Lib_VesselInfo_VesselField')
export class VesselFieldEntity {
    @PrimaryGeneratedColumn()
    FieldID: number;

    @Column({ type: 'varchar', length: 500, nullable: true })
    FieldName: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    FieldDataType: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    FieldType: string;

    @Column({ type: 'bit', nullable: true })
    IsMandatory: boolean;

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
    UOMID: number;

    @Column({ type: 'varchar', length: 2000, nullable: true })
    DataSource: string;

    @Column({ type: 'int', nullable: true })
    CategoryID: number;

    @Column({ type: 'int', nullable: true })
    SubCategoryID: number;
}
