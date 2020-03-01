import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { PAGE_PERMISSION_MAP } from 'constant';

export interface Transaction {
  id?: string;
  ip: string;
  phone:	string;
  in_or_out: number;
  amount:	string;
  before_balance:	string;
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
};

/* eslint new-cap: "off" */
@WithRoute("/dashboard/account/transaction", { exact: false, permissionCode: PAGE_PERMISSION_MAP['/dashboard/transaction'], })
@inject("common", "account")
@observer
export default class TransactionList extends BaseReact<{}, TransactionListState> {
  state = {
    transactionList: [],
    tableLoading: false,
    selectedRowKeys: [],
    tempFilter: {},
    total: 0,
  };

  async componentDidMount() {
    const { filter, } = this.props.account;
    const { paginationConfig, } = this.props.common;

    this.getDataList({
      page_size: filter.page_size || paginationConfig.defaultPageSize,
      page: filter.page || 1,
    });
  }

  getDataList = async (filter?: any) => {
    const payload = filter ? { ...this.props.account.filter, ...filter, } : this.props.account.filter;
    this.setState({
      tableLoading: true,
    });
    
    const res = await this.$api.account.getTransactionList({ params: payload, });
    const { results, page_size, current_page, count, } = res.data;
    if ((res.data.results.length === 0) && res.data.offset !== 0) {
      // 删除非第一页的最后一条记录，自动翻到下一页
      this.getDataList({ ...payload, page: current_page - 1, });
    } else {
      this.props.account.setFilter({
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
    this.getDataList({
      page: 1,
      ...this.state.tempFilter,
    });
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
    this.setState((prevState: TransactionListState) => (
      {
        tempFilter: {
          ...prevState.tempFilter,
          [field]: value,
        },
      }
    ));
  }

  render() {
    return (
      <div>
        <CommonHeader {...this.props} links={[]} title="历史明细" />
        <CommonList {...this.props} config={listConfig(this)} />
      </div>
    );
  }
}
