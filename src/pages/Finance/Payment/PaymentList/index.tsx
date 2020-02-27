import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import PaymentEdtior from 'pages/Finance/Payment/PaymentEditor';
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import "./index.scss";
import utils from 'utils';
import { Modal } from 'antd';

export interface IPaymentListProps { }

export interface IPaymentListState {
  // filter: any;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/finance/payment", { exact: false, })
@inject("common", "finance")
@observer
export default class PaymentList extends BaseReact<IPaymentListProps, IPaymentListState> {
  private $paymentEditor = null;
  state = {
    filter: {},
    tableLoading: false,
    currentPage: 1,
    selectedRowKeys: [],
    paymentModalVisible: false,
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
    if (this.props.location.pathname === "/dashboard/finance/payment") {
      this.props.history.replace("/dashboard/finance/payment/list");
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
        await this.props.finance.getPaymentList({
          params: this.state.filter,
        });
        this.setState({ tableLoading: false, });
      }
    );
  };

  togglePaymentModal = () => {
    this.setState({
      paymentModalVisible: !this.state.paymentModalVisible,
    });
  }

  onModalConfirm = async () => {
    const { currentPayment, } = this.props.finance;

    let res;
    if (!currentPayment.name) {
      return this.$msg.warn('请输入利润规则名称');
    }

    if (!currentPayment.scope) {
      return this.$msg.warn('请选择利润规则作用域');
    }

    if (!currentPayment.func_name) {
      return this.$msg.warn('请输入利润规则函数');
    }

    let payload: any = {
      name: currentPayment.name,
      scope: currentPayment.scope,
      func_name: currentPayment.func_name,
    };

    if (currentPayment.id) {
      // payload['id'] = currentPayment.id,
      res = await this.$api.finance.updatePayment(currentPayment.id, payload);
    } else {
      res = await this.$api.finance.createPayment(payload);
    }

    const statusCode = currentPayment.id ? 200 : 201;

    if (res.status == statusCode) {
      this.$msg.success(!currentPayment.uid ? '利润规则添加成功' : '利润规则编辑成功');
      this.togglePaymentModal();
      this.getDataList(this.state.filter);
    } else {
      this.$msg.error(res.data.msg);
    }
  }

  onModalCancel = () => {
    this.setState({
      paymentModalVisible: false,
    });
    this.props.finance.setCurrentPayment({});
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
    const url = `/dashboard/finance/payment/editor?id=${!utils.isEmpty(record) ? record.id : 0}`;
    this.props.history.push(url);
    this.props.finance.setCurrentPayment(record, true, false);
  }

  renderMenu = (record): JSX.Element => {
    return null;
  };

  // @ts-ignore
  private onBatch = async value => { };

  render() {
    const { match, } = this.props;
    const computedTitle = '支付管理';
    const { paymentModalVisible, } = this.state;
    const { currentPayment, } = this.props.finance;

    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        {
          paymentModalVisible && (
            <Modal
              width={720}
              visible={paymentModalVisible}
              title={
                utils.isEmpty(currentPayment.id) ? '添加利润规则' : '编辑利润规则'
              }
              onOk={this.onModalConfirm}
              onCancel={this.onModalCancel}
            >
              <PaymentEdtior onRef={ref => this.$paymentEditor = ref} />
            </Modal>
          )
        }
      </div>
    );
  }
}
