import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import "./index.scss";
import utils from "utils";
import { Modal } from "antd";

export interface IInfoListProps {}

export interface IInfoListState {
  // filter: any;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/agency/info", { exact: false })
@inject("common", "agency")
@observer
export default class InfoList extends BaseReact<
  IInfoListProps,
  IInfoListState
> {
  state = {
    filter: {},
    tableLoading: false,
    currentPage: 1,
    selectedRowKeys: [],
    infoModalVisible: false,
    username: undefined,
    phone: undefined,
    agent_name: undefined,
    order_number: undefined,
    ip: undefined,
    createDateRange: []
  };

  async componentDidMount() {
    // @todo 这里需要从 commonStore 中设置默认的分页
    const {
      paginationConfig: { defaultPageSize, defaultCurrent }
    } = this.props.common;

    this.resetPagination(defaultPageSize, defaultCurrent);
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/agency/info") {
      this.props.history.replace("/dashboard/agency/info/list");
    }
  }

  getDataList = (payload = {}) => {
    this.setState(
      {
        tableLoading: true
      },
      async () => {
        this.props.agency.setFilterInfo({
          ...payload
        });
        await this.props.agency.getInfoList({
          params: this.props.agency.filterInfo
        });
        this.setState({ tableLoading: false });
      }
    );
  };

  resetPagination = async (page_size, current_page) => {
    this.props.agency.setFilterInfo({
      page_size,
      current_page
    });
    this.setState(
      {
        current_page
      },
      async () => {
        const filter = this.props.agency.filterInfo;

        this.getDataList(filter);
      }
    );
  };
  // @ts-ignore
  private onSearch = async () => {
    this.props.agency.setFilterInfo({
      current_page: 1
    });
    this.setState(
      {
        currentPage: 1
      },
      () => {
        this.getDataList(this.props.agency.filterInfo);
      }
    );
  };
  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    const filter: any = {
      current_page: 1
    };

    this.props.agency.setFilterInfo(filter, true);

    this.setState(
      {
        currentPage: 1,
        username: undefined,
        phone: undefined,
        order_number: undefined,
        ip: undefined,
        DateRange: []
      },
      () => {
        this.getDataList(this.props.agency.filterInfo);
      }
    );
  };

  goToEditor = (record: any): void => {
    const url = `/dashboard/agency/info/editor?id=${
      !utils.isEmpty(record) ? record.id : 0
    }`;
    this.props.history.push(url);
  };

  renderMenu = (record): JSX.Element => {
    return null;
  };

  onDateRangeChange = (field, dateRange) => {
    this.props.agency.setFilterInfo({
      [`${field ? field + "_" : ""}start_time`]: dateRange[0].unix(),
      [`${field ? field + "_" : ""}end_time`]: dateRange[1].unix()
    });

    this.setState({
      [`${field}DateRange`]: dateRange
    });
  };

  onInputChanged = (field, value) => {
    this.setState({
      [field]: value
    });
    this.props.agency.setFilterInfo({
      [field]: value ? value : undefined
    });
  };

  // @ts-ignore
  private onBatch = async value => {};

  render() {
    const { match } = this.props;
    const computedTitle = "代理明细";

    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
      </div>
    );
  }
}
