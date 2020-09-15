import React from "react";
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
import utils from "utils";
import styles from "../index.module.scss";
import classNames from "classnames/bind";
import moment from "moment";
import axios from "axios";
const cx = classNames.bind(styles);
const CancelToken = axios.CancelToken;
let cancelPrevRequest;

// ! 栏位名是暂定的，因为后端 api 还没做
// TODO: 串接后端 api 栏位名
const columns = [
  {
    title: "名字",
    dataIndex: "user_name",
    key: "user_name",
  },
  {
    title: "手机号",
    dataIndex: "user_phone",
    key: "user_phone",
  },
  {
    title: "客户组",
    dataIndex: "group_name",
    key: "group_name",
  },
  {
    title: "新股申购名称",
    dataIndex: "stock_name",
    key: "stock_name",
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
    dataIndex: "status",
    key: "status",
  },
  {
    title: "申购日期",
    dataIndex: "create_time",
    key: "create_time",
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
const fakeDataSource = [
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
  state = {
    filter: {},
    dataSource: [],
    page: 1,
    pageSize: 10,
    total: null,
  };
  componentDidMount() {
    // 根据路由参数拿取目前的产品名称
    console.log("this.props.history :>> ", this.props.history);
    const parsedQueryString = utils.parseQueryString(
      this.props.history.location.search
    );
    console.log("parsedQueryString :>> ", parsedQueryString);
    this.fetchData();
  }
  fetchData = async () => {
    const { pageSize, page, } = this.state;
    if (cancelPrevRequest) cancelPrevRequest();
    // TODO: 根据路由跳转参数 stock_name 抓列表
    const res = await api.newStock.getLotteryList({
      params: {
        page: page,
        page_size: pageSize,
      },
      cancelToken: new CancelToken(c => (cancelPrevRequest = c)),
    });
    const dataSource = res.data.results.map(each => {
      const data = this.mapApiDataToDataSource(each);
      return data;
    });
    console.log("LotteryList res :>> ", res);
    console.log("dataSource res :>> ", dataSource);
    this.setState({ dataSource, total: res.data.count, });
  };
  mapApiDataToDataSource = raw => {
    const payload = { ...raw, };
    payload["key"] = payload["id"];
    payload["create_time"] = moment(payload["create_time"]).format(
      "YYYY-MM-DD"
    );
    // user_data
    payload["user_phone"] = payload["user_data"]["phone"];
    payload["user_name"] = payload["user_data"]["username"];
    payload["group_name"] = payload["user_data"]["group_name"];
    // newstock_data
    payload["stock_name"] = payload["newstock_data"]["stock_name"];
    return payload;
  };
  handleSearch = () => {
    // 搜寻前先重置分页状态
    this.setState({ page: 1, pageSize: 10, });
    queueMicrotask(() => this.fetchData());
  };
  handleReset = () => {};
  handlePaginationChange = (page, pageSize) => {
    this.setState({ page, pageSize, });
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

export default LotteryList;
