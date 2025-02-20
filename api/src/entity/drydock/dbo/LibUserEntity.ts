import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Lib_User', { schema: 'dbo' })
export class LibUserEntity {
    @PrimaryGeneratedColumn()
    uid: string;

    @Column('varchar', {
        nullable: true,
        name: 'First_Name',
        length: 500,
    })
    FirstName: string;

    @Column('varchar', {
        nullable: true,
        name: 'Last_Name',
        length: 500,
    })
    LastName: string;

    @Column('bit', {
        nullable: true,
        name: 'Active_Status',
    })
    ActiveStatus: boolean;

    @Column('varchar', {
        nullable: true,
        name: 'User_Type',
        length: 500,
    })
    UserType: string;

    public get FullName(): string {
        return `${this.FirstName} ${this.LastName}`;
    }
}
