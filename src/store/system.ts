import { action, observable, computed } from "mobx";
import BaseStore from "store/base";

export interface Filter {
  page_size: number;
  page: number;
  name?: string;
}

class SystemStore extends BaseStore {
  @observable
  filter = {
    page_size: 10,
    current_page: 1,
  };
  @action
  setFilter = (filter, overwrite = false) => {
    if (overwrite) {
      this.filter = filter;
    } else {
      this.filter = {
        ...this.filter,
        ...filter,
      };
    }
  };
}

export default new SystemStore();
