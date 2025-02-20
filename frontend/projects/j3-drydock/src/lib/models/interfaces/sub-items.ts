import { eSubItemsFields } from '../enums/sub-items.enum';

export interface SubItem {
  [eSubItemsFields.ItemNumber]?: string;
  [eSubItemsFields.Uid]?: string;
  [eSubItemsFields.Subject]: string;
  [eSubItemsFields.Description]: string;
}
