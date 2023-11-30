import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lib_itemsource', { schema: 'dbo' })
export class LibItemSourceEntity {
    @PrimaryGeneratedColumn()
    uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'item_name',
    })
    ItemName: string;

    @Column('varchar', {
        nullable: true,
        name: 'display_name',
    })
    DisplayName: string;

    @Column('bit', {
        nullable: true,
        name: 'Active_Status',
    })
    ActiveStatus: boolean;
}
