import { ODataRequest, RequestWithOData } from "../../../../shared/interfaces";

export interface GetSpecificationRequisitionsRequestDto extends RequestWithOData {
  body: {
    odata: ODataRequest;
    uid: string;
  }
}
