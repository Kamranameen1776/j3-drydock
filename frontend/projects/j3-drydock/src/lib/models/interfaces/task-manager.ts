export interface NextWorkflow {
  ID: number;
  Config_ID: 97;
  Workflow_Display: string;
  WorkflowType_ID: string;
  Workflow_OrderID: number;
  Is_Office: number;
  Created_By: number;
  Date_Of_Creation: string;
  Modified_By: number;
  Date_Of_Modification: string;
  Deleted_By: number;
  Date_Of_Deletion: string;
  Active_Status: number;
  Display_name_pass: string;
  Display_name_action: string;
  right_code: string;
  status_display_name: string;
  is_rework: boolean;
  last_WorkflowType: string;
  last_Display_name_action: string;
  last_status_right_code: string;
  Is_Vessel_Install: boolean;

  Is_Postpone: unknown;
  config_details: unknown;
  internal_config: unknown;
  Day_Until_overdue: unknown;
  DashBoard_Alert_Days: unknown;
}
