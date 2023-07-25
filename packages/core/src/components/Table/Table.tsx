// base
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import cn from "clsx";
import useDeepCompareEffect from "use-deep-compare-effect";
// components
import { ScrollView, View } from "@tarojs/components";
import "./style.less";

// types
import { AnyOpt, IColumns, Props, SortOrder } from "./types";
import { Row } from "./Row";
import { Title } from "./Title";
import { Loading } from "./Loading";
import { Empty } from "./Empty";
import { doSort, getSize, calculateFixedDistance } from "./utils";

// constants
export const DEFAULT_COL_WIDTH = 100; // 默认列宽
export const JC_TA_MAP = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

const Table = (props: Props): JSX.Element | null => {
  const {
    columns: pColumns = [],
    dataSource: pDataSource = [],
    rowKey = "",
    loading = false,
    className = "",
    style = {},
    titleClassName = "",
    titleStyle = {},
    rowClassName = "",
    rowStyle = {},
    colStyle = {},
    colClassName = "",
    onChange = (): void => {},
    multipleSort = false,
    scroll = {},
    isLastRowSticky = false,
  } = props;

  const [dataSource, setDataSource] = useState<AnyOpt[]>(pDataSource);
  const [columns, setColumns] = useState<IColumns[]>(pColumns);
  const [expansion, setExpansion] = useState<boolean>(false); // 是否展开

  useEffect(() => {
    onChange(dataSource);
  }, [dataSource, onChange]);

  useDeepCompareEffect(() => {
    setColumns(pColumns);
  }, [pColumns]);

  // 排序
  useEffect(() => {
    const result = doSort({ columns, dataSource: pDataSource });
    setDataSource(result);
  }, [columns, pColumns, pDataSource]);

  // 表头点击事件
  const handleClickTitle = useCallback(
    (item: IColumns, index: number): void => {
      if (!item.sort || loading) {
        return;
      }

      const temp: IColumns[] = [...columns];

      if (!multipleSort) {
        temp.forEach((j: IColumns, i: number): void => {
          if (i !== index) {
            delete j.sortOrder;
          }
        });
      }

      // 连续点击循环设置排序方式
      const array: SortOrder[] = ["ascend", "descend", undefined];
      const curr: number = array.indexOf(temp[index].sortOrder);
      const next: SortOrder = (temp[index].sortOrder =
        array[(curr + 1) % array.length]);
      item.onSort && item.onSort(next);
      setColumns(temp);
    },
    [columns, loading, multipleSort]
  );

  const wrapWidth = useMemo((): number => {
    return columns.reduce(function (prev, cur) {
      return prev + (cur.width || DEFAULT_COL_WIDTH);
    }, 0);
  }, [columns]);

  return (
    <View
      className={cn(["taro3table", className])}
      style={{
        width: wrapWidth,
        ...style,
      }}
    >
      {loading && <Loading />}
      <ScrollView
        className="taro3table_table"
        scroll-x={dataSource.length !== 0 && scroll.x}
        scroll-y={scroll.y}
        style={{
          maxWidth: getSize(scroll.x as number | string),
          maxHeight: getSize(scroll.y as number | string),
        }}
      >
        <View
          className={cn({
            taro3table_head: true,
            taro3table_scroll: scroll.y,
          })}
        >
          {columns.length === 0 ? (
            <Empty />
          ) : (
            columns.map((item: IColumns, index: number): JSX.Element => {
              return (
                <Title
                  key={item.key || item.dataIndex}
                  column={item}
                  index={index}
                  handleClickTitle={handleClickTitle}
                  columns={columns}
                  titleClassName={titleClassName}
                  titleStyle={titleStyle}
                />
              );
            })
          )}
        </View>
        <View className="taro3table_body">
          {dataSource.length > 0 ? (
            dataSource.map(
              (dataSourceItem: AnyOpt, index: number): JSX.Element => {
                return (
                  <Row
                    key={dataSourceItem[rowKey]}
                    dataSourceItem={dataSourceItem}
                    index={index}
                    rowKey={rowKey}
                    rowClassName={`${rowClassName} ${
                      isLastRowSticky && index === dataSource.length - 1
                        ? "taro3table_row_last_sticky"
                        : ""
                    }`}
                    rowStyle={rowStyle}
                    columns={columns}
                    expansion={expansion}
                    setExpansion={setExpansion}
                    colClassName={colClassName}
                    getSize={getSize}
                    DEFAULT_COL_WIDTH={DEFAULT_COL_WIDTH}
                    calculateFixedDistance={calculateFixedDistance}
                    colStyle={colStyle}
                  />
                );
              }
            )
          ) : (
            <Empty />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default memo(Table);
