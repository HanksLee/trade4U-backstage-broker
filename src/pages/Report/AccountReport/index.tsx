import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { PAGE_PERMISSION_MAP } from "constant";
import { Row, Col, Statistic, Card } from "antd";
import utils from "utils";
import "../index.scss";

interface ReportState {
  dataList: any[];
  totalData: any;
  tableLoading: boolean;
  selectedRowKeys: string[];
  tempFilter: any;
  total: number;
  symbolType: any[];
  commissionRuleColumns: any[];
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/report/account", {
  exact: false,
  permissionCode: PAGE_PERMISSION_MAP["/dashboard/report/account"],
})
@inject("common", "accountReport")
@observer
export default class AccountReport extends BaseReact<{}, ReportState> {
  state = {
    dataList: [],
    totalData: {},
    tableLoading: false,
    selectedRowKeys: [],
    tempFilter: {},
    total: 0,
    symbolType: [],
    commissionRuleColumns: [],
  };

  async componentDidMount() {
    const { filter, } = this.props.accountReport;
    const { paginationConfig, } = this.props.common;

    this.getDataList({
      ...utils.resetFilter(filter),
      page_size: filter.page_size || paginationConfig.defaultPageSize,
      page: filter.page || 1,
    });
  }

  getSymbolType = async () => {
    const res = await this.$api.product.getGenreList();
    const columns = [];
    res.data.results.forEach((item, index) => {
      columns.push({
        title: `${item.symbol_type_name}交易数`,
        // width: 200,
        render: (_, record) => {
          let content = Object.values(record.trading_data);
          let content_ary = content[index];
          return content_ary;
        },
      });
    });
    this.setState({
      commissionRuleColumns: columns,
      symbolType: res.data.results,
    });
  };

  getDataList = async (filter?: any) => {
    const payload = filter
      ? { ...this.props.accountReport.filter, ...filter, }
      : this.props.accountReport.filter;
    this.setState({
      tableLoading: true,
    });

    const res = await this.$api.report.getAccountReport({ params: payload, });
    const { results, total_data, page_size, current_page, count, } = res.data;
    if (results.length === 0 && current_page !== 1) {
      // 删除非第一页的最后一条记录，自动翻到下一页
      this.getDataList({ ...payload, page: current_page - 1, });
    } else {
      this.props.accountReport.setFilter({
        page_size,
        page: current_page,
        username: payload.username,
        phone: payload.username,
      });
      this.setState(
        {
          dataList: results,
          totalData: total_data,
          tableLoading: false,
          total: count,
        },
        () => {
          this.getSymbolType();
        }
      );
    }
  };

  // @ts-ignore
  private onSearch = async () => {
    const filter: any = {
      page: 1,
      ...this.state.tempFilter,
    };

    this.getDataList(filter);
  };

  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    this.getDataList({
      page: 1,
      ...utils.resetFilter(this.state.tempFilter),
    });
    this.setState({
      tempFilter: {},
    });
  };

  onInputChanged = (field, value) => {
    this.setState((prevState: ReportState) => ({
      tempFilter: {
        ...prevState.tempFilter,
        [field]: value,
      },
    }));
  };

  render() {
    const { totalData, symbolType, } = this.state;
    return (
      <div className="account-report">
        <CommonHeader {...this.props} links={[]} title="用户报表" />
        <Row gutter={8} style={{ margin: "10px", }}>
          <Col span={3}>
            <Card>
              <Statistic title="入金" value={totalData.deposit} />
            </Card>
          </Col>
          <Col span={3}>
            <Card>
              <Statistic title="出金" value={totalData.net_withdraw} />
            </Card>
          </Col>
          <Col span={3}>
            <Card>
              <Statistic title="净入金" value={totalData.net_deposit} />
            </Card>
          </Col>
          {/* <Col span={3}>
            <Card>
              <Statistic title="盈利笔数" value={totalData.profitable_order} />
            </Card>
          </Col>
          <Col span={3}>
            <Card>
              <Statistic title="亏损笔数" value={totalData.loss_order} />
            </Card>
          </Col> */}
          {symbolType.map((item, index) => {
            return (
              <Col span={3}>
                <Card>
                  <Statistic
                    title={`${item.symbol_type_name}交易数`}
                    value={Object.values(totalData.trading_data)[index]}
                  />
                </Card>
              </Col>
            );
          })}
          <Col span={3}>
            <Card>
              <Statistic title="手续费" value={totalData.fee} />
            </Card>
          </Col>
          <Col span={3}>
            <Card>
              <Statistic title="库存费" value={totalData.swaps} />
            </Card>
          </Col>
          <Col span={3}>
            <Card>
              <Statistic title="盈亏" value={totalData.profit} />
            </Card>
          </Col>
        </Row>
        <CommonList {...this.props} config={listConfig(this)} />
      </div>
    );
  }
}
