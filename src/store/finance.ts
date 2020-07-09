import { action, observable, computed } from "mobx";
import BaseStore from "store/base";
import utils from "utils";

class FinanceStore extends BaseStore {
  @observable
  filterDeposit = {
    page_size: 10,
    page: 1,
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
  depositListMeta = {
    total: 0,
    total_amount: {},
  };
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
      total_amount: data.total_amount,
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
    page: 1,
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
  withdrawListMeta = {
    total: 0,
    total_amount: {},
  };
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
      total_amount: data.total_amount,
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
    page: 1,
  };
  @action
  setFilterPayment = (filter, overwrite = false) => {
    if (overwrite) {
      this.filterPayment = filter;
    } else {
      this.filterPayment = {
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
  @observable
  filterRate = {
    page_size: 10,
    page: 1,
  };
  @action
  setFilterRate = (filter, overwrite = false) => {
    if (overwrite) {
      this.filterRate = filter;
    } else {
      this.filterRate = {
        ...this.filterRate,
        ...filter,
      };
    }
  };
  @observable
  rateList = [];
  @observable
  rateListMeta = {};
  @action
  getRateList = async config => {
    const res = await this.$api.finance.getRateList(config);
    this.setRateList(res.data);
  };
  @action
  setRateList = data => {
    this.rateList = data.results;
    this.rateListMeta = {
      total: data.count,
    };
  };
  @observable
  currentRate: any = {};

  @computed
  get currentShowRate() {
    const obj: any = {};

    return {
      ...this.currentRate,
      ...obj,
    };
  }
  @action
  getCurrentRate = async (id, config = {}) => {
    const res = await this.$api.finance.getCurrentRate(id, config);
    this.setCurrentRate(res.data);
  };
  @action
  setCurrentRate = (rule, overwrite = true, store = true) => {
    if (overwrite) {
      this.currentRate = rule;
    } else {
      this.currentRate = {
        ...this.currentRate,
        ...rule,
      };
    }

    if (store) {
      utils.setLStorage("currentRate", this.currentRate);
    }
  };
  @observable
  initRemitStatus = 0;
  @action
  setInitWithdrawStatus = status => {
    this.initRemitStatus = status;
  }
}

export default new FinanceStore();
