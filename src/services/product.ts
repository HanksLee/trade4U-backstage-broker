import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getProductList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/symbol", config);

const getCurrentProduct = (id: string, config): Promise<any> =>
  API.get(`/broker/symbol/${id}`, config);

const createProduct = (config): Promise<any> =>
  API.post(`/broker/symbol`, config);

const updateProduct = (id: string, config): Promise<any> =>
  API.patch(`/broker/symbol/${id}`, config);

const deleteProduct = (id: string, config: AxiosRequestConfig): Promise<any> =>
  API.delete(`/broker/symbol/${id}`, config);

const getGenreList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/symbol_type?status=1", config);

const getHistoryList = (broker_symbol_id: string, startDate: number, endDate: number, config: AxiosRequestConfig): Promise<any> =>
  API.get(`broker/symbol/${broker_symbol_id}/history?start_time=${startDate}&end_time=${endDate}`, config);

const getTransactionModeOptions = config =>
  API.get("/constant/system_symbol_transaction_mode_choices", config);

const getBgColorOptions = config =>
  API.get("/constant/background_color_choices", config);

const getProfitOptioins = config =>
  API.get("/constant/system_profit_currency_choices", config);

const getMarginCurrencyOptions = config =>
  API.get("/constant/system_margin_currency_choices", config);

const getOrderModeOptions = config =>
  API.get("/constant/system_symbol_order_mode_choices", config);

const getRuleList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/profit_rule", config);

export default {
  getProductList,
  getCurrentProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getGenreList,
  getHistoryList,
  getTransactionModeOptions,
  getBgColorOptions,
  getProfitOptioins,
  getMarginCurrencyOptions,
  getOrderModeOptions,
  getRuleList,
};
