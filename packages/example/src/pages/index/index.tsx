import { useEffect, useMemo, useState } from "react";
import { View, Text, MatchMedia, Input } from "@tarojs/components";
import Taro, { usePullDownRefresh } from "@tarojs/taro";
import Table from "taro-nice-table";
import "taro-nice-table/dist/style.css";
import "./index.scss";

const sleep = (s = 1000) => new Promise((r) => setTimeout(r, s));

const Editable = () => {
  const [editable, setEditable] = useState(false);
  return (
    <View>
      {!editable && <Text onClick={() => setEditable(true)}>测试</Text>}
      {editable && <Input placeholder="请输入内容" />}
    </View>
  );
};

// 模拟请求假数据
const queryData = async (opt?: {
  page: number;
  page_size: number;
}): Promise<any> => {
  await sleep(1000);

  const { page = 1, page_size = 5 } = opt || {};
  const total_rows = 53;
  const size = (() => {
    const max_page = Math.ceil(total_rows / Number(page_size));
    if (Number(page) < max_page) {
      return page_size;
    }
    if (Number(page) === max_page) {
      return total_rows % Number(page_size);
    }
    return 0;
  })();

  const list = new Array(Number(size)).fill(null).map((_, index) => {
    const key = String(Math.ceil(Math.random() * 1e5));
    return {
      user_id: key,
      username: `name_${page}_${index}`,
      telephone: Math.ceil(Math.random() * 1e11),
      price: (Math.random() * 1e3).toFixed(2),
      sex: Number(Math.random() > 0.5),
      address: `地址_${page}_${key}`,
      orderInfo: {
        price: (Math.random() * 1e3).toFixed(2),
        orderName: `orderName_${key}`,
        createTime: `createTime_${key}`,
      },
      createTime: new Date().toLocaleString(),
      status: Math.random() > 0.5,
    };
  });

  return {
    data: list,
    pager: {
      page,
      page_size,
      total_rows,
    },
  };
};

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any[]>([]);

  const columns = useMemo(() => {
    return [
      {
        title: <View>测试游戏ia</View>,
        width: 70,
        dataIndex: "user_id",

        // 左固定列示例
        fixed: "left" as "left",
      },
      {
        title: "用户名",
        dataIndex: "username",
        // 自定义render
        render: Editable,
      },
      {
        title: "性别",
        dataIndex: "sex",
        width: 60,
        render: (t) => {
          switch (String(t)) {
            case "0":
              return "男";
            case "1":
              return "女";
            default:
              return "-";
          }
        },
      },
      // 服务端排序示例，结合 onSort 钩子请求后端数据
      {
        title: "手机号",
        dataIndex: "telephone",
      },
      {
        title: "余额",
        dataIndex: "price",
        render: (t) => "￥" + t,
      },
      {
        title: "地址",
        dataIndex: "address",
      },
      {
        title: "订单金额",
        dataIndex: "orderInfo",
        render: (_, record) => record?.orderInfo?.price,
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
      },
    ];
  }, []);

  const [ww, setWW] = useState(0);

  useEffect(() => {
    fetchData();
    const { windowWidth } = Taro.getSystemInfoSync();
    console.log("窗口宽度", windowWidth);
    // ww === 0 && setWW(windowWidth);
    Taro.onWindowResize((r) => {
      console.log(
        "%c debug",
        "background: #69c0ff; color: white; padding: 4px",
        r.size
      );

      setWW(r.size.windowWidth);
    });
  }, [ww]);

  // 下拉刷新示例
  usePullDownRefresh(() => {
    fetchData().then(() => {
      Taro.stopPullDownRefresh();
    });
  });

  const fetchData = async (): Promise<any[]> => {
    setLoading(true);
    const { data } = await queryData({ page: 1, page_size: 20 });
    setDataSource(data);
    setLoading(false);
    return data;
  };

  const [tableHeight, setTableHeight] = useState<undefined>();

  useEffect(() => {
    requestAnimationFrame(() => {
      Taro.createSelectorQuery()
        .select("#table-box")
        .boundingClientRect()
        .exec((res) => {
          console.log(
            "%c debug",
            "background: #69c0ff; color: white; padding: 4px",
            res
          );
          setTableHeight(res[0].height);
        });
    });
  }, [dataSource]);

  return (
    <View
      className="example"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <View style={{ height: "200Px", flexShrink: 0 }}></View>
      <View style={{ flexGrow: 1, height: 10 }} id="table-box">
        {tableHeight && (
          <Table
            colStyle={{ padding: "0 5px" }}
            columns={columns}
            dataSource={dataSource}
            rowKey="user_id"
            loading={loading}
            rowStyle={(_, index) => {
              if (index === 0) {
                return {
                  position: "sticky",
                  top: "48px",
                  borderBottom: "1px solid #e5e5e5",
                  zIndex: 93,
                };
              }
              if (index === 1) {
                return { borderTop: "none" };
              }
              return {};
            }}
            style={{
              margin: "0 auto",
              width: "100vw",
            }}
            // 固定表头、横向滚动 示例
            scroll={{
              x: "100vw",
              y: tableHeight,
            }}
          />
        )}
      </View>
    </View>
  );
};
