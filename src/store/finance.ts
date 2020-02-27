import { action, observable, computed } from "mobx";
import BaseStore from "store/base";
import utils from "utils";
import moment from 'moment';

class FinanceStore extends BaseStore {
  @observable
  filterDeposit = {
    page_size: 10,
    current_page: 1,
  };
  @action
  setFilterDeposit = (filter, overwrite = false) => {
    if (overwrite) {
      this.filterDeposit = filter;
    } else {
      this.filterDeposit = {
        ...this.filterDeposit,
        ...filter,
      };
    }
  };
  @observable
  depositList = [];
  @observable
  depositListMeta = {};
  @action
  getDepositList = async config => {
    const res = await this.$api.finance.getDepositList(config);
    this.setDepositList(res.data);
  };
  @action
  setDepositList = data => {
    this.depositList = data.results;
    this.depositListMeta = {
      total: data.count,
    };
  };
  @observable
  currentDeposit: any = {};

  @computed
  get currentShowDeposit() {
    const obj: any = {};

    return {
      ...this.currentDeposit,
      ...obj,
    };
  }
  @action
  getCurrentDeposit = async (id, config = {}) => {
    const res = await this.$api.finance.getCurrentDeposit(id, config);
    this.setCurrentDeposit(res.data);
  };
  @action
  setCurrentDeposit = (rule, overwrite = true, store = true) => {
    if (overwrite) {
      this.currentDeposit = rule;
    } else {
      this.currentDeposit = {
        ...this.currentDeposit,
        ...rule,
      };
    }

    if (store) {
      utils.setLStorage("currentDeposit", this.currentDeposit);
    }
  };
  @observable
  filterWithdraw = {
    page_size: 10,
    current_page: 1,
  };
  @action
  setFilterWithdraw = (filter, overwrite = false) => {
    if (overwrite) {
      this.filterWithdraw = filter;
    } else {
      this.filterWithdraw = {
        ...this.filterWithdraw,
        ...filter,
      };
    }
  };
  @observable
  withdrawList = [];
  @observable
  withdrawListMeta = {};
  @action
  getWithdrawList = async config => {
    const res = await this.$api.finance.getWithdrawList(config);
    this.setWithdrawList(res.data);
  };
  @action
  setWithdrawList = data => {
    this.withdrawList = data.results;
    this.withdrawListMeta = {
      total: data.count,
    };
  };
  @observable
  currentWithdraw: any = {};

  @computed
  get currentShowWithdraw() {
    const obj: any = {};

    return {
      ...this.currentWithdraw,
      ...obj,
    };
  }
  @action
  getCurrentWithdraw = async (id, config = {}) => {
    const res = await this.$api.finance.getCurrentWithdraw(id, config);
    this.setCurrentWithdraw(res.data);
  };
  @action
  setCurrentWithdraw = (rule, overwrite = true, store = true) => {
    if (overwrite) {
      this.currentWithdraw = rule;
    } else {
      this.currentWithdraw = {
        ...this.currentWithdraw,
        ...rule,
      };
    }

    if (store) {
      utils.setLStorage("currentWithdraw", this.currentWithdraw);
    }
  };
  @observable
  filterPayment = {
    page_size: 10,
    current_page: 1,
  };
  @action
  setFilterPayment = (filter, overwrite = false) => {
    if (overwrite) {
      this.filterPayment = filter;
    } else {
      this.filterWithdraw = {
        ...this.filterPayment,
        ...filter,
      };
    }
  };
  @observable
  paymentList = [];
  @observable
  paymentListMeta = {};
  @action
  getPaymentList = async config => {
    const res = await this.$api.finance.getPaymentList(config);
    this.setPaymentList(res.data);
  };
  @action
  setPaymentList = data => {
    this.paymentList = data.results;
    this.paymentListMeta = {
      total: data.count,
    };
  };
  @observable
  currentPayment: any = {};

  @computed
  get currentShowPayment() {
    const obj: any = {};

    return {
      ...this.currentPayment,
      ...obj,
    };
  }
  @action
  getCurrentPayment = async (id, config = {}) => {
    const res = await this.$api.finance.getCurrentPayment(id, config);
    this.setCurrentPayment(res.data);
  };
  @action
  setCurrentPayment = (rule, overwrite = true, store = true) => {
    if (overwrite) {
      this.currentPayment = rule;
    } else {
      this.currentPayment = {
        ...this.currentPayment,
        ...rule,
      };
    }

    if (store) {
      utils.setLStorage("currentPayment", this.currentPayment);
    }
  };
}

export default new FinanceStore();
