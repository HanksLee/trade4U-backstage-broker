import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "../../config";
import OpenOrderDetail from "../CloseOrderDetail";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import "./index.scss";
import utils from 'utils';
import { PAGE_PERMISSION_MAP } from 'constant';

export interface CloseOrderListProps {}

export interface CloseOrderListProps {
  status: string;
  orderList: any[];
  totalData: any;
  tableLoading: boolean;
  tempFilter: any;
  total: number;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/order/close",  { exact: false, permissionCode: PAGE_PERMISSION_MAP['/dashboard/order/close'], })
@inject("common", "closeOrder")
@observer
export default class CloseOrderList extends BaseReact<CloseOrderListProps, CloseOrderListState> {
  state = {
    status: 'close',
    orderList: [],
    totalData: {},
    tableLoading: false,
    tempFilter: {},
    total: 0,
  };

  async componentDidMount() {
    const { filter, } = this.props.closeOrder;
    const { paginationConfig, } = this.props.common;

    this.getDataList({
      page_size: filter.page_size || paginationConfig.defaultPageSize,
      page: filter.page || 1,
    });
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/order/close") {
      this.props.history.replace("/dashboard/order/close/list");
    }
  }

  getDataList = async (filter?: any) => {
    const payload = filter ? { ...this.props.closeOrder.filter, ...filter, } : this.props.closeOrder.filter;
    this.setState({
      tableLoading: true,
    });
    const res = await this.$api.order.getCloseOrderList({ params: payload, });
    const { results, total_data, page_size, current_page, count, } = res.data;
    this.props.closeOrder.setFilter({
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

    if (filter.close_start_time) {
      filter.close_start_time = filter.close_start_time.unix();
    }

    if (filter.close_end_time) {
      filter.close_end_time = filter.close_end_time.unix();
    }

    this.getDataList(filter);
  };

  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    this.getDataList({
      name: undefined,
      page: 1,
    });
    this.setState({
      tempFilter: {},
    });
  };

  onInputChanged = (field, value) => {
    this.setState((prevState: CloseOrderListProps) => (
      {
        tempFilter: {
          ...prevState.tempFilter,
          [field]: value,
        },
      }
    ));
  }

  goToOrderDetail = (record: any): void => {
    const url = `/dashboard/order/close/detail?id=${
      !utils.isEmpty(record) ? record.order_number : 0
    }`;
    this.props.history.push(url);
  };

  renderMenu = (record): JSX.Element => {
    return null;
  };

  render() {
    const { match, } = this.props;
    const computedTitle = '结算订单管理';

    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        <Route path={`${match.url}/detail`} render={props => (
          <OpenOrderDetail {...props} getDataList={this.getDataList} />
        )} />
      </div>
    );
  }
}
