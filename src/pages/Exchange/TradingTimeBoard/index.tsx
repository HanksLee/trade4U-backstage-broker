import * as React from "react";
import { TimePicker, Row, Col, Table } from "antd";
import { DAYS_OF_WEEK } from "constant";
import moment from "moment";
import styles from "./index.module.scss";
import classnames from "classnames/bind";
const cx = classnames.bind(styles);

export function TradingTimeBoard(props) {
  const formatData = data => {
    return Object.values(data)
      .map((each, index) => {
        // if (each.trades.length < 1) return null;
        const day = `${DAYS_OF_WEEK[index]["en-us"]} ${DAYS_OF_WEEK[index]["zh-cn"]}`;
        const tradingTimeAM = each.trades.slice(0, 2);
        const tradingTimePM = each.trades.slice(2);
        return { day, tradingTimeAM, tradingTimePM, };
      })
      .filter(v => v);
  };
  const dataSource = formatData(props.data);
  // console.log("dataSource :>> ", dataSource);
  const timestampToMoment = timestamp => {
    const hhmmss = moment(timestamp).format("HH:mm:ss");
    return moment(hhmmss, "HH:mm:ss");
  };
  const columns = [
    {
      title: "交易日",
      dataIndex: "day",
      key: "day",
    },
    {
      title: "上午交易时段",
      dataIndex: "tradingTimeAM",
      key: "tradingTimeAM",
      render(text, record) {
        const { tradingTimeAM, } = record;
        const [from, to] = tradingTimeAM;
        return (
          <div className={cx("time-picker-wrap")}>
            <TimePicker
              disabled
              defaultValue={timestampToMoment(from)}
            ></TimePicker>
            <TimePicker
              disabled
              defaultValue={timestampToMoment(to)}
            ></TimePicker>
          </div>
        );
      },
    },
    {
      title: "下午交易时段",
      dataIndex: "tradingTimePM",
      key: "tradingTimePM",
      render(text, record) {
        const { tradingTimePM, } = record;
        const [from, to] = tradingTimePM;
        return (
          <div className={cx("time-picker-wrap")}>
            <TimePicker
              disabled
              defaultValue={timestampToMoment(from)}
            ></TimePicker>
            <TimePicker
              disabled
              defaultValue={timestampToMoment(to)}
            ></TimePicker>
          </div>
        );
      },
    }
  ];
  return (
    <Table
      className={cx("trading-time-board")}
      pagination={false}
      dataSource={dataSource}
      columns={columns}
      rowKey="day"
    />
  );
}

// const mockTradingTime = {
//   "0": {
//     trades: [1585531800, 1585540800, 1585544400, 1585555200],
//   },
//   "1": {
//     trades: [1585531800, 1585540800, 1585544400, 1585555200],
//   },
//   "2": {
//     trades: [1585497600, 1585540800, 1585544400, 1585555200],
//   },
//   "3": {
//     trades: [1585531800, 1585540800, 1585544400, 1585555200],
//   },
//   "4": {
//     trades: [1585531800, 1585540800, 1585544400, 1585555200],
//   },
//   "5": {
//     trades: [],
//   },
//   "6": {
//     trades: [],
//   },
// };
