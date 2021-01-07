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
              placeholder="尚未設定"
              defaultValue={from && timestampToMoment(from * 1000)}
            ></TimePicker>
            <TimePicker
              disabled
              placeholder="尚未設定"
              defaultValue={to && timestampToMoment(to * 1000)}
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
              placeholder="尚未設定"
              defaultValue={from && timestampToMoment(from * 1000)}
            ></TimePicker>
            <TimePicker
              disabled
              placeholder="尚未設定"
              defaultValue={to && timestampToMoment(to * 1000)}
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
