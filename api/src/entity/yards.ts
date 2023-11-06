import { Column, Entity } from 'typeorm';

@Entity('yards', { schema: 'dry_dock' })
export class yards {
    @Column('uniqueidentifier', {
        nullable: false,
        primary: true,
        name: 'uid',
    })
    uid: string;

    @Column('varchar', {
        nullable: false,
        primary: true,
        length: 50,
        name: 'library_code',
    })
    library_code: string;

    @Column('varchar', {
        nullable: true,
        length: 50,
        name: 'library_name',
    })
    library_name: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'update_url',
    })
    update_url: string | null;

    @Column('varchar', {
        nullable: true,
        length: 100,
        name: 'add_url',
    })
    add_url: string | null;

    @Column('varchar', {
        nullable: true,
        length: 100,
        name: 'save_url',
    })
    save_url: string | null;

    @Column('varchar', {
        nullable: true,
        length: 100,
        name: 'grid_name',
    })
    grid_name: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'colData',
    })
    colData: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'tableData',
    })
    tableData: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'filterAsset',
    })
    filterAsset: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'searchFields',
    })
    searchFields: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'setActions',
    })
    setActions: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'button',
    })
    button: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'showSettings',
    })
    showSettings: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'filterData',
    })
    filterData: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'filterListsSet',
    })
    filterListsSet: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'defaultFilters',
    })
    defaultFilters: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'tableDataReq',
    })
    tableDataReq: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'colDataReq',
    })
    colDataReq: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'filterDataReq',
    })
    filterDataReq: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'userFiltersDataReq',
    })
    userFiltersDataReq: string | null;

    @Column('bit', {
        nullable: true,
        name: 'allow_add',
    })
    allow_add: boolean | null;

    @Column('bit', {
        nullable: true,
        name: 'allow_update',
    })
    allow_update: boolean | null;

    @Column('bit', {
        nullable: true,
        name: 'allow_delete',
    })
    allow_delete: boolean | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'add_api',
    })
    add_api: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'update_api',
    })
    update_api: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'formStructure',
    })
    formStructure: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'formValues',
    })
    formValues: string | null;

    @Column('varchar', {
        nullable: true,
        length: 100,
        name: 'module_code',
    })
    module_code: string | null;

    @Column('varchar', {
        nullable: true,
        length: 100,
        name: 'function_code',
    })
    function_code: string | null;

    @Column('bit', {
        nullable: true,
        default: '((1))',
        name: 'active_status',
    })
    active_status: boolean | null;

    @Column('int', {
        nullable: true,
        name: 'created_by',
    })
    created_by: number | null;

    @Column('datetime', {
        nullable: true,
        name: 'date_of_creation',
    })
    date_of_creation: Date | null;

    @Column('int', {
        nullable: true,
        name: 'modified_by',
    })
    modified_by: number | null;

    @Column('datetime', {
        nullable: true,
        name: 'date_of_modification',
    })
    date_of_modification: Date | null;

    @Column('varchar', {
        nullable: true,
        name: 'data',
    })
    data: string | null;

    @Column('varchar', {
        nullable: true,
        length: 100,
        name: 'table_name',
    })
    table_name: string | null;

    @Column('varchar', {
        nullable: true,
        length: 500,
        name: 'delete_api',
    })
    delete_api: string | null;
}
