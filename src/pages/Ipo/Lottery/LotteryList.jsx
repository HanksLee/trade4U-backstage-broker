import React from "react";
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
import utils from "utils";

// ! 栏位名是暂定的，因为后端 api 还没做
// TODO: 串接后端 api 栏位名
const columns = [
  {
    title: "名字",
    dataIndex: "名字",
    key: "名字",
  },
  {
    title: "手机号",
    dataIndex: "手机号",
    key: "手机号",
  },
  {
    title: "客户组",
    dataIndex: "客户组",
    key: "客户组",
  },
  {
    title: "新股申购名称",
    dataIndex: "新股申购名称",
    key: "新股申购名称",
  },
  {
    title: "数量",
    dataIndex: "数量",
    key: "数量",
  },
  {
    title: "申购金额",
    dataIndex: "申购金额",
    key: "申购金额",
  },
  {
    title: "融资比例",
    dataIndex: "融资比例",
    key: "融资比例",
  },
  {
    title: "融资金额",
    dataIndex: "融资金额",
    key: "融资金额",
  },
  {
    title: "已冻结资金",
    dataIndex: "已冻结资金",
    key: "已冻结资金",
  },
  {
    title: "状态",
    dataIndex: "状态",
    key: "状态",
  },
  {
    title: "申购日期",
    dataIndex: "申购日期",
    key: "申购日期",
  },
  {
    title: "中签公布日",
    dataIndex: "中签公布日",
    key: "中签公布日",
  },
  {
    title: "中签状态",
    dataIndex: "中签状态",
    key: "中签状态",
  },
  {
    title: "中签数量",
    dataIndex: "中签数量",
    key: "中签数量",
    render: (text, record, index) => {
      console.log("text,record :>> ", text, record);
      if (record["中签状态"] === "已中签") {
        return <Input />;
      }
    },
  }
];
const dataSource = [
  {
    key: 1,
    名字: "张维",
    手机号: "123456",
    客户组: "测试组",
    新股申购名称: "众望布艺",
    数量: "1",
    申购金额: "12500",
    融资比例: "60%",
    融资金额: "7500",
    已冻结资金: "7500",
    状态: "申购中",
    申购日期: "2020-8-15",
    中签公布日: "2020-8-30",
    中签状态: "未中签",
    中签数量: "",
  },
  {
    key: 2,
    名字: "李星星",
    手机号: "3345678",
    客户组: "测试组",
    新股申购名称: "众望布艺",
    数量: "1",
    申购金额: "12500",
    融资比例: "60%",
    融资金额: "7500",
    已冻结资金: "7500",
    状态: "申购中",
    申购日期: "2020-8-15",
    中签公布日: "2020-8-30",
    中签状态: "已中签",
    中签数量: "",
  }
];
class LotteryList extends React.Component {
  state = {};
  componentDidMount() {
    // 根据路由参数拿取目前的产品名称
    console.log("this.props.history :>> ", this.props.history);
    const parsedQueryString = utils.parseQueryString(
      this.props.history.location.search
    );
    console.log("parsedQueryString :>> ", parsedQueryString);
  }
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
                <Form.Item label="用户名" {...formItemLayout}>
                  <Input placeholder="请输入用户名"></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="手机" {...formItemLayout}>
                  <Input placeholder="请输入手机"></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="新股申购名称" {...formItemLayout}>
                  <Select placeholder="请选择新股名称"></Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="状态" {...formItemLayout}>
                  <Select placeholder="请选择状态"></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="中签状态" {...formItemLayout}>
                  <Select placeholder="已中签"></Select>
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
          <Table columns={columns} dataSource={dataSource} />
        </section>
      </div>
    );
  }
}

export default LotteryList;
