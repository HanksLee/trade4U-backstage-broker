import { action, observable, computed } from "mobx";
import BaseStore from "store/base";

export interface Filter {
  page_size: number;
  page: number;
  name?: string;
}

class SmsStore extends BaseStore {
  @observable
  filterChannel: Filter = {
    page_size: 10,
    page: 1,
  };
  @action
  setFilterChannel = (filter: Filter) => {
    this.filterChannel = { ...this.filterChannel, ...filter, };
  };

  @observable
  filterTemplate: Filter = {
    page_size: 10,
    page: 1,
  };
  @action
  setFilterTemplate = (filter: Filter) => {
    this.filterTemplate = { ...this.filterTemplate, ...filter, };
  };

  @observable
  filterRecord: Filter = {
    page_size: 10,
    page: 1,
  };
  @action
  setFilterRecord = (filter: Filter) => {
    this.filterRecord = { ...this.filterRecord, ...filter, };
  };
}

export default new SmsStore();
