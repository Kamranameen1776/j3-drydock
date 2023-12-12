export interface BaseAccessRight {
  edit: boolean;
  delete: boolean;
  view: boolean;
}

export interface AttachmentsAccessRight extends BaseAccessRight {
  add: boolean;
}
