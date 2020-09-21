import * as React from "react";
import { TimePicker, Row, Col, Table } from "antd";
import moment from "moment";
import styles from "./index.module.scss";
import classnames from "classnames/bind";
const cx = classnames.bind(styles);

export function TradingTimeBoard(props) {
  const dayString = {
    0: "Monday 周一",
    1: "Tuesday 周二",
    2: "Wednesday 周三",
    3: "Thursday 周四",
    4: "Friday 周五",
    5: "Saturday 周六",
    6: "Sunday 周日",
  };
  const formatData = data => {
    return Object.values(data)
      .map((each, index) => {
        if (each.trades.length < 1) return null;
        const morning = each.trades.slice(0, 2);
        const afternoon = each.trades.slice(2);
        return { day: dayString[index], morning, afternoon, };
      })
      .filter(v => v);
  };
  const dataSource = formatData(props.data);
  // console.log("data :>> ", data);
  function timestampToMoment(timestamp) {
    const hhmmss = moment(timestamp).format("HH:mm:ss");
    return moment(hhmmss, "HH:mm:ss");
  }
  const columns = [
    {
      title: "交易日",
      dataIndex: "day",
      key: "day",
    },
    {
      title: "上午交易时段",
      dataIndex: "morning",
      key: "morning",
      render(text, record) {
        const { morning, } = record;
        const [from, to] = morning;
        return (
          <React.Fragment>
            <TimePicker
              disabled
              defaultValue={timestampToMoment(from)}
            ></TimePicker>
            <TimePicker
              disabled
              defaultValue={timestampToMoment(to)}
            ></TimePicker>
          </React.Fragment>
        );
      },
    },
    {
      title: "下午交易时段",
      dataIndex: "afternoon",
      key: "afternoon",
      render(text, record) {
        const { afternoon, } = record;
        const [from, to] = afternoon;
        return (
          <React.Fragment>
            <TimePicker
              disabled
              defaultValue={timestampToMoment(from)}
            ></TimePicker>
            <TimePicker
              disabled
              defaultValue={timestampToMoment(to)}
            ></TimePicker>
          </React.Fragment>
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
