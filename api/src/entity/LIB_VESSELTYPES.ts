import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { standard_jobs } from "./standard_jobs";

@Entity('LIB_VESSELTYPES', { schema: 'dbo' })
export class LIB_VESSELTYPES {
  @PrimaryGeneratedColumn()
  ID: string;

  @Column('uniqueidentifier', {
    nullable: false,
    name: 'uid',
  })
  uid: string;

  @Column('varchar', {
    nullable: false,
    name: 'VesselTypes',
    length: 250,
  })
  VesselTypes: string;

  @OneToMany(() => standard_jobs, (photo) => photo.vessel_type)
  standard_jobs: standard_jobs[]
}
