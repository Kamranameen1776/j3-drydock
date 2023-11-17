import { Column, Entity } from 'typeorm';

@Entity('standard_jobs_survey_certificate_authority', { schema: 'dry_dock' })
export class StandardJobsSurveyCertificateAuthorityEntity {
    @Column('int', {
        nullable: false,
        name: 'survey_id',
        primary: true,
    })
    survey_id: number;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'standard_job_uid',
        primary: true,
    })
    standard_job_uid: string;
}
