import { action, observable } from "mobx";
import BaseStore from "store/base";

export interface Filter {
  page_size: number;
  page: number;
  name?: string;
}

class MessageStore extends BaseStore {
  @observable
  filterType: Filter = {
    page_size: 10,
    page: 1,
  };
  @action
  setFilterType = (filter: Filter) => {
    this.filterType = { ...this.filterType, ...filter, };
  };

  @observable
  filterContent: Filter = {
    page_size: 10,
    page: 1,
  };
  @action
  setFilterContent = (filter: Filter) => {
    this.filterContent = { ...this.filterContent, ...filter, };
  };
}

export default new MessageStore();
