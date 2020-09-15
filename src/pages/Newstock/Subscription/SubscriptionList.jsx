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
import styles from "../index.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

// ! 栏位名是暂定的，因为后端 api 还没做
// TODO: 串接后端 api 栏位名
const columns = [
  {
    title: "产品名称",
    dataIndex: "stock_name",
    key: "stock_name",
  },
  {
    title: "品种",
    dataIndex: "品种",
    key: "品种",
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
      console.log("text,record :>> ", text, record);
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
// TODO: 目前后端只有港股栏位
const dataSource = [
  {
    key: "1",
    stock_name: "众望布艺",
    品种: "港股",
    stock_code: "707003",
    public_price: "22.1",
    lots_size: "0.90672",
    subscription_date_start: "2020-08-07",
    subscription_date_end: "2020-08-30",
    public_date: "2020-09-10",
    draw_result_date: "2020-08-30",
    operation: "抽签明细",
  }
];
class SubscriptionList extends React.Component {
  state = {
    filterInput: {
      stock_name: "",
      stock_code: "",
      品种: "",
    },
  };
  componentDidMount() {
    this.init();
  }
  init = async () => {
    const res = await api.newStock.getNewStockList();
    console.log("res :>> ", res);
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
            <Button type="primary" className={cx("search-button")}>
              查询
            </Button>
            <Button className={cx("search-button")}>重置</Button>
          </div>
        </Col>
      </Row>
    );
  };
  render() {
    return (
      <div className="common-list">
        {this.renderFilter()}
        <section className="common-list-table">
          <Table
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: true, }}
          />
        </section>
      </div>
    );
  }
}

export default SubscriptionList;
