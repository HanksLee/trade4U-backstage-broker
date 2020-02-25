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
}

export default new FinanceStore();
