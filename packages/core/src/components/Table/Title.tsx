import React from "react";
import cn from "clsx";
import { Text, View } from "@tarojs/components";
import { IColumns } from "./types";
import { DEFAULT_COL_WIDTH, JC_TA_MAP } from "./Table";
import { calculateFixedDistance, getSize } from "./utils";

export const Title = (titleProps: {
  key: any;
  column: IColumns;
  index: number;
  titleClassName: string;
  handleClickTitle: (item: IColumns, index: number) => void;
  columns: IColumns[];
  titleStyle: React.CSSProperties;
}): JSX.Element => {
  const {
    column,
    index,
    titleClassName,
    handleClickTitle,
    columns,
    titleStyle,
  } = titleProps;

  return (
    <View
      onClick={handleClickTitle.bind(this, column, index)}
      className={cn({
        taro3table_title: true,
        taro3table_fixed: column.fixed,
        [column.titleClassName || ""]: true,
        [titleClassName]: true,
      })}
      style={{
        [column.fixed as string]:
          column.fixed &&
          calculateFixedDistance({
            fixedType: column.fixed,
            index,
            columns,
          }),
        width: getSize(column.width || DEFAULT_COL_WIDTH),
        ...column.titleStyle,
        ...titleStyle,
        justifyContent: column.align && JC_TA_MAP[column.align],
      }}
      key={column.key || column.dataIndex}
    >
      {typeof column.title === "string" ? (
        <Text>{column.title}</Text>
      ) : (
        column.title
      )}
      {column.sort && (
        <View className="taro3table_sortBtn">
          <View
            className={cn({
              taro3table_btn: true,
              taro3table_ascend: true,
              taro3table_active: column.sortOrder === "ascend",
            })}
          />
          <View
            className={cn({
              taro3table_btn: true,
              taro3table_descend: true,
              taro3table_active: column.sortOrder === "descend",
            })}
          />
        </View>
      )}
    </View>
  );
};
