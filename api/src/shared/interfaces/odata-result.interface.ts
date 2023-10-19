export interface ODataResult<T> {
    records: T[];
    count?: number;
}
