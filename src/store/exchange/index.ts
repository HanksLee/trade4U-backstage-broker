// import { action, observable, computed } from "mobx";
// import BaseStore from "store/base";
// import utils from "utils";
// import moment from 'moment';
// import { WeeklyOrder } from 'constant';

// class ExchangeStore extends BaseStore {
//   @observable
//   genreList = [
//     {
//       id: 1,
//       name: "SRE",
//     }
//   ];
//   @observable
//   genreListMeta = {};
//   @action
//   getGenreList = async config => {
//     const res = await this.$api.exchange.getGenreList(config);
//     this.setGenreList(res.data);
//   };
//   @action
//   setGenreList = data => {
//     this.genreList = data.results;
//     this.genreListMeta = {
//       total: data.count,
//     };
//   };
//   @observable
//   currentGenre: any = {};

//   @computed
//   get currentShowGenre() {
//     const obj: any = {};

//     return {
//       ...this.currentGenre,
//       ...obj,
//     };
//   }
//   @action
//   setCurrentGenre = (genre, overwrite = true, store = true) => {
//     if (overwrite) {
//       this.currentGenre = genre;
//     } else {
//       this.currentGenre = {
//         ...this.currentGenre,
//         ...genre,
//       };
//     }

//     if (store) {
//       utils.setLStorage("currentExchangeGenre", this.currentGenre);
//     }
//   };
//   @observable
//   ruleList = [];
//   @observable
//   ruleListMeta = {};
//   @action
//   getRuleList = async config => {
//     const res = await this.$api.exchange.getRuleList(config);
//     this.setRuleList(res.data);
//   };
//   @action
//   setRuleList = data => {
//     this.ruleList = data.results;
//     this.ruleListMeta = {
//       total: data.count,
//       // offset: data.offset,
//       // limit: data.limit,
//     };
//   };
//   @observable
//   currentRule: any = {};

//   @computed
//   get currentShowRule() {
//     const obj: any = {};

//     return {
//       ...this.currentRule,
//       ...obj,
//     };
//   }
//   @action
//   setCurrentRule = (rule, overwrite = true, store = true) => {
//     if (overwrite) {
//       this.currentRule = rule;
//     } else {
//       this.currentRule = {
//         ...this.currentRule,
//         ...rule,
//       };
//     }

//     if (store) {
//       utils.setLStorage("currentExchangeRule", this.currentRule);
//     }
//   };
//   @observable
//   filterProduct = {
//     page_size: 10,
//     page: 1,
//   };
//   @action
//   setFilterProduct = (filter, overwrite = false) => {
//     if (overwrite) {
//       this.filterProduct = filter;
//     } else {
//       this.filterProduct = {
//         ...this.filterProduct,
//         ...filter,
//       };
//     }
//   };
//   @observable
//   productList = [];
//   @observable
//   productListMeta = {};
//   @action
//   getProductList = async config => {
//     const res = await this.$api.exchange.getProductList(config);
//     this.setProductList(res.data);
//   };
//   @action
//   setProductList = data => {
//     this.productList = data.results;
//     this.productListMeta = {
//       total: data.count,
//     };
//   };
//   @observable
//   currentProduct: any = {};

//   @computed
//   get currentShowProduct() {
//     const obj: any = {

//     };

//     if (!utils.isEmpty(this.currentProduct.trading_times)) {
//       obj.trading_times = WeeklyOrder.map(item => {
//         const matched = JSON.parse(this.currentProduct.trading_times)[item];

//         if (matched) {
//           return {
//             day: item,
//             trades: matched.trades.map(time => time && moment(time * 1000) || null),
//           };
//         }

//         return {
//           day: item,
//           trades: [],
//         };
//       });
//     } else {
//       obj.trading_times = WeeklyOrder.map(item => {
//         return {
//           day: item,
//           trades: [],
//         };
//       });
//     }

//     return {
//       ...this.currentProduct,
//       ...obj,
//     };
//   }
//   @action
//   getCurrentProduct = async (id, config = {}) => {
//     const res = await this.$api.exchange.getCurrentProduct(id, config);
//     this.setCurrentProduct(res.data, true, false);
//   };
//   @action
//   setCurrentProduct = (rule, overwrite = true, store = true) => {
//     if (overwrite) {
//       this.currentProduct = rule;
//     } else {
//       this.currentProduct = {
//         ...this.currentProduct,
//         ...rule,
//       };
//     }

//     if (store) {
//       utils.setLStorage("currentExchangeProduct", this.currentProduct);
//     }
//   };
// }

// export default new ExchangeStore();
