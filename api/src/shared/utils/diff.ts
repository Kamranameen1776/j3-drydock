export function diffArray(arr1: any[], arr2: any[]) {
    return arr1.filter((x) => !arr2.includes(x)).concat(arr2.filter((x) => !arr1.includes(x)));
}
