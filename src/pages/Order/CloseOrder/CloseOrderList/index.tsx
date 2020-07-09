import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "../../config";
import OpenOrderDetail from "../CloseOrderDetail";
import WithRoute from "components/WithRoute";
import * as React from "react";
import ReactDOM from "react-dom";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import "./index.scss";
import utils from "utils";
import { PAGE_PERMISSION_MAP } from "constant";
import axios from 'axios';

export interface CloseOrderListProps { }

export interface CloseOrderListState {
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
@WithRoute("/dashboard/order/close", {
  exact: false,
  permissionCode: PAGE_PERMISSION_MAP["/dashboard/order/close"],
})
@inject("common", "closeOrder")
@observer
export default class CloseOrderList extends BaseReact<
CloseOrderListProps,
CloseOrderListState
> {
  state = {
    status: "close",
    orderList: [],
    totalData: {},
    tableLoading: false,
    tempFilter: {},
    total: 0,
    exportExcelBtnStatus: false,
    excelFileName: "结算订单管理",
  };

  async componentDidMount() {
    const { filter, } = this.props.closeOrder;
    const { paginationConfig, } = this.props.common;

    this.getDataList({
      ...utils.resetFilter(filter),
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
    const payload = filter
      ? { ...this.props.closeOrder.filter, ...filter, }
      : this.props.closeOrder.filter;
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
    this.setState((prevState: CloseOrderListState) => ({
      tempFilter: {
        ...prevState.tempFilter,
        [field]: value,
      },
    }));
  };

  goToOrderDetail = (record: any): void => {
    const url = `/dashboard/order/close/detail?id=${
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


    await this.$api.order.exportFinishOrder({ responseType: 'blob', }, queryString).then((response) => {
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

  render() {
    const { match, } = this.props;
    const computedTitle = "结算订单管理";

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
