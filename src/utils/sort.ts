const descendingComparator = (a, b, orderBy) => {
  const maybeNestedOrderBy = orderBy.split(".");
  let aValue;
  let bValue;
  if (maybeNestedOrderBy.length === 2) {
    aValue =
      a[maybeNestedOrderBy[0]] &&
      a[maybeNestedOrderBy[0]][maybeNestedOrderBy[1]];
    bValue =
      b[maybeNestedOrderBy[0]] &&
      b[maybeNestedOrderBy[0]][maybeNestedOrderBy[1]];
  } else {
    aValue = a[orderBy];
    bValue = b[orderBy];
  }

  // null will sort after everything else when ascending
  if (aValue === null) {
    return 1;
  }
  if (bValue === null) {
    return 1;
  }
  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
};

export type Order = "asc" | "desc";

export const getComparator = (order: Order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
