import { action, observable, computed } from "mobx";
import BaseStore from "store/base";
import utils from "utils";

class AgencyStore extends BaseStore {
  @observable
  filterLog = {
    page_size: 10,
    current_page: 1,
  };
  @action
  setFilterLog = (filter, overwrite = false) => {
    if (overwrite) {
      this.filterLog = filter;
    } else {
      this.filterLog = {
        ...this.filterLog,
        ...filter,
      };
    }
  };
  @observable
  logList = [];
  @observable
  logListMeta = {
    total: 0,
    total_amount: {},
  };
  @action
  getLogList = async config => {
    const res = await this.$api.agency.getLogList(config);
    this.setLogList(res.data);
  };
  @action
  setLogList = data => {
    this.logList = data.results;
    this.logListMeta = {
      total: data.count,
      total_amount: data.total_amount,
    };
  };
  @observable
  filterInfo = {
    page_size: 10,
    current_page: 1,
  };
  @action
  setFilterInfo = (filter, overwrite = false) => {
    if (overwrite) {
      this.filterInfo = filter;
    } else {
      this.filterInfo = {
        ...this.filterInfo,
        ...filter,
      };
    }
  };
  @observable
  infoList = [];
  @observable
  infoListMeta = {
    total: 0,
    total_amount: {},
  };
  @action
  getInfoList = async config => {
    const res = await this.$api.agency.getInfoList(config);
    this.setInfoList(res.data);
  };
  @action
  setInfoList = data => {
    this.infoList = data.results;
    this.infoListMeta = {
      total: data.count,
      total_amount: data.total_amount,
    };
  };
  @observable
  filterAgent = {
    page_size: 10,
    current_page: 1,
  };
  @action
  setFilterAgent = (filter, overwrite = false) => {
    if (overwrite) {
      this.filterAgent = filter;
    } else {
      this.filterAgent = {
        ...this.filterAgent,
        ...filter,
      };
    }
  };
  @observable
  agentList = [];
  @observable
  agentListMeta = {
    total: 0,
    total_amount: {},
  };
  @action
  getAgentList = async config => {
    const res = await this.$api.agency.getAgentList(config);
    this.setAgentList(res.data);
  };
  @action
  setAgentList = data => {
    this.agentList = data.results;
    this.agentListMeta = {
      total: data.count,
      total_amount: data.total_amount,
    };
  };
  @observable
  currentAgent: any = {};

  @computed
  get currentShowAgent() {
    const obj: any = {};

    return {
      ...this.currentAgent,
      ...obj,
    };
  }
  @action
  getCurrentAgent = async (id, config = {}) => {
    const res = await this.$api.agency.getCurrentAgent(id, config);
    this.setCurrentAgent(res.data);
  };
  @action
  setCurrentAgent = (rule, overwrite = true, store = true) => {
    if (overwrite) {
      this.currentAgent = rule;
    } else {
      this.currentAgent = {
        ...this.currentAgent,
        ...rule,
      };
    }

    if (store) {
      utils.setLStorage("currentAgent", this.currentAgent);
    }
  };
  @observable
  currentRebate: any = {};

  @computed
  get currentShowRebate() {
    const obj: any = {};

    return {
      ...this.currentRebate,
      ...obj,
    };
  }
  @action
  getCurrentRebate = async (id, config = {}) => {
    const res = await this.$api.agency.getRebateSettings(id, config);
    this.setCurrentRebate(res.data, true, false);
  };
  @action
  setCurrentRebate = (rule, overwrite = true, store = true) => {
    if (overwrite) {
      this.currentRebate = rule;
    } else {
      this.currentRebate = {
        ...this.currentRebate,
        ...rule,
      };
    }

    if (store) {
      utils.setLStorage("currentRebate", this.currentRebate);
    }
  };
}

export default new AgencyStore();
