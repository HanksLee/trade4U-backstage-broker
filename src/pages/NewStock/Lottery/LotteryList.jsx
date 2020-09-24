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
import momentTimezone from "moment-timezone";
import axios from "axios";
import { inject, observer } from "mobx-react";
import produce from "immer";
import { MARKET_TYPE, NEW_STOCK_STATUS } from "constant";
const cx = classNames.bind(styles);
const CancelToken = axios.CancelToken;
let cancelPrevRequest;

// TODO: 等 api 修改后，改为 0 未中，1 有中
const DRAWING_STATUS = {
  0: "未中签",
  1: "已中签",
};

const defaultFilter = {
  userName: null,
  userPhone: null,
  stockName: null,
  drawingStatus: null,
  subscriptionStatus: null,
};

@inject("system")
@observer
class LotteryList extends React.Component {
  state = {
    filter: defaultFilter,
    dataSource: [],
    dataSourceMap: {},
    page: 1,
    pageSize: 10,
    total: null,
    realLotsMap: {},
    isEditableMap: {},
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
        title: "活动状态",
        dataIndex: "subscription_status",
        key: "subscription_status",
      },
      {
        title: "中签状态",
        dataIndex: "drawing_of_lots_status",
        key: "drawing_of_lots_status",
        fixed: "right",
      },
      {
        title: "中签数量",
        dataIndex: "real_lots",
        key: "real_lots",
        fixed: "right",
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
        fixed: "right",
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
  componentDidMount() {
    // 根据路由参数拿取目前的产品名称
    const parsedQueryString = utils.parseQueryString(
      this.props.history.location.search
    );
    // console.log("parsedQueryString :>> ", parsedQueryString);
    this.setState(
      produce(draft => {
        draft.filter.stockName = parsedQueryString.stock_name;
      })
    );
    queueMicrotask(() => this.fetchData());
  }
  fetchData = async () => {
    const { pageSize, page, } = this.state;
    const {
      userName,
      userPhone,
      stockName,
      drawingStatus,
      subscriptionStatus,
    } = this.state.filter;
    if (cancelPrevRequest) cancelPrevRequest();
    const res = await api.newStock.getLotteryList({
      params: {
        page: page,
        page_size: pageSize,
        stock_name: stockName,
        username: userName,
        phone: userPhone,
        subscription_status: subscriptionStatus,
        drawing_of_lots_status: drawingStatus,
      },
      cancelToken: new CancelToken(c => (cancelPrevRequest = c)),
    });
    const dataSource = res.data.results.map(each => {
      return this.mapApiDataToDataSource(each);
    });
    const realLotsMap = dataSource.reduce((obj, curr) => {
      const { id, real_lots, } = curr;
      obj[id] = real_lots;
      return obj;
    }, {});
    this.setState({ dataSource, realLotsMap, total: res.data.count, });
  };
  mapApiDataToDataSource = raw => {
    const { configMap, } = this.props.system;
    const brokerTimezone = configMap["broker_tz"] || "Asia/Shanghai";

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
    const {
      stock_name,
      draw_result_date,
      subscription_date_start,
      subscription_date_end,
    } = newstock_data;
    payload["stock_name"] = stock_name;
    payload["draw_result_date"] = moment(draw_result_date).format("YYYY-MM-DD");
    const nowMoment = momentTimezone(Date.now()).tz(brokerTimezone);
    const subscriptionStatus = nowMoment.isBefore(
      moment(subscription_date_start)
    )
      ? "未开始"
      : nowMoment.isAfter(moment(subscription_date_end))
        ? "已结束"
        : "进行中";
    payload["subscription_status"] = subscriptionStatus;

    payload["drawing_of_lots_status"] =
      Number(real_lots) > 0 ? "已中签" : "未中签";
    return payload;
  };
  handlePaginationChange = (page, pageSize) => {
    this.setState({ page, pageSize, });
    queueMicrotask(() => this.fetchData());
  };
  handleFilterChange = (val, fieldName) => {
    this.setState(
      produce(draft => {
        draft.filter[fieldName] = val;
      })
    );
  };
  handleFilterReset = () => {
    this.setState({ filter: defaultFilter, });
  };
  handleSearch = () => {
    // 搜寻前先重置分页状态
    console.log("this.state.filter :>> ", this.state.filter);
    this.setState({ page: 1, pageSize: 10, });
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
    const { filter, } = this.state;

    return (
      <Row>
        <Col span={16}>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item label="用户名" {...formItemLayout}>
                  {(fieldName => {
                    return (
                      <Input
                        placeholder="请输入用户名"
                        value={filter[fieldName]}
                        onChange={e =>
                          this.handleFilterChange(e.target.value, fieldName)
                        }
                      ></Input>
                    );
                  })("userName")}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="手机" {...formItemLayout}>
                  {(fieldName => {
                    return (
                      <Input
                        placeholder="请输入手机"
                        value={filter[fieldName]}
                        onChange={e =>
                          this.handleFilterChange(e.target.value, fieldName)
                        }
                      ></Input>
                    );
                  })("userPhone")}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="新股名称" {...formItemLayout}>
                  {(fieldName => {
                    return (
                      <Input
                        placeholder="请输入新股名称"
                        value={filter[fieldName]}
                        onChange={e =>
                          this.handleFilterChange(e.target.value, fieldName)
                        }
                      ></Input>
                    );
                  })("stockName")}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="活动状态" {...formItemLayout}>
                  {(fieldName => {
                    return (
                      <Select
                        placeholder="请选择状态"
                        value={filter[fieldName]}
                        onChange={val =>
                          this.handleFilterChange(val, fieldName)
                        }
                      >
                        {Object.entries(NEW_STOCK_STATUS).map(([key, val]) => (
                          <Select.Option value={key} key={key}>
                            {val}
                          </Select.Option>
                        ))}
                      </Select>
                    );
                  })("subscriptionStatus")}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="中签状态" {...formItemLayout}>
                  {(fieldName => {
                    return (
                      <Select
                        placeholder="请选择中签状态"
                        value={filter[fieldName]}
                        onChange={val =>
                          this.handleFilterChange(val, fieldName)
                        }
                      >
                        {Object.entries(DRAWING_STATUS).map(([key, val]) => (
                          <Select.Option key={key} value={key}>
                            {val}
                          </Select.Option>
                        ))}
                      </Select>
                    );
                  })("drawingStatus")}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={8}>
          <div style={{ display: "flex", justifyContent: "center", }}>
            <Button
              className={cx("search-button")}
              onClick={this.handleFilterReset}
            >
              重置
            </Button>
            <Button
              type="primary"
              className={cx("search-button")}
              onClick={this.handleSearch}
            >
              查询
            </Button>
          </div>
        </Col>
      </Row>
    );
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
