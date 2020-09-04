import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "../../config";
import OpenOrderDetail from "../OpenOrderDetail";
import { withRoutePermissionGuard } from "components/withRoutePermissionGuard";
import * as React from "react";
import ReactDOM from "react-dom";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import utils from "utils";
import { ROUTE_TO_PERMISSION } from "constant";
import "./index.scss";

export interface OpenOrderListProps { }

export interface OpenOrderListState {
  status: string;
  orderList: any[];
  totalData: any;
  tableLoading: boolean;
  tempFilter: any;
  total: number;
  exportExcelBtnStatus: boolean;
  excelFileName: string;
}

/* eslint new-cap: "off" */
@withRoutePermissionGuard("/dashboard/order/open", {
  exact: false,
  permissionCode: ROUTE_TO_PERMISSION["/dashboard/order/open"],
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
    exportExcelBtnStatus: false,
    excelFileName: "持仓订单管理",
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

    this.comfirmSearchParams();
    // this.setTableAttrToExportExcel();
    this.getDataList(filter);
  };

  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    this.getDataList({
      page: 1,
      ...utils.resetFilter(this.state.tempFilter),
    });
    this.setState(
      {
        tempFilter: {},
      },
      () => {
        this.comfirmSearchParams();
      }
    );
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

  comfirmSearchParams = () => {
    const { tempFilter, } = this.state;

    if (!utils.isEmpty(tempFilter)) {
      let isNull = false;
      for (let item in tempFilter) {
        if (utils.isEmpty(tempFilter[item])) {
          isNull = true;
          break;
        }
      }
      if (!isNull) {
        this.setState({ exportExcelBtnStatus: true, });
      } else {
        this.setState({ exportExcelBtnStatus: false, });
      }
    } else {
      this.setState({ exportExcelBtnStatus: false, });
    }
  };

  exportExcel = async () => {
    let queryString = '?';
    const filter: any = {
      ...this.state.tempFilter,
    };

    if (filter.close_start_time) {
      filter.close_start_time = filter.close_start_time.unix();
    }

    if (filter.close_end_time) {
      filter.close_end_time = filter.close_end_time.unix();
    }

    for (var index in filter) {
      queryString += index + "=" + filter[index] + "&";
    }


    await this.$api.order.exportInTransactionOrder({ responseType: 'blob', }, queryString).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${Date.now()}.xls`);
      document.body.appendChild(link);
      link.click();
    });
  }

  // setTableAttrToExportExcel = () => {
  //   const tableCon = ReactDOM.findDOMNode(this.exportExcel.current); // 通过ref属性找到该table
  //   const table = tableCon.querySelector("table"); //获取table
  //   table.setAttribute("id", "table-to-xls"); //给该table设置属性
  // };

  // @ts-ignore
  private onBatch = async value => { };

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
