import * as React from "react";
import { TimePicker, Row, Col } from "antd";
import moment from "moment";
import styles from "./index.module.scss";
import classnames from "classnames/bind";
const cx = classnames.bind(styles);


export function TradingTimeBoard(props) {
  const raw = {
    "0": {
      trades: [1585531800, 1585540800, 1585544400, 1585555200],
    },
    "1": {
      trades: [1585531800, 1585540800, 1585544400, 1585555200],
    },
    "2": {
      trades: [1585497600, 1585540800, 1585544400, 1585555200],
    },
    "3": {
      trades: [1585531800, 1585540800, 1585544400, 1585555200],
    },
    "4": {
      trades: [1585531800, 1585540800, 1585544400, 1585555200],
    },
    "5": {
      trades: [],
    },
    "6": {
      trades: [],
    },
  };
  const dayString = {
    0: "Monday",
    1: "Tuesday",
    2: "Wednesday",
    3: "Thursday",
    4: "Friday",
    5: "Saturday",
    6: "Sunday",
  };
  function formatData(raw) {
    return Object.values(raw)
      .map((each, index) => {
        if (each.trades.length < 1) return null;
        const beforenoon = each.trades.slice(0, 2);
        const afternoon = each.trades.slice(2);
        return { day: dayString[index], beforenoon, afternoon, };
      })
      .filter(v => v);
  }
  const data = formatData(raw);
  // console.log("data :>> ", data);
  function timestampToMoment(timestamp) {
    const hhmmss = moment(timestamp).format("HH:mm:ss");
    return moment(hhmmss, "HH:mm:ss");
  }

  return (
    <div>
      <Row>
        <Col span={8}>交易日</Col>
        <Col span={8}>上午交易时间</Col>
        <Col span={8}>下午交易時間</Col>
      </Row>
      {Object.values(data).map((each, idx) => (
        <Row key={idx}>
          <Col span={8}>{each.day}</Col>
          <Col span={8}>
            {each.beforenoon.map((timestamp, idx) => (
              <TimePicker
                key={idx}
                defaultValue={timestampToMoment(timestamp)}
                disabled
              />
            ))}
          </Col>
          <Col span={8}>
            {each.afternoon.map((timestamp, idx) => (
              <TimePicker
                key={idx}
                defaultValue={timestampToMoment(timestamp)}
                disabled
              />
            ))}
          </Col>
        </Row>
      ))}
    </div>
  );
}
