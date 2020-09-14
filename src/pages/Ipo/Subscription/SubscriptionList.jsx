import React from "react";
import { Link } from "react-router-dom";
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

const dataSource = [
  {
    key: "1",
    产品名称: "众望布艺",
    品种: "港股",
    申购代码: "707003",
    发行价格: "22.1",
    合约大小: "0.90672",
    申购开始日: "2020-08-07",
    申购截止日: "2020-08-30",
    上市日期: "2020-09-10",
    中签公布日: "2020-08-30",
    操作: "抽签明细",
  }
];
class SubscriptionList extends React.Component {
  state = {};
  getColumns = () => {
    // ! 栏位名是暂定的，因为后端 api 还没做
    // TODO: 串接后端 api 栏位名
    const columns = [
      {
        title: "产品名称",
        dataIndex: "产品名称",
        key: "产品名称",
      },
      {
        title: "品种",
        dataIndex: "品种",
        key: "品种",
      },
      {
        title: "申购代码",
        dataIndex: "申购代码",
        key: "申购代码",
      },
      {
        title: "发行价格",
        dataIndex: "发行价格",
        key: "发行价格",
      },
      {
        title: "合约大小",
        dataIndex: "合约大小",
        key: "合约大小",
      },
      {
        title: "申购开始日",
        dataIndex: "申购开始日",
        key: "申购开始日",
      },
      {
        title: "申购截止日",
        dataIndex: "申购截止日",
        key: "申购截止日",
      },
      {
        title: "上市日期",
        dataIndex: "上市日期",
        key: "上市日期",
      },
      {
        title: "中签公布日",
        dataIndex: "中签公布日",
        key: "中签公布日",
      },
      {
        title: "操作",
        dataIndex: "操作",
        key: "操作",
        render: (text, record, index) => {
          console.log("text,record :>> ", text, record);
          console.log("this.props.history :>> ", this.props.history);
          const symbol = record["产品名称"];
          // 跳转到中签管理页，并筛选出此产品之明细
          return (
            <Link to={`/dashboard/ipo/lottery/list?symbol=${symbol}`}>
              {text}
            </Link>
          );
        },
      }
    ];
    return columns;
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
            <Button type="primary">查询</Button>
            <Button>重置</Button>
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
          <Table columns={this.getColumns()} dataSource={dataSource} />
        </section>
      </div>
    );
  }
}

export default SubscriptionList;
