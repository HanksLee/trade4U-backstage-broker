import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { PAGE_PERMISSION_MAP } from "constant";
import { Row, Col, Statistic, Card, Icon } from "antd";
import "../index.scss";

export interface Report {}

interface ReportState {
  dataList: Report[];
  totalData: any;
  tableLoading: boolean;
  selectedRowKeys: string[];
  tempFilter: any;
  total: number;
  agencyStack: any[];
  symbolType: any[];
  commissionRuleColumns: any[];
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/report/agency", {
  exact: false,
  permissionCode: PAGE_PERMISSION_MAP["/dashboard/report/agency"]
})
@inject("common", "agencyReport")
@observer
export default class AgencyReport extends BaseReact<{}, ReportState> {
  state = {
    dataList: [],
    totalData: {},
    tableLoading: false,
    selectedRowKeys: [],
    tempFilter: {},
    total: 0,
    agencyStack: [],
    symbolType: [],
    commissionRuleColumns: []
  };

  async componentDidMount() {
    const { filter } = this.props.agencyReport;
    const { paginationConfig } = this.props.common;

    this.getDataList({
      page_size: filter.page_size || paginationConfig.defaultPageSize,
      page: filter.page || 1,
      username: undefined,
      phone: undefined
    });
  }

  getSymbolType = async () => {
    const res = await this.$api.product.getGenreList();
    const columns = [];
    res.data.results.forEach((item, index) => {
      columns.push({
        title: `${item.symbol_type_name}交易数`,
        width: 200,
        render: (_, record) => {
          let content = Object.values(record.trading_data);
          let content_ary = content[index];
          return content_ary;
        }
      });
    });
    this.setState({
      commissionRuleColumns: columns,
      symbolType: res.data.results
    });
  };

  getDataList = async (filter?: any) => {
    const payload = filter
      ? { ...this.props.agencyReport.filter, ...filter }
      : this.props.agencyReport.filter;
    this.setState({
      tableLoading: true
    });

    const res = await this.$api.report.getAgencyReport({ params: payload });
    const { results, total_data, page_size, current_page, count } = res.data;
    this.props.agencyReport.setFilter({
      page_size,
      page: current_page,
      username: payload.username,
      phone: payload.phone
    });
    this.setState(
      {
        dataList: results,
        totalData: total_data,
        tableLoading: false,
        total: count
      },
      () => {
        this.getSymbolType();
      }
    );
  };

  // @ts-ignore
  private onSearch = async () => {
    const filter: any = {
      page: 1,
      ...this.state.tempFilter
    };

    if (filter.start_time) {
      filter.start_time = filter.start_time.unix();
    }

    if (filter.end_time) {
      filter.end_time = filter.end_time.unix();
    }

    this.getDataList(filter);
  };

  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    this.setState(
      {
        tempFilter: {},
        agencyStack: []
      },
      () => {
        this.getDataList({
          username: undefined,
          phone: undefined,
          page: 1,
          agencyStack: []
        });
      }
    );
  };

  onInputChanged = (field, value) => {
    this.setState((prevState: ReportState) => ({
      tempFilter: {
        ...prevState.tempFilter,
        [field]: value
      }
    }));
  };

  pushAgencyStack = (username: string) => {
    this.handleAgencyStackChange(username);
  };

  handleAgencyStackChange = (username: string, index?: number) => {
    this.getDataList({
      username,
      page: 1
    });
    if (index === undefined) {
      this.setState({
        agencyStack: [...this.state.agencyStack, username]
      });
    } else {
      this.setState({
        agencyStack: this.state.agencyStack.filter((item, i) => i <= index)
      });
    }
  };

  resetAgencyStack = () => {
    this.setState(
      {
        agencyStack: []
      },
      () => {
        this.getDataList({
          username: undefined,
          page: 1
        });
      }
    );
  };

  render() {
    const { agencyStack, totalData, symbolType } = this.state;
    return (
      <div className="agency-report">
        <CommonHeader {...this.props} links={[]} title="代理团队报表" />
        <Row gutter={8} style={{ margin: "10px" }}>
          <Col span={4}>
            <Card>
              <Statistic title="入金" value={totalData.deposit} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="出金" value={totalData.net_withdraw} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="净入金" value={totalData.net_deposit} />
            </Card>
          </Col>
          {/* <Col span={4}>
            <Card>
              <Statistic title="盈利笔数" value={totalData.profitable_order} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="亏损笔数" value={totalData.loss_order} />
            </Card>
          </Col> */}
          {symbolType.map((item, index) => {
            return (
              <Col span={4}>
                <Card>
                  <Statistic
                    title={`${item.symbol_type_name}交易数`}
                    value={Object.values(totalData.trading_data)[index]}
                  />
                </Card>
              </Col>
            );
          })}
          <Col span={4}>
            <Card>
              <Statistic title="手续费" value={totalData.fee} />
            </Card>
          </Col>
        </Row>
        <Row gutter={8} style={{ margin: "10px" }}>
          <Col span={4}>
            <Card>
              <Statistic title="库存费" value={totalData.swaps} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="盈亏" value={totalData.profit} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="已返佣金" value={totalData.commission} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="总佣金" value={totalData.total_commission} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="已提款佣金"
                value={totalData.net_withdraw_commission}
              />
            </Card>
          </Col>
        </Row>
        <div className="agency-stack">
          {agencyStack.length > 0 && "当前层级："}
          {agencyStack.map((username, index) => {
            return (
              <>
                {index > 0 && " / "}
                <a
                  onClick={() => this.handleAgencyStackChange(username, index)}
                >
                  {username}
                </a>
              </>
            );
          })}
          {agencyStack.length > 0 && (
            <Icon
              type="close-circle"
              style={{ marginLeft: "20px", fontSize: "14px" }}
              onClick={this.resetAgencyStack}
            />
          )}
        </div>
        <CommonList {...this.props} config={listConfig(this)} />
      </div>
    );
  }
}
