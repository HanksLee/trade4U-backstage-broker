import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import WithdrawEdtior from 'pages/Finance/Withdraw/WithdrawEditor';
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import "./index.scss";
import utils from 'utils';
import { Modal } from 'antd';

export interface IWithdrawListProps { }

export interface IWithdrawListState {
  // filter: any;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/finance/withdraw", { exact: false, })
@inject("common", "finance")
@observer
export default class WithdrawList extends BaseReact<IWithdrawListProps, IWithdrawListState> {
  private $withdrawEditor = null;
  state = {
    filter: {},
    tableLoading: false,
    currentPage: 1,
    selectedRowKeys: [],
    withdrawModalVisible: false,
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
    if (this.props.location.pathname === "/dashboard/finance/withdraw") {
      this.props.history.replace("/dashboard/finance/withdraw/list");
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
        await this.props.finance.getWithdrawList({
          params: this.state.filter,
        });
        this.setState({ tableLoading: false, });
      }
    );
  };

  toggleWithdrawModal = async (id?) => {
    if (!this.state.withdrawModalVisible) {
      await this.props.finance.getCurrentWithdraw(id);
    } else {
      this.props.finance.setCurrentWithdraw({}, true, false);
    }

    this.setState({
      withdrawModalVisible: !this.state.withdrawModalVisible,
    });
  }

  onModalConfirm = async () => {
    const { currentWithdraw, } = this.props.finance;

    let res;
    if (!currentWithdraw.name) {
      return this.$msg.warn('请输入利润规则名称');
    }

    if (!currentWithdraw.scope) {
      return this.$msg.warn('请选择利润规则作用域');
    }

    if (!currentWithdraw.func_name) {
      return this.$msg.warn('请输入利润规则函数');
    }

    let payload: any = {
      name: currentWithdraw.name,
      scope: currentWithdraw.scope,
      func_name: currentWithdraw.func_name,
    };

    if (currentWithdraw.id) {
      // payload['id'] = currentWithdraw.id,
      res = await this.$api.finance.updateWithdraw(currentWithdraw.id, payload);
    } else {
      res = await this.$api.finance.createWithdraw(payload);
    }

    const statusCode = currentWithdraw.id ? 200 : 201;

    if (res.status == statusCode) {
      this.$msg.success(!currentWithdraw.id ? '利润规则添加成功' : '利润规则编辑成功');
      this.toggleWithdrawModal();
      this.getDataList(this.state.filter);
    } else {
      this.$msg.error(res.data.msg);
    }
  }

  onModalCancel = () => {
    this.setState({
      withdrawModalVisible: false,
    });
    this.props.finance.setCurrentWithdraw({}, true, false);
  }

  resetPagination = async (page_size, current_page) => {
    this.props.finance.setFilterWithdraw({
      page_size,
      current_page,
    });
    this.setState(
      {
        current_page,
      },
      async () => {
        const filter = this.props.finance.filterWithdraw;

        this.getDataList(filter);
      }
    );
  };
  // @ts-ignore
  private onSearch = async () => {
    this.props.finance.setFilterWithdraw({
      current_page: 1,
    });
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.getDataList(this.props.finance.filterWithdraw);
      }
    );
  };
  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    const filter: any = {
      current_page: 1,
    };

    this.props.finance.setFilterWithdraw(filter, true);

    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.getDataList(this.props.finance.filterWithdraw);
      }
    );
  };

  goToEditor = (record: any): void => {
    const url = `/dashboard/finance/withdraw/editor?id=${!utils.isEmpty(record) ? record.id : 0}`;
    this.props.history.push(url);
  }

  renderMenu = (record): JSX.Element => {
    return null;
  };

  // @ts-ignore
  private onBatch = async value => { };

  render() {
    const { match, } = this.props;
    const computedTitle = '入金管理';
    const { withdrawModalVisible, } = this.state;
    const { currentWithdraw, } = this.props.finance;

    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        {
          withdrawModalVisible && (
            <Modal
              width={720}
              visible={withdrawModalVisible}
              title={
                utils.isEmpty(currentWithdraw.id) ? '添加利润规则' : '编辑利润规则'
              }
              onOk={this.onModalConfirm}
              onCancel={this.onModalCancel}
            >
              <WithdrawEdtior onRef={ref => this.$withdrawEditor = ref} />
            </Modal>
          )
        }
      </div>
    );
  }
}
