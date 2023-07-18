import Taro from "@tarojs/taro";
import { AnyOpt, CompareFn, FixedType, IColumns, SortOrder } from "./types";
import { DEFAULT_COL_WIDTH } from "./Table";

export const getSize = (size: string | number): string => {
  if (typeof size === "number") {
    return Taro.pxTransform((size as number) * 2);
  } else {
    return String(size);
  }
};
const compare = (a, b, sortOrder: SortOrder = "ascend"): number => {
  if (Number.isNaN(Number(a)) || Number.isNaN(Number(b))) {
    if (sortOrder === "ascend") {
      return a.localeCompare(b);
    } else {
      return b.localeCompare(a);
    }
  }
  if (sortOrder === "ascend") {
    return Number(a || 0) - Number(b || 0) || 0;
  } else {
    return Number(b || 0) - Number(a || 0) || 0;
  }
};
export const doSort = (opts: { columns: IColumns[]; dataSource: AnyOpt[] }) => {
  const { columns, dataSource } = opts;

  // 查找需要排序的列
  const sortColumns: IColumns[] =
    columns.filter((item) => item.sortOrder) || [];

  if (sortColumns.length === 0) {
    return dataSource;
  }

  // 根据多列排序优先级对 sortColumns 进行排序，优先级高的放在最后
  sortColumns.sort((a, b): number => {
    return (a.sortLevel || 0) - (b.sortLevel || 0);
  });

  // 计算排序结果
  let result: AnyOpt[] = dataSource;

  sortColumns.forEach((column: IColumns) => {
    const dataIndex: string = column.dataIndex;
    const sortOrder: SortOrder = column.sortOrder;
    const sorter: CompareFn | boolean | undefined = column.sorter;

    const temp: AnyOpt[] = [...result];

    temp.sort((a, b): number => {
      if (sorter) {
        if (typeof sorter === "function") {
          return sorter(a, b, sortOrder);
        } else {
          return 0;
        }
      }

      return compare(a[dataIndex], b[dataIndex], sortOrder);
    });

    result = temp;
  });

  return result;
};
// 固定列的时候计算偏移量

export const calculateFixedDistance = (opt: {
  fixedType: FixedType;
  index: number;
  columns: IColumns[];
}) => {
  const { fixedType, index, columns } = opt;
  let result: number;
  if (fixedType === "left") {
    result = columns.reduce(function (prev, cur, i) {
      if (i + 1 <= index) {
        return prev + (cur.width || DEFAULT_COL_WIDTH);
      } else {
        return prev;
      }
    }, 0);
  } else {
    result = columns.reduceRight(function (prev, cur, i) {
      if (i - 1 >= index) {
        return prev + (cur.width || DEFAULT_COL_WIDTH);
      } else {
        return prev;
      }
    }, 0);
  }

  return getSize(result);
};
