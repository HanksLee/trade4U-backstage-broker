import { action, observable, computed } from "mobx";
import BaseStore from "store/base";
import utils from "utils";
import { WeeklyOrder } from 'constant';
import moment from 'moment';

class ProductStore extends BaseStore {
  LIMITED_MINUTES = 10;
  
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


  @observable
  filterHistoryDateList = [null, null];

  @action
  setFilterHistoryDateInit() {
    this.filterHistoryDateList = [null, null];
  }

  @action
  setFilterHistoryDate(date) {
    let [start, end] = date;
    if(start && end) {
      end = !utils.checkDateLimited(start, end, this.LIMITED_MINUTES) ? 
        start.add(10, 'm')
        : end;
    }
   
    this.filterHistoryDateList[0]  = start;
    this.filterHistoryDateList[1] = end;
  }

  @computed
  get getFilterHistoryDateList() {
    return this.filterHistoryDateList;
  }
   
  @computed
  get checkFilter() {
    const [start, end] = this.filterHistoryDateList;
    return start && end && utils.checkDateLimited(start, end, this.LIMITED_MINUTES);
  }

  

  @observable
  historyList = [];

  @action 
  async fetchHistoryList(id, start_time, end_time, config) {
    const res = await this.$api.product.getHistoryList(id, start_time, end_time, config);
 
    this.setHistoryList(res.data);
  }

  @computed
  get getHistoryList() {
    return this.historyList;
  }

  @action 
  setHistoryList(data) {
    this.historyList = data;
  }

  @action 
  setHistoryListInit() {
    this.historyList = [];
  }


  @action 
  setInit() {
    this.setHistoryListInit();
    this.setFilterHistoryDateInit();
  }
}

export default new ProductStore();
