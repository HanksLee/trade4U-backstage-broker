import { action, observable, computed } from "mobx";
import BaseStore from "store/base";
import utils from "utils";
import { WeeklyOrder } from 'constant';
import moment from 'moment';

class ProductStore extends BaseStore {
  @observable
  filterProduct = {
    page_size: 10,
    current_page: 1,
  };
  @action
  setFilterProduct = (filter, overwrite = false) => {
    if (overwrite) {
      this.filterProduct = filter;
    } else {
      this.filterProduct = {
        ...this.filterProduct,
        ...filter,
      };
    }
  };
  @observable
  productList = [];
  @observable
  productListMeta = {};
  @action
  getProductList = async config => {
    const res = await this.$api.product.getProductList(config);
    this.setProductList(res.data);
  };
  @action
  setProductList = data => {
    this.productList = data.results;
    this.productListMeta = {
      total: data.count,
    };
  };
  @observable
  currentProduct: any = {};

  @computed
  get currentShowProduct() {
    const obj: any = {

    };

    if (!utils.isEmpty(this.currentProduct.trading_times)) {
      obj.trading_times = WeeklyOrder.map(item => {
        const matched = JSON.parse(this.currentProduct.trading_times)[item];

        if (matched) {
          return {
            day: item,
            trades: matched.trades.map(time => time && moment(time * 1000) || null),
          };
        }

        return {
          day: item,
          trades: [],
        };
      });
    } else {
      obj.trading_times = WeeklyOrder.map(item => {
        return {
          day: item,
          trades: [],
        };
      });
    }

    return {
      ...this.currentProduct,
      ...obj,
    };
  }
  @action
  getCurrentProduct = async (id, config = {}) => {
    const res = await this.$api.product.getCurrentProduct(id, config);
    this.setCurrentProduct(res.data);
  };
  @action
  setCurrentProduct = (rule, overwrite = true, store = true) => {
    if (overwrite) {
      this.currentProduct = rule;
    } else {
      this.currentProduct = {
        ...this.currentProduct,
        ...rule,
      };
    }

    if (store) {
      utils.setLStorage("currentProduct", this.currentProduct);
    }
  };
}

export default new ProductStore();
