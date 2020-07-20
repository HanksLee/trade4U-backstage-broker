import { action, observable, computed } from "mobx";
import BaseStore from "store/base";
import utils from "utils";
import moment from 'moment';


class RiskStore extends BaseStore {
  LIMITED_MINUTES = 10;
    @observable
  filterInfo ={
    start_time:null,
    end_time:null,
    username:"",
    phone:"",
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
      const { start_time, end_time, } =  this.filterInfo;
      return (start_time && end_time) && 
                utils.checkDateLimited(start_time, end_time, this.LIMITED_MINUTES);
    }


    @observable
    riskList = []

    @action
    async fetchRiskList() {
      const { start_time, end_time, username, phone, } = this.filterInfo;
      const res = await this.$api.risk.getRiskList(start_time.unix(), end_time.unix(), username, phone, {});

      this.setRiskList(res.data);
    }

    @action 
    setRiskList(d) {
      this.riskList = d;
    }

    @computed
    get getRiskList() {
      return this.riskList;
    }

    @action
    setInit() {
      this.riskList = [];
      this.filterInfo = {
        start_time:null,
        end_time:null,
        username:"",
        phone:"",
      };
    }

}


export default new RiskStore();