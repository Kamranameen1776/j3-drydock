/* eslint-disable @typescript-eslint/naming-convention */
import { Entity, PrimaryColumn } from 'typeorm';

import { RelationshipTableEntity } from '../../relationshipTableEntity';

@Entity('project_template_vessel_type', { schema: 'dry_dock' })
export class ProjectTemplateVesselTypeEntity extends RelationshipTableEntity {
    @PrimaryColumn('uniqueidentifier', {
        nullable: false,
        name: 'project_template_uid',
        primary: true,
    })
    project_template_uid: string;

    @PrimaryColumn('int', {
        nullable: false,
        name: 'vessel_type_id',
        primary: true,
    })
    vessel_type_id: number;
}
