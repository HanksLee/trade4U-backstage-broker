import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import PaymentEdtior from "pages/Finance/Payment/PaymentEditor";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import "./index.scss";
import utils from "utils";
import { Modal } from "antd";

export interface IPaymentListProps { }

export interface IPaymentListState {
  // filter: any;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/finance/payment", { exact: false, })
@inject("common", "finance")
@observer
export default class PaymentList extends BaseReact<
IPaymentListProps,
IPaymentListState
> {
  private $paymentEditor = null;
  state = {
    filter: {},
    tableLoading: false,
    currentPage: 1,
    selectedRowKeys: [],
    paymentModalVisible: false,
    name: undefined,
    code: undefined,
    status: undefined,
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

  getDataList = (payload = {}) => {
    this.setState(
      {
        tableLoading: true,
      },
      async () => {
        this.props.finance.setFilterPayment({
          ...payload,
        });

        await this.props.finance.getPaymentList({
          params: this.props.finance.filterPayment,
        });
        this.setState({ tableLoading: false, });
      }
    );
  };

  togglePaymentModal = async (id?) => {
    this.setState({
      paymentModalVisible: !this.state.paymentModalVisible,
    });
  };

  onModalConfirm = async () => {
    const { currentPayment, } = this.props.finance;

    let res;

    if (!currentPayment.name) {
      return this.$msg.warn("请输入通道名称");
    }

    if (!currentPayment.code) {
      return this.$msg.warn("请输入通道编码");
    }

    if (!currentPayment.merchant) {
      return this.$msg.warn("请输入商户名称");
    }

    if (!currentPayment.merchant_number) {
      return this.$msg.warn("请输入商户编号");
    }

    if (!currentPayment.currency) {
      return this.$msg.warn("请输入支持货币");
    }

    if (currentPayment.redirect == null) {
      return this.$msg.warn("请输入银行/三方");
    }

    if (currentPayment.min_deposit == null) {
      return this.$msg.warn("请输入最低入金");
    }

    if (currentPayment.max_deposit == null) {
      return this.$msg.warn("请输入最高入金");
    }

    if (currentPayment.fee == null) {
      return this.$msg.warn("请输入金手续费");
    }

    if (currentPayment.scope == null) {
      return this.$msg.warn("请选择适用范围");
    }

    let payload: any = {
      name: currentPayment.name,
      code: currentPayment.code,
      merchant: currentPayment.merchant,
      merchant_number: currentPayment.merchant_number,
      pub_key: currentPayment.pub_key,
      pri_key: currentPayment.pri_key,
      currency: currentPayment.currency,
      merchant_key: currentPayment.merchant_key,
      redirect: currentPayment.redirect,
      domain: currentPayment.domain,
      min_deposit: currentPayment.min_deposit,
      max_deposit: currentPayment.max_deposit,
      fee: currentPayment.fee,
      scope: currentPayment.scope,
      remarks: currentPayment.remarks,
    };

    if (currentPayment.id) {
      res = await this.$api.finance.updatePayment(currentPayment.id, payload);
    } else {
      res = await this.$api.finance.createPayment(payload);
    }

    const statusCode = currentPayment.id ? 200 : 201;

    if (res.status == statusCode) {
      this.$msg.success(
        !currentPayment.id ? "支付方式添加成功" : "支付方式编辑成功"
      );
      this.togglePaymentModal();
      this.getDataList(this.props.finance.filterPayment);
    } else {
      this.$msg.error(res.data.msg);
    }
  };

  onModalCancel = () => {
    this.setState({
      paymentModalVisible: false,
    });
    this.props.finance.setCurrentPayment({}, true, false);
  };

  resetPagination = async (page_size, current_page) => {
    this.props.finance.setFilterPayment({
      page_size,
      current_page,
      // name: undefined,
      // code: undefined,
      // status: undefined,
    });
    this.setState(
      {
        current_page,
      },
      async () => {
        const filter = this.props.finance.filterPayment;

        this.getDataList(filter);
      }
    );
  };
  // @ts-ignore
  private onSearch = async () => {
    this.props.finance.setFilterPayment({
      current_page: 1,
    });
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.getDataList(this.props.finance.filterPayment);
      }
    );
  };
  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    const filter: any = {
      current_page: 1,
    };

    this.props.finance.setFilterPayment(filter, true);

    this.setState(
      {
        currentPage: 1,
        name: undefined,
        code: undefined,
        status: undefined,
      },
      () => {
        this.getDataList(this.props.finance.filterPayment);
      }
    );
  };

  goToEditor = (record: any): void => {
    const url = `/dashboard/finance/payment/editor?id=${
      !utils.isEmpty(record) ? record.id : 0
    }`;
    this.props.history.push(url);
  };

  renderMenu = (record): JSX.Element => {
    return null;
  };

  onInputChanged = (field, value) => {
    this.setState({
      [field]: value,
    });

    this.props.finance.setFilterPayment({
      [field]: value ? value : undefined,
    });
  };

  onOptionSelect = (field, value, elem) => {
    this.setState(
      {
        [`${field}`]: value,
      },
      () => {
        this.props.finance.setFilterPayment({
          [`${field}`]: value,
        });

        this.getDataList(this.props.finance.filterPayment);
      }
    );
  };

  // @ts-ignore
  private onBatch = async value => { };

  render() {
    const { match, } = this.props;
    const computedTitle = "支付方式";
    const { paymentModalVisible, } = this.state;
    const { currentPayment, } = this.props.finance;

    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        {paymentModalVisible && (
          <Modal
            width={900}
            visible={paymentModalVisible}
            title={
              utils.isEmpty(currentPayment.id) ? "添加支付方式" : "编辑支付方式"
            }
            onOk={this.onModalConfirm}
            onCancel={this.onModalCancel}
          >
            <PaymentEdtior onRef={ref => (this.$paymentEditor = ref)} />
          </Modal>
        )}
      </div>
    );
  }
}
