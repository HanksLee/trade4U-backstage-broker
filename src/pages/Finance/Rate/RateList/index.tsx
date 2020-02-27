import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import RateEdtior from 'pages/Finance/Rate/RateEditor';
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import "./index.scss";
import utils from 'utils';
import { Modal } from 'antd';

export interface IRateListProps { }

export interface IRateListState {
  // filter: any;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/finance/rate", { exact: false, })
@inject("common", "finance")
@observer
export default class RateList extends BaseReact<IRateListProps, IRateListState> {
  private $rateEditor = null;
  state = {
    filter: {},
    tableLoading: false,
    currentPage: 1,
    selectedRowKeys: [],
    rateModalVisible: true,
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
    if (this.props.location.pathname === "/dashboard/finance/rate") {
      this.props.history.replace("/dashboard/finance/rate/list");
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
        await this.props.finance.getRateList({
          params: this.state.filter,
        });
        this.setState({ tableLoading: false, });
      }
    );
  };

  toggleRateModal = async (id?) => {
    // if (!this.state.rateModalVisible) {
    //   await this.props.finance.getCurrentRate(id);
    // } else {
    //   this.props.finance.setCurrentRate({}, true, false);
    // }

    this.setState({
      rateModalVisible: !this.state.rateModalVisible,
    });
  }

  onModalConfirm = async () => {
    const { currentRate, } = this.props.finance;

    let res;
    if (!currentRate.name) {
      return this.$msg.warn('请输入利润规则名称');
    }

    if (!currentRate.scope) {
      return this.$msg.warn('请选择利润规则作用域');
    }

    if (!currentRate.func_name) {
      return this.$msg.warn('请输入利润规则函数');
    }

    let payload: any = {
      name: currentRate.name,
      scope: currentRate.scope,
      func_name: currentRate.func_name,
    };

    if (currentRate.id) {
      // payload['id'] = currentRate.id,
      res = await this.$api.finance.updateRate(currentRate.id, payload);
    } else {
      res = await this.$api.finance.createRate(payload);
    }

    const statusCode = currentRate.id ? 200 : 201;

    if (res.status == statusCode) {
      this.$msg.success(!currentRate.id ? '利润规则添加成功' : '利润规则编辑成功');
      this.toggleRateModal();
      this.getDataList(this.state.filter);
    } else {
      this.$msg.error(res.data.msg);
    }
  }

  onModalCancel = () => {
    this.setState({
      rateModalVisible: false,
    });
    this.props.finance.setCurrentRate({}, true, false);
  }

  resetPagination = async (page_size, current_page) => {
    return;
    this.props.finance.setFilterRate({
      page_size,
      current_page,
    });
    this.setState(
      {
        current_page,
      },
      async () => {
        const filter = this.props.finance.filterRate;

        this.getDataList(filter);
      }
    );
  };
  // @ts-ignore
  private onSearch = async () => {
    this.props.finance.setFilterRate({
      current_page: 1,
    });
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.getDataList(this.props.finance.filterRate);
      }
    );
  };
  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    const filter: any = {
      current_page: 1,
    };

    this.props.finance.setFilterRate(filter, true);

    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.getDataList(this.props.finance.filterRate);
      }
    );
  };

  goToEditor = (record: any): void => {
    const url = `/dashboard/finance/rate/editor?id=${!utils.isEmpty(record) ? record.id : 0}`;
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
    const { rateModalVisible, } = this.state;
    const { currentRate, } = this.props.finance;

    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        {
          rateModalVisible && (
            <Modal
              width={900}
              visible={rateModalVisible}
              title={
                utils.isEmpty(currentRate.id) ? '添加利润规则' : '编辑利润规则'
              }
              onOk={this.onModalConfirm}
              onCancel={this.onModalCancel}
            >
              <RateEdtior onRef={ref => this.$rateEditor = ref} />
            </Modal>
          )
        }
      </div>
    );
  }
}
