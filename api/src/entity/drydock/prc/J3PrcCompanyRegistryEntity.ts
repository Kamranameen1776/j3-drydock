import { Column, Entity } from 'typeorm';

@Entity('j3_prc_company_registry', { schema: 'prc' })
export class J3PrcCompanyRegistryEntity {
    @Column('uniqueidentifier', { primary: true, name: 'uid' })
    uid: string;
    @Column('varchar', { name: 'registered_name', length: 100 })
    registeredName: string;
    @Column('varchar', { name: 'registration_number', length: 100 })
    registrationNumber: string;
    @Column('varchar', { name: 'reference_code', nullable: true, length: 100 })
    referenceCode: string | null;
    @Column('varchar', { name: 'supplier_id', length: 50 })
    supplierId: string;
    @Column('varchar', { name: 'client_supplier_uid', length: 50 })
    clientSupplierUid: string;
    @Column('varchar', { name: 'type_uid', nullable: true, length: 50 })
    typeUid: string | null;
    @Column('varchar', { name: 'type', nullable: true, length: 50 })
    type: string | null;
    @Column('varchar', { name: 'country_id', nullable: true, length: 50 })
    countryId: string | null;
    @Column('varchar', { name: 'country', nullable: true, length: 100 })
    country: string | null;
    @Column('varchar', { name: 'city', nullable: true, length: 100 })
    city: string | null;
    @Column('datetimeoffset', { name: 'expiry_date', nullable: true })
    expiryDate: Date | null;
    @Column('varchar', { name: 'current_status', nullable: true, length: 50 })
    currentStatus: string | null;
    @Column('varchar', { name: 'proposed_status', nullable: true, length: 50 })
    proposedStatus: string | null;
    @Column('varchar', {
        name: 'mode_of_communication',
        nullable: true,
        length: 25,
    })
    modeOfCommunication: string | null;
    @Column('int', { name: 'rating', nullable: true })
    rating: number | null;
    @Column('bit', { name: 'is_spc', nullable: true })
    isSpc: boolean | null;
    @Column('bit', { name: 'is_contracted', nullable: true })
    isContracted: boolean | null;
    @Column('datetimeoffset', { name: 'last_quotation', nullable: true })
    lastQuotation: Date | null;
    @Column('varchar', { name: 'currencies', nullable: true, length: 100 })
    currencies: string;

    @Column('bit', {
        name: 'active_status',
        nullable: true,
        default: () => '(1)',
    })
    activeStatus: boolean | null;

    @Column('datetimeoffset', {
        name: 'timestamp',
        nullable: true,
        default: () => 'getutcdate()()',
    })
    timestamp: Date | null;

    @Column('varchar', { name: 'activity', nullable: true, length: 300 })
    activity: string | null;
}
