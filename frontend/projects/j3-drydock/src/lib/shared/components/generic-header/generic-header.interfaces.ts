export interface HeaderButton {
  id?: string;
  buttonType?: string;
  buttonClass?: string;
  command: (event?: MouseEvent) => void;
  disabled?: boolean;
  label: string;
  tooltip?: string;
}

export interface HeaderSection {
  label: string;
  labelClass?: string;
  labelColor?: string;
  iconClass?: string;
  iconColor?: string;
}

export interface HeaderStatus<T extends string = string> {
  color: HeaderStatusColors;
  text: T;
}

export enum HeaderStatusColors {
  Red = 'var(--jbDarkRed)',
  Blue = 'var(--purpleDark)',
  Purple = 'var(--purpleMid)'
}

export declare const SpecificationStatuses: readonly [
  'Raise',
  'IN PROGRESS',
  'COMPLETE',
  'VERIFY',
  'REVIEW',
  'APPROVE',
  'CLOSE',
  'UNCLOSE'
];
export type SpecificationStatus = (typeof SpecificationStatuses)[number];

export const SpecificationHeaderStatuses: Record<SpecificationStatus, HeaderStatus> = {
  Raise: {
    color: HeaderStatusColors.Purple,
    text: 'Raise'
  },
  'IN PROGRESS': {
    color: HeaderStatusColors.Purple,
    text: 'In Progress'
  },
  COMPLETE: {
    color: HeaderStatusColors.Red,
    text: 'Completed'
  },
  VERIFY: {
    color: HeaderStatusColors.Red,
    text: 'Verified'
  },
  REVIEW: {
    color: HeaderStatusColors.Red,
    text: 'Reviewed'
  },
  APPROVE: {
    color: HeaderStatusColors.Red,
    text: 'Approved'
  },
  CLOSE: {
    color: HeaderStatusColors.Blue,
    text: 'Shipped'
  },
  UNCLOSE: {
    color: HeaderStatusColors.Blue,
    text: 'Shipped'
  }
};
