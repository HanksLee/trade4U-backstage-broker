import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import WithRoute from "components/WithRoute";
import * as React from "react";
import ReactDOM from "react-dom";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import utils from "utils";
import { PAGE_PERMISSION_MAP } from "constant";

export interface Transaction {
  id?: string;
  ip: string;
  phone: string;
  in_or_out: number;
  amount: string;
  before_balance: string;
  after_balance: string;
  cause: string;
  remarks: string;
  create_time: number;
}

interface TransactionListState {
  transactionList: Transaction[];
  tableLoading: boolean;
  selectedRowKeys: string[];
  tempFilter: any;
  total: number;
  exportExcelBtnStatus: boolean;
  excelFileName: string;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/account/transaction", {
  exact: false,
  permissionCode: PAGE_PERMISSION_MAP["/dashboard/transaction"],
})
@inject("common", "transaction")
@observer
export default class TransactionList extends BaseReact<
{},
TransactionListState
> {
  // exportExcel = React.createRef();
  state = {
    transactionList: [],
    tableLoading: false,
    selectedRowKeys: [],
    tempFilter: {},
    total: 0,
    exportExcelBtnStatus: false,
    excelFileName: "历史明细",
  };

  async componentDidMount() {
    const { filter, } = this.props.transaction;
    const { paginationConfig, } = this.props.common;

    this.getDataList({
      ...utils.resetFilter(filter),
      page_size: filter.page_size || paginationConfig.defaultPageSize,
      page: filter.page || 1,
    });
  }

  getDataList = async (filter?: any) => {
    const payload = filter
      ? { ...this.props.transaction.filter, ...filter, }
      : this.props.transaction.filter;
    this.setState({
      tableLoading: true,
    });

    const res = await this.$api.account.getTransactionList({ params: payload, });
    const { results, page_size, current_page, count, } = res.data;
    if (results.length === 0 && current_page !== 1) {
      // 删除非第一页的最后一条记录，自动翻到下一页
      this.getDataList({ ...payload, page: current_page - 1, });
    } else {
      this.props.transaction.setFilter({
        page_size,
        page: current_page,
        name: payload.name,
      });
      this.setState({
        transactionList: results,
        tableLoading: false,
        total: count,
      });
    }
  };

  // @ts-ignore
  private onSearch = async () => {
    const filter: any = {
      page: 1,
      ...this.state.tempFilter,
    };

    if (filter.start_time) {
      filter.start_time = filter.start_time.unix();
    }

    if (filter.end_time) {
      filter.end_time = filter.end_time.unix();
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
    this.setState({
      tempFilter: {},
    }, () => { this.comfirmSearchParams(); });
  };

  onInputChanged = (field, value) => {
    this.setState((prevState: TransactionListState) => ({
      tempFilter: {
        ...prevState.tempFilter,
        [field]: value,
      },
    }));
  };

  exportExcel = async () => {
    let queryString = '?';
    const filter: any = {
      ...this.state.tempFilter,
    };

    if (filter.start_time) {
      filter.start_time = filter.start_time.unix();
    }

    if (filter.end_time) {
      filter.end_time = filter.end_time.unix();
    }

    for (var index in filter) {
      queryString += index + "=" + filter[index] + "&";
    }

    await this.$api.account.exportTransaction({ responseType: 'blob', }, queryString).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${Date.now()}.xls`);
      document.body.appendChild(link);
      link.click();
    });
  }

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

  // setTableAttrToExportExcel = () => {
  //   const tableCon = ReactDOM.findDOMNode(this.exportExcel.current); // 通过ref属性找到该table
  //   const table = tableCon.querySelector("table"); //获取table
  //   table.setAttribute("id", "table-to-xls"); //给该table设置属性
  // };

  render() {
    return (
      <div>
        <CommonHeader {...this.props} links={[]} title="历史明细" />
        <CommonList {...this.props} config={listConfig(this)} />
      </div>
    );
  }
}
