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
import styles from "../index.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

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
    dataIndex: "user_phone",
    key: "user_phone",
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
    dataIndex: "wanted_lots",
    key: "wanted_lots",
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
    dataIndex: "loan",
    key: "loan",
  },
  {
    title: "已冻结资金",
    dataIndex: "entrance_fee",
    key: "entrance_fee",
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
    dataIndex: "real_lots",
    key: "real_lots",
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
    user_phone: "123456",
    客户组: "测试组",
    新股申购名称: "众望布艺",
    wanted_lots: "1",
    申购金额: "12500", //  entrance_fee ＋ loan
    融资比例: "60%", // loan / entrance_fee ＋ loan
    loan: "7500",
    entrance_fee: "7500",
    状态: "申购中",
    申购日期: "2020-8-15",
    中签公布日: "2020-8-30",
    中签状态: "未中签",
    real_lots: "",
  },
  {
    key: 2,
    名字: "李星星",
    user_phone: "3345678",
    客户组: "测试组",
    新股申购名称: "众望布艺",
    wanted_lots: "1",
    申购金额: "12500",
    融资比例: "60%",
    loan: "7500",
    entrance_fee: "7500",
    状态: "申购中",
    申购日期: "2020-8-15",
    中签公布日: "2020-8-30",
    中签状态: "已中签",
    real_lots: "",
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

export default LotteryList;
