import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import DepositEdtior from 'pages/Finance/Deposit/DepositEditor';
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import "./index.scss";
import utils from 'utils';
import { Modal } from 'antd';

export interface IDepositListProps { }

export interface IDepositListState {
  // filter: any;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/finance/deposit", { exact: false, })
@inject("common", "finance")
@observer
export default class DepositList extends BaseReact<IDepositListProps, IDepositListState> {
  private $depositEditor = null;
  state = {
    filter: {},
    tableLoading: false,
    currentPage: 1,
    selectedRowKeys: [],
    depositModalVisible: false,
    scopeOptions: [
      {
        id: 1,
        name: '保证金计算',
      },
      {
        id: 2,
        name: '盈亏计算',
      },
      {
        id: 3,
        name: '预付款计算',
      }
    ],
  };

  async componentDidMount() {
    // @todo 这里需要从 commonStore 中设置默认的分页
    const {
      paginationConfig: { defaultPageSize, defaultCurrent, },
    } = this.props.common;

    this.resetPagination(defaultPageSize, defaultCurrent);
    // this.getScopeOptions();
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/finance/deposit") {
      this.props.history.replace("/dashboard/finance/deposit/list");
    }
  }

  getScopeOptions = async () => {
    const res = await this.$api.finance.getScopeOptions();

    if (res.data.status == 200) {
      this.setState({
        scopeOptions: res.data.list,
      });
    }
  }

  getDataList = (payload = {}) => {
    this.setState(
      {
        tableLoading: true,
        filter: {
          ...this.state.filter,
          ...payload,
        },
      },
      async () => {
        await this.props.finance.getDepositList({
          params: this.state.filter,
        });
        this.setState({ tableLoading: false, });
      }
    );
  };

  toggleDepositModal = () => {
    this.setState({
      depositModalVisible: !this.state.depositModalVisible,
    });
  }

  onModalConfirm = async () => {
    const { currentDeposit, } = this.props.finance;

    let res;
    if (!currentDeposit.name) {
      return this.$msg.warn('请输入利润规则名称');
    }

    if (!currentDeposit.scope) {
      return this.$msg.warn('请选择利润规则作用域');
    }

    if (!currentDeposit.func_name) {
      return this.$msg.warn('请输入利润规则函数');
    }

    let payload: any = {
      name: currentDeposit.name,
      scope: currentDeposit.scope,
      func_name: currentDeposit.func_name,
    };

    if (currentDeposit.id) {
      // payload['id'] = currentDeposit.id,
      res = await this.$api.finance.updateDeposit(currentDeposit.id, payload);
    } else {
      res = await this.$api.finance.createDeposit(payload);
    }

    const statusCode = currentDeposit.id ? 200 : 201;

    if (res.status == statusCode) {
      this.$msg.success(!currentDeposit.uid ? '利润规则添加成功' : '利润规则编辑成功');
      this.toggleDepositModal();
      this.getDataList(this.state.filter);
    } else {
      this.$msg.error(res.data.msg);
    }
  }

  onModalCancel = () => {
    this.setState({
      depositModalVisible: false,
    });
    this.props.finance.setCurrentDeposit({});
  }

  resetPagination = async (pageSize, pageNum) => {
    this.setState(
      {
        filter: {
          ...this.state.filter,
          page_size: pageSize,
          current_page: pageNum,
        },
      },
      async () => {
        const filter = this.state.filter;
        this.getDataList(filter);
      }
    );
  };
  // @ts-ignore
  private onSearch = async () => {
    const filter: any = this.state.filter;

    // console.log('filter', filter);

    this.setState(
      {
        filter: {
          ...filter,
          current_page: 1,
        },
        currentPage: 1,
      },
      () => {
        this.getDataList(this.state.filter);
      }
    );
  };
  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    const filter: any = { current_page: 1, pageSize: this.state.filter.page_size, };

    this.setState(
      {
        filter,
        currentPage: 1,
      },
      () => {
        this.getDataList(this.state.filter);
      }
    );
  };

  goToEditor = (record: any): void => {
    const url = `/dashboard/finance/deposit/editor?id=${!utils.isEmpty(record) ? record.id : 0}`;
    this.props.history.push(url);
    this.props.finance.setCurrentDeposit(record, true, false);
  }

  renderMenu = (record): JSX.Element => {
    return null;
  };

  // @ts-ignore
  private onBatch = async value => { };

  render() {
    const { match, } = this.props;
    const computedTitle = '入金管理';
    const { depositModalVisible, } = this.state;
    const { currentDeposit, } = this.props.finance;

    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        {
          depositModalVisible && (
            <Modal
              width={720}
              visible={depositModalVisible}
              title={
                utils.isEmpty(currentDeposit.id) ? '添加利润规则' : '编辑利润规则'
              }
              onOk={this.onModalConfirm}
              onCancel={this.onModalCancel}
            >
              <DepositEdtior onRef={ref => this.$depositEditor = ref} />
            </Modal>
          )
        }
      </div>
    );
  }
}
