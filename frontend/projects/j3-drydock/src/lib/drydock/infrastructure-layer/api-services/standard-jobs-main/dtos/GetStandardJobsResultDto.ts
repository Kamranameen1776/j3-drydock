import { IGridCellStyle } from 'jibe-components';

// TODO can change all + need also data fields for create new popup
export class GetStandardJobsMainResultDto {
  public ItemNumber: string;

  public Subject: Partial<IGridCellStyle>;

  public VesselType: string;

  public ItemCategory: string;

  public Inspection: string;

  public DoneBy: string;

  public MaterialSuppliedBy: string;
}
