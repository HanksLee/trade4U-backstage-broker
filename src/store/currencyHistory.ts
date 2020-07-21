import { action, observable, computed } from "mobx";
import BaseStore from "store/base";
import utils from "utils";
import moment from 'moment';


class CurrencyHistoryStore extends BaseStore {
  LIMITED_MINUTES = 10;
    @observable
  filterInfo ={
    start_time:null,
    end_time:null,
    currency:"",
  }

    @action
    setFilterInfo(d) {
      this.filterInfo = {
        ...this.filterInfo,
        ...d,
      };
    }

    @computed
    get getFilterInfo() {
      return this.filterInfo;
    }

    @computed
    get isFilterOK() {
      const { start_time, end_time, currency, } =  this.filterInfo;
      return (start_time && end_time) && 
                utils.checkDateLimited(start_time, end_time, this.LIMITED_MINUTES) &&
                currency;
    }


    @observable
    currencyHistoryList = []

    @action
    async fetchCurrencyHistoryList() {
      const { start_time, end_time, currency, } = this.filterInfo;
      const res = await this.$api.currencyHistory.getCurrencyHistoryList(start_time.unix(), end_time.unix(), currency, {});

      this.setCurrencyHistoryList(res.data);
    }

    @action 
    setCurrencyHistoryList(d) {
      this.currencyHistoryList = d;
    }

    @computed
    get getCurrencyHistoryList() {
      return this.currencyHistoryList;
    }

    @action
    setInit() {
      this.currencyHistoryList = [];
      this.filterInfo = {
        start_time:null,
        end_time:null,
        currency:"",
      };
    }

}


export default new CurrencyHistoryStore();