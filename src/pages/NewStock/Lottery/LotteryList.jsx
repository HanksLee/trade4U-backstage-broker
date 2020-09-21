import React from "react";
import api from "services";
import { Link } from "react-router-dom";
import {
  Button,
  Select,
  Input,
  InputNumber,
  Table,
  Pagination,
  Row,
  Col,
  Form,
  message,
  Checkbox
} from "antd";
import utils from "utils";
import styles from "../index.module.scss";
import classNames from "classnames/bind";
import moment from "moment";
import axios from "axios";
import produce from "immer";
const cx = classNames.bind(styles);
const CancelToken = axios.CancelToken;
let cancelPrevRequest;

class LotteryList extends React.Component {
  state = {
    filter: {},
    dataSource: [],
    dataSourceMap: {},
    page: 1,
    pageSize: 10,
    total: null,
    realLotsMap: {},
    isEditableMap: {},
  };
  componentDidMount() {
    // 根据路由参数拿取目前的产品名称
    // console.log("this.props.history :>> ", this.props.history);
    const parsedQueryString = utils.parseQueryString(
      this.props.history.location.search
    );
    // console.log("parsedQueryString :>> ", parsedQueryString);
    this.fetchData();
  }
  // componentDidUpdate(prevProps, prevState) {
  //   console.log(this.state);
  // }
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
    const realLotsMap = dataSource.reduce((obj, curr) => {
      const { id, real_lots, } = curr;
      obj[id] = real_lots;
      return obj;
    }, {});
    this.setState({ dataSource, realLotsMap, total: res.data.count, });
  };
  mapApiDataToDataSource = raw => {
    const payload = { ...raw, };
    const { user_data, newstock_data, real_lots, } = payload;
    payload["key"] = payload["id"];
    payload["create_time"] = moment(payload["create_time"]).format(
      "YYYY-MM-DD"
    );
    // user_data
    payload["user_phone"] = user_data["phone"];
    payload["user_name"] = user_data["username"];
    payload["group_name"] = user_data["group_name"];
    // newstock_data
    payload["stock_name"] = newstock_data["stock_name"];
    payload["draw_result_date"] = moment(
      newstock_data["draw_result_date"]
    ).format("YYYY-MM-DD");
    payload["real_lots_status"] = Number(real_lots) > 0 ? "已中签" : "未中签";
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
    queueMicrotask(() => this.fetchData());
  };
  updateRealLots = async id => {
    if (!id) return;
    const real_lots = this.state.realLotsMap[id];
    try {
      await api.newStock.updateLotteryList(id, { real_lots, });
      message.success("中签数量更新成功");
      this.toggleEditor(id, false);
      this.fetchData();
    } catch (e) {
      message.error("数据更新失败，请确认");
    }
  };
  toggleEditor = (id, isEditable) => {
    this.setState({
      isEditableMap: { [id]: isEditable, },
    });
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
            <Button
              type="primary"
              className={cx("search-button")}
              onClick={this.handleSearch}
            >
              查询
            </Button>
            <Button className={cx("search-button")}>重置</Button>
          </div>
        </Col>
      </Row>
    );
  };
  getColumns = () => {
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
        title: "申购数量",
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
        dataIndex: "draw_result_date",
        key: "draw_result_date",
      },

      {
        title: "中签状态",
        dataIndex: "real_lots_status",
        key: "real_lots_status",
      },
      {
        title: "中签数量",
        dataIndex: "real_lots",
        key: "real_lots",
        render: (_, record) => {
          const { id, real_lots, wanted_lots, } = record;
          const { [id]: value, } = this.state.realLotsMap;
          const handleChange = val => {
            this.setState(
              produce(draft => {
                draft.realLotsMap[id] = val;
              })
            );
          };
          const isEditable = this.state.isEditableMap[id];
          return (
            <InputNumber
              value={value}
              disabled={!isEditable}
              onChange={handleChange}
              min={0}
              max={wanted_lots}
            />
          );
        },
      },
      {
        title: "编辑",
        dataIndex: "edit",
        key: "edit",
        render: (_, record) => {
          const { id, real_lots, } = record;
          const { [id]: realLots, } = this.state.realLotsMap;
          const { [id]: isEditable, } = this.state.isEditableMap;
          const canUpdate = real_lots !== realLots;
          return (
            <React.Fragment>
              {!isEditable && (
                <Button onClick={() => this.toggleEditor(id, true)}>
                  启用编辑
                </Button>
              )}
              {isEditable && (
                <Button
                  type="primary"
                  onClick={() => this.updateRealLots(id)}
                  disabled={!canUpdate}
                >
                  更新数量
                </Button>
              )}
            </React.Fragment>
          );
        },
      }
    ];
    return columns;
  };
  render() {
    const { dataSource, pageSize, page, total, } = this.state;
    const columns = this.getColumns();
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
