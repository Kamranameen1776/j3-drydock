export interface HeaderInfoDto {
  uid: string;
  reference: string;
  status: string;
  dg?: boolean;
  ihm?: boolean;
  ec?: boolean;
  critical?: boolean;
}
