import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('specification_details_LIB_Survey_CertificateAuthority', { schema: 'dry_dock' })
export class SpecificationInspectionEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'specification_details_uid',
    })
    SpecificationDetailsUid: string;

    @Column('int', {
        nullable: false,
        name: 'LIB_Survey_CertificateAuthority_ID',
    })
    LIBSurveyCertificateAuthorityID: number;
}
