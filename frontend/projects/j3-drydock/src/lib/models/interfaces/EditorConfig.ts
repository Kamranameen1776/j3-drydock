import { ToolbarModule } from 'primeng';

export interface EditorConfig {
  id: string;

  maxLength: number;

  placeholder: string;

  crtlName: string;

  moduleCode: string;

  /**
   * Can be found in the `dbo.INF_Lib_Function` table
   */
  functionCode: string;

  inlineMode: object;

  vesselId?: number;

  key1?: string;

  tools?: ToolbarModule;
}
