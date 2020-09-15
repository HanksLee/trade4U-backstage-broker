import React from "react";
import { Link } from "react-router-dom";
import api from "services";
import {
  Button,
  Select,
  Input,
  Table,
  DatePicker,
  Checkbox,
  Icon,
  Pagination,
  Spin,
  Tag,
  Row,
  Col,
  Form
} from "antd";
import { MARKET_TYPE } from "constant";
import moment from "moment";
import axios from "axios";
import styles from "../index.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
const CancelToken = axios.CancelToken;
let cancelPrevRequest;

const columns = [
  {
    title: "产品名称",
    dataIndex: "stock_name",
    key: "stock_name",
  },
  {
    title: "品种",
    dataIndex: "market",
    key: "market",
  },
  {
    title: "申购代码",
    dataIndex: "stock_code",
    key: "stock_code",
  },
  {
    title: "发行价格",
    dataIndex: "public_price",
    key: "public_price",
  },
  {
    title: "合约大小",
    dataIndex: "lots_size",
    key: "lots_size",
  },
  {
    title: "申购开始日",
    dataIndex: "subscription_date_start",
    key: "subscription_date_start",
  },
  {
    title: "申购截止日",
    dataIndex: "subscription_date_end",
    key: "subscription_date_end",
  },
  {
    title: "上市日期",
    dataIndex: "public_date",
    key: "public_date",
  },
  {
    title: "中签公布日",
    dataIndex: "draw_result_date",
    key: "draw_result_date",
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
    render: (text, record, index) => {
      // console.log("text,record :>> ", text, record);
      const stock_name = record["stock_name"];
      // 跳转到中签管理页，并筛选出此产品之明细
      return (
        <Link
          to={`/dashboard/newstock/lottery/list?stock_name=${stock_name}`}
          style={{ color: "#1890ff", }}
        >
          {text}
        </Link>
      );
    },
  }
];
// const fakeDataSource = [
//   {
//     key: "1",
//     stock_name: "众望布艺",
//     market: "港股",
//     stock_code: "707003",
//     public_price: "22.1",
//     lots_size: "0.90672",
//     subscription_date_start: "2020-08-07",
//     subscription_date_end: "2020-08-30",
//     public_date: "2020-09-10",
//     draw_result_date: "2020-08-30",
//     operation: "抽签明细",
//   }
// ];
class SubscriptionList extends React.Component {
  state = {
    filter: {
      stock_name: "",
      stock_code: "",
      品种: "",
    },
    dataSource: [],
    page: 1,
    pageSize: 10,
    total: null,
  };
  componentDidMount() {
    this.fetchData();
  }
  fetchData = async () => {
    const { pageSize, page, } = this.state;
    if (cancelPrevRequest) cancelPrevRequest();
    const res = await api.newStock.getSubscriptionList({
      params: {
        page: page,
        page_size: pageSize,
      },
      cancelToken: new CancelToken(c => (cancelPrevRequest = c)),
    });
    // console.log("SubscriptionList res :>> ", res);

    const dataSource = res.data.results.map(each => {
      const data = this.mapApiDataToDataSource(each);
      return data;
    });
    this.setState({ dataSource, total: res.data.count, });
  };
  mapApiDataToDataSource = raw => {
    const payload = { ...raw, };
    const {
      public_date,
      subscription_date_start,
      subscription_date_end,
      draw_result_date,
      market,
    } = payload;
    payload["key"] = payload["id"];
    payload["public_date"] =
      public_date && moment(public_date).format("YYYY-MM-DD");
    payload["subscription_date_start"] =
      subscription_date_start &&
      moment(subscription_date_start).format("YYYY-MM-DD");
    payload["subscription_date_end"] =
      subscription_date_end &&
      moment(subscription_date_end).format("YYYY-MM-DD");
    payload["draw_result_date"] =
      draw_result_date && moment(draw_result_date).format("YYYY-MM-DD");
    payload["market"] = MARKET_TYPE[market]?.name;
    payload["operation"] = "抽签明细";
    return payload;
  };
  mapDataSourceToApiData = raw => {
    return raw;
  };

  handleSearch = () => {
    // 搜寻前先重置分页状态
    this.setState({ page: 1, pageSize: 10, });
    queueMicrotask(() => this.fetchData());
  };
  handleReset = () => {};
  handlePaginationChange = (page, pageSize) => {
    this.setState({ page, pageSize, });
    queueMicrotask(() => this.fetchData());
  };
  renderFilter = () => {
    const formItemLayout = {
      labelCol: { span: 6, },
      wrapperCol: { span: 18, },
    };
    return (
      <Row>
        <Col span={16}>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item label="品种名称" {...formItemLayout}>
                  <Input placeholder="请输入品种名称"></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="产品编码" {...formItemLayout}>
                  <Input placeholder="请输入产品编码"></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="品种类型" {...formItemLayout}>
                  <Select
                    placeholder="请选择品种类型"
                    style={{ width: "100%", }}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="状态" {...formItemLayout}>
                  <Select placeholder="请选择状态"></Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={8}>
          <div style={{ display: "flex", justifyContent: "center", }}>
            <Button type="primary" className={cx("search-button")} onClick={this.handleSearch}>
              查询
            </Button>
            <Button className={cx("search-button")}>重置</Button>
          </div>
        </Col>
      </Row>
    );
  };
  render() {
    const { dataSource, pageSize, page, total, } = this.state;
    return (
      <div className="common-list">
        {this.renderFilter()}
        <section className="common-list-table">
          <Table
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: true, }}
            pagination={false}
          />
          <Pagination
            total={total}
            pageSize={pageSize}
            onChange={this.handlePaginationChange}
            current={page}
          />
        </section>
      </div>
    );
  }
}

export default SubscriptionList;
