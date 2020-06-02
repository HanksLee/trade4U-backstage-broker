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

export interface ILogListProps {}

export interface ILogListState {
  // filter: any;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/agency/log", { exact: false, })
@inject("common", "agency")
@observer
export default class LogList extends BaseReact<ILogListProps, ILogListState> {
  state = {
    filter: {},
    tableLoading: false,
    currentPage: 1,
    selectedRowKeys: [],
    logModalVisible: false,
    username: undefined,
    phone: undefined,
    order_number: undefined,
    agent_name: undefined,
    createDateRange: [],
    transferDateRange: [],
  };

  async componentDidMount() {
    // @todo 这里需要从 commonStore 中设置默认的分页
    const {
      paginationConfig: { defaultPageSize, defaultCurrent, },
    } = this.props.common;

    this.resetPagination(defaultPageSize, defaultCurrent);
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/agency/log") {
      this.props.history.replace("/dashboard/agency/log/list");
    }
  }

  getDataList = (payload = {}) => {
    this.setState(
      {
        tableLoading: true,
      },
      async () => {
        this.props.agency.setFilterLog({
          ...payload,
        });
        await this.props.agency.getLogList({
          params: this.props.agency.filterLog,
        });
        this.setState({ tableLoading: false, });
      }
    );
  };

  resetPagination = async (page_size, current_page) => {
    this.props.agency.setFilterLog({
      page_size,
      current_page,
    });
    this.setState(
      {
        current_page,
      },
      async () => {
        const filter = this.props.agency.filterLog;

        this.getDataList(filter);
      }
    );
  };
  // @ts-ignore
  private onSearch = async () => {
    this.props.agency.setFilterLog({
      current_page: 1,
    });
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.getDataList(this.props.agency.filterLog);
      }
    );
  };
  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    const filter: any = {
      current_page: 1,
    };

    this.props.agency.setFilterLog(filter, true);

    this.setState(
      {
        currentPage: 1,
        username: undefined,
        phone: undefined,
        order_number: undefined,
        createDateRange: [],
        transferDateRange: [],
      },
      () => {
        this.getDataList(this.props.agency.filterLog);
      }
    );
  };

  goToEditor = (record: any): void => {
    const url = `/dashboard/agency/log/editor?id=${
      !utils.isEmpty(record) ? record.id : 0
    }`;
    this.props.history.push(url);
  };

  renderMenu = (record): JSX.Element => {
    return null;
  };

  onDateRangeChange = (field, dateRange) => {
    this.props.agency.setFilterLog({
      [`${field}_start_time`]: dateRange[0].unix(),
      [`${field}_end_time`]: dateRange[1].unix(),
    });

    this.setState({
      [`${field}DateRange`]: dateRange,
    });
  };

  onInputChanged = (field, value) => {
    this.setState({
      [field]: value,
    });
    this.props.agency.setFilterLog({
      [field]: value ? value : undefined,
    });
  };

  // @ts-ignore
  private onBatch = async value => {};

  render() {
    const { match, } = this.props;
    const computedTitle = "返佣日志";
    const { logModalVisible, } = this.state;

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
