export interface ODataRequest {
  $filter: string;
  $select: string;
  $skip: string;
  $top: string;
  $orderby: string;
  $expand: string;
  $count: string;
  $distinct: string;
}
