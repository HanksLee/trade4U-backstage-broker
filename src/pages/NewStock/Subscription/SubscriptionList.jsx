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
import { MARKET_TYPE, NEW_STOCK_STATUS } from "constant";
import moment from "moment";
import axios from "axios";
import styles from "../index.module.scss";
import classNames from "classnames/bind";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import produce from "immer";
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
    title: "活动状态",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
    fixed: "right",
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
const defaultFilter = {
  stockName: null,
  stockCode: null,
  symbolType: null,
  status: null,
};
@inject("product")
@observer
class SubscriptionList extends React.Component {
  state = {
    filter: defaultFilter,
    symbolTypeOptions: [],
    dataSource: [],
    page: 1,
    pageSize: 10,
    total: null,
  };
  componentDidMount() {
    this.fetchData();
    this.getSymbolTypeOptions();
  }
  getSymbolTypeOptions = async () => {
    // 抓品种类型选项
    await this.props.product.getGenreList();
    const symbolTypeOptions = toJS(this.props.product.genreList);
    this.setState({ symbolTypeOptions, });
  };
  fetchData = async () => {
    const { pageSize, page, } = this.state;
    const { stockName, stockCode, symbolType, status, } = this.state.filter;
    if (cancelPrevRequest) cancelPrevRequest();
    const res = await api.newStock.getSubscriptionList({
      params: {
        page: page,
        page_size: pageSize,
        stock_name: stockName,
        stock_code: stockCode,
        market: symbolType,
        status,
      },
      cancelToken: new CancelToken(c => (cancelPrevRequest = c)),
    });

    const dataSource = res.data.results.map(each => {
      return this.mapApiDataToDataSource(each);
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

  renderFilter = () => {
    const formItemLayout = {
      labelCol: { span: 6, },
      wrapperCol: { span: 18, },
    };
    const { symbolTypeOptions, filter, } = this.state;
    return (
      <Row>
        <Col span={16}>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item label="产品名称" {...formItemLayout}>
                  {(fieldName => {
                    return (
                      <Input
                        placeholder="请输入产品名称"
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
                <Form.Item label="产品编码" {...formItemLayout}>
                  {(fieldName => {
                    return (
                      <Input
                        placeholder="请输入产品编码"
                        value={filter[fieldName]}
                        onChange={e =>
                          this.handleFilterChange(e.target.value, fieldName)
                        }
                      ></Input>
                    );
                  })("stockCode")}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="品种类型" {...formItemLayout}>
                  {(fieldName => {
                    return (
                      <Select
                        placeholder="请选择品种类型"
                        style={{ width: "100%", }}
                        value={filter[fieldName]}
                        onChange={val =>
                          this.handleFilterChange(val, fieldName)
                        }
                      >
                        {symbolTypeOptions.map(option => (
                          <Select.Option
                            value={option.symbol_type_name}
                            key={option.symbol_type_name}
                          >
                            {option.symbol_type_name}
                          </Select.Option>
                        ))}
                      </Select>
                    );
                  })("symbolType")}
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
                  })("status")}
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
