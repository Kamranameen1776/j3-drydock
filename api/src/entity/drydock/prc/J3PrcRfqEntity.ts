import { Column, Entity, Index } from 'typeorm';

@Index('PK_j3_prc_rfq_uid', ['uid'], { unique: true })
@Entity('j3_prc_rfq', { schema: 'prc' })
export class J3PrcRfqEntity {
  @Column('uniqueidentifier', { primary: true, name: 'uid' })
  uid: string;

  @Column('uniqueidentifier', { name: 'requisition_uid', nullable: false })
  requisitionUid: string;

  @Column('varchar', { name: 'requisition_number', nullable: true, length: 50 })
  requisitionNumber: string | null;

  @Column('uniqueidentifier', { name: 'rfq_status_uid', nullable: true })
  rfqStatusUid: string | null;

  @Column('uniqueidentifier', { name: 'supplier_uid', nullable: false })
  supplierUid: string | null;

  @Column('varchar', { name: 'labels', nullable: true, length: 2000 })
  labels: string | null;

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

  @Column('bit', { name: 'send_rfq', nullable: true, default: () => '(0)' })
  sendRfq: boolean | null;

  @Column('int', { name: 'item_count', nullable: true })
  itemCount: number | null;

  @Column('int', { name: 'delivery_port_id', nullable: true })
  deliveryPortId: number | null;

  @Column('varchar', { name: 'delivery_remark', nullable: true, length: 2000 })
  deliveryRemark: string | null;

  @Column('datetimeoffset', { name: 'delivery_date', nullable: true })
  deliveryDate: Date | null;

  @Column('varchar', { name: 'rfq_remark', nullable: true, length: 2000 })
  rfqRemark: string | null;

  @Column('datetimeoffset', { name: 'quotation_due_date', nullable: true })
  quotationDueDate: Date | null;

  @Column('varchar', { name: 'purchaser', nullable: true, length: 2000 })
  purchaser: string | null;

  @Column('varchar', { name: 'rfq_status', nullable: true, length: 10 })
  rfqStatus: string | null;

  @Column('datetimeoffset', { name: 'rfq_send_date', nullable: true })
  rfqSendDate: Date | null;

  @Column('varchar', { name: 'state', nullable: true, length: 50 })
  state: string | null;
}
