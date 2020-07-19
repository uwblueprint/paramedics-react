const comparator = (a, b, orderBy: string, descending: boolean) => {
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

  // equal items sort equally
  if (a === b) {
    return 0;
  }
  // nulls sort after anything else
  else if (aValue === null) {
    return 1;
  } else if (bValue === null) {
    return -1;
  }
  // if descending, highest sorts first
  else if (descending) {
    return aValue < bValue ? 1 : -1;
  }
  // otherwise, if we're ascending, lowest sorts first
  else {
    return aValue < bValue ? -1 : 1;
  }
};

export type Order = "asc" | "desc";

export const getComparator = (order: Order, orderBy) => {
  return order === "desc"
    ? (a, b) => comparator(a, b, orderBy, true)
    : (a, b) => comparator(a, b, orderBy, false);
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
