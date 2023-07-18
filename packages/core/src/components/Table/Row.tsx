import React, { memo } from "react";
import cn from "clsx";
import { Text, View } from "@tarojs/components";
import { AnyOpt, IColumns } from "./types";

export const Row = memo(
  (props: {
    key: any;
    dataSourceItem: AnyOpt;
    index: number;
    rowKey: string;
    rowClassName: string;
    rowStyle: any;
    columns: IColumns[];
    expansion: boolean;
    setExpansion: (val: boolean) => void;
    colClassName: string;
    getSize: (size: string | number) => string;
    DEFAULT_COL_WIDTH: number;
    calculateFixedDistance: (val: any) => string;
    colStyle: any;
  }): JSX.Element => {
    const {
      dataSourceItem,
      index,
      rowKey,
      rowClassName,
      rowStyle,
      columns,
      expansion,
      setExpansion,
      colClassName,
      getSize,
      DEFAULT_COL_WIDTH,
      calculateFixedDistance,
      colStyle,
    } = props;

    console.log(
      "%c debug[row]",
      "background: #69c0ff; color: white; padding: 4px"
    );

    return (
      <View
        key={dataSourceItem[rowKey]}
        className={cn({
          taro3table_row: true,
          [rowClassName]: true,
        })}
        style={rowStyle}
      >
        {columns.map((columnItem: IColumns, colIndex: number): JSX.Element => {
          const text = dataSourceItem[columnItem.dataIndex];
          const expandable = columnItem.expandable !== false;
          let result;

          if (columnItem.render) {
            const render = columnItem.render(text, dataSourceItem, index);

            if (typeof render !== "object") {
              result = <Text>{render}</Text>;
            } else {
              result = render;
            }
          } else {
            result = <Text>{String(text)}</Text>;
          }

          return (
            <View
              onClick={expandable && setExpansion.bind(this, !expansion)}
              key={columnItem.key || columnItem.dataIndex}
              className={cn({
                [colClassName]: true,
                taro3table_col: true,
                taro3table_fixed: columnItem.fixed,
                taro3table_expansion: expansion,
                [columnItem.className as string]: true,
              })}
              style={{
                textAlign: columnItem.align || "center",
                width: getSize(columnItem.width || DEFAULT_COL_WIDTH),
                [columnItem.fixed as string]:
                  columnItem.fixed &&
                  calculateFixedDistance({
                    fixedType: columnItem.fixed,
                    index: colIndex,
                    columns,
                  }),
                ...columnItem.style,
                ...colStyle,
              }}
            >
              {result}
            </View>
          );
        })}
      </View>
    );
  }
);
