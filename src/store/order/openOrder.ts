import { action, observable } from "mobx";
import BaseStore from "store/base";

export interface Filter {
  page_size: number;
  page: number;
  order_number?: string;
  status?: string;
  phone?: string;
  username?: string;
  user?: string;
  symbol_name?: string;
  product_code?: string;
  create_start_time?: number;
  create_end_time?: number;
}

class OpenOrderStore extends BaseStore {
  @observable
  filter: Filter = {
    page_size: 10,
    page: 1,
  };
  @action
  setFilter = (filter: Filter) => {
    this.filter = { ...this.filter, ...filter, };
  };
}

export default new OpenOrderStore();