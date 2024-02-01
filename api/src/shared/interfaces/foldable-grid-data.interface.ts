export interface FoldableGridData<T> {
    data: T;
    children?: FoldableGridData<T>[];
}
