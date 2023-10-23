import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateJcdsLibraryData1698058006302 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const itemCategoryQuery = `
        declare @colData nvarchar(max) = N'[{"IsActive":false,"IsVisible":false,"IsMandatory":false,"FieldName":"uid","type":"uniqueidentifier","JcdsFieldName":"uid","isPrimary":true,"isNullable":false,"default":"newid()"},{"IsActive":false,"IsVisible":false,"IsMandatory":false,"FieldName":"_id","JcdsFieldName":"_id","type":"varchar","length":100},{"IsActive":true,"IsVisible":true,"IsMandatory":true,"isEditable":false,"FieldName":"item_category","JcdsFieldName":"item_category","DisplayText":"ItemCategory","length":50},{"IsActive":true,"IsVisible":true,"IsMandatory":true,"isEditable":true,"FieldName":"display_name","DisplayText":"DisplayName","JcdsFieldName":"display_name","isUnique":true,"type":"varchar","length":50},{"IsActive":false,"IsVisible":false,"IsMandatory":false,"FieldName":"active_status","JcdsFieldName":"activeStatus","type":"bit","default":1}]'

        UPDATE [dbo].[j2_inf_admin_library]
        SET [colData] = @colData
        WHERE [library_code] = 'ddItemCategory'
    `;

        const doneByQuery = `
        declare @colData nvarchar(max) = N'[{"IsActive":false,"IsVisible":false,"IsMandatory":false,"FieldName":"uid","type":"uniqueidentifier","JcdsFieldName":"uid","isPrimary":true,"isNullable":false,"default":"newid()"},{"IsActive":false,"IsVisible":false,"IsMandatory":false,"FieldName":"_id","JcdsFieldName":"_id","type":"varchar","length":100},{"IsActive":true,"IsVisible":true,"IsMandatory":true,"isEditable":false,"FieldName":"done_by","JcdsFieldName":"done_by","DisplayText":"Done By","length":50},{"IsActive":true,"IsVisible":true,"IsMandatory":true,"isEditable":true,"FieldName":"displayName","DisplayText":"Display Name","JcdsFieldName":"displayName","isUnique":true,"type":"varchar","length":50},{"IsActive":false,"IsVisible":false,"IsMandatory":false,"FieldName":"active_status","JcdsFieldName":"activeStatus","type":"bit","default":1}]'

        UPDATE [dbo].[j2_inf_admin_library]
        SET [colData] = @colData
        WHERE [library_code] = 'ddDoneBy'
    `;

        await queryRunner.query(itemCategoryQuery);
        await queryRunner.query(doneByQuery);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
