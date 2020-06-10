import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "../../config";
import OpenOrderDetail from "../OpenOrderDetail";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import utils from "utils";
import { PAGE_PERMISSION_MAP } from "constant";
import "./index.scss";

export interface OpenOrderListProps {}

export interface OpenOrderListState {
  status: string;
  orderList: any[];
  totalData: any;
  tableLoading: boolean;
  tempFilter: any;
  total: number;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/order/open", {
  exact: false,
  permissionCode: PAGE_PERMISSION_MAP["/dashboard/order/open"],
})
@inject("common", "openOrder")
@observer
export default class OpenOrderList extends BaseReact<
OpenOrderListProps,
OpenOrderListState
> {
  state = {
    status: "open",
    orderList: [],
    totalData: {},
    tableLoading: false,
    tempFilter: {},
    total: 0,
  };

  async componentDidMount() {
    const { filter, } = this.props.openOrder;
    const { paginationConfig, } = this.props.common;

    this.getDataList({
      ...utils.resetFilter(filter),
      page_size: filter.page_size || paginationConfig.defaultPageSize,
      page: filter.page || 1,
    });
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/order/open") {
      this.props.history.replace("/dashboard/order/open/list");
    }
  }

  getDataList = async (filter?: any) => {
    const payload = filter
      ? { ...this.props.openOrder.filter, ...filter, }
      : this.props.openOrder.filter;
    this.setState({
      tableLoading: true,
    });

    const res = await this.$api.order.getOpenOrderList({ params: payload, });
    const { results, total_data, page_size, current_page, count, } = res.data;
    this.props.openOrder.setFilter({
      page_size,
      page: current_page,
      ...payload,
    });
    this.setState({
      orderList: results,
      totalData: total_data,
      tableLoading: false,
      total: count,
    });
  };

  // @ts-ignore
  private onSearch = async () => {
    const filter: any = {
      page: 1,
      ...this.state.tempFilter,
    };

    if (filter.create_start_time) {
      filter.create_start_time = filter.create_start_time.unix();
    }

    if (filter.create_end_time) {
      filter.create_end_time = filter.create_end_time.unix();
    }

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
    this.setState((prevState: OpenOrderListState) => ({
      tempFilter: {
        ...prevState.tempFilter,
        [field]: value,
      },
    }));
  };

  goToOrderDetail = (record: any): void => {
    const url = `/dashboard/order/open/detail?id=${
      !utils.isEmpty(record) ? record.order_number : 0
    }`;
    this.props.history.push(url);
  };

  renderMenu = (record): JSX.Element => {
    return null;
  };

  // @ts-ignore
  private onBatch = async value => {};

  render() {
    const { match, } = this.props;
    const computedTitle = "持仓订单管理";

    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        <Route
          path={`${match.url}/detail`}
          render={props => (
            <OpenOrderDetail {...props} getDataList={this.getDataList} />
          )}
        />
      </div>
    );
  }
}
