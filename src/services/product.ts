import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

// 交易产品分类设置 api
// 回传的 id 是券商后台商品分类 key, symbol_type 是主后台商品分类 key, code 是商品分类名

const getGenreList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/symbol_type", config);

const getCurrentGenre = (id, config): Promise<any> =>
  API.get(`/broker/symbol_type/${id}`, config);
const updateGenre = (id, config): Promise<any> =>
  API.patch(`/broker/symbol_type/${id}`, config);

// 交易产品设置 api
const getProductList = async (config: AxiosRequestConfig): Promise<any> => {
  const res = await API.get("/broker/symbol", config);
  const results = res.data.results;

  return res;
};

const getCurrentProduct = (id: string, config): Promise<any> =>
  API.get(`/broker/symbol/${id}`, config);

const createProduct = (config): Promise<any> =>
  API.post(`/broker/symbol`, config);

const updateProduct = (id: string, config): Promise<any> =>
  API.patch(`/broker/symbol/${id}`, config);

const deleteProduct = (id: string, config: AxiosRequestConfig): Promise<any> =>
  API.delete(`/broker/symbol/${id}`, config);

const getHistoryList = (
  broker_symbol_id: string,
  startDate: number,
  endDate: number,
  config: AxiosRequestConfig
): Promise<any> =>
  API.get(
    `/broker/symbol/${broker_symbol_id}/history?start_time=${startDate}&end_time=${endDate}`,
    config
  );

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

// 利润规则
const getRuleList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/profit_rule", config);

export default {
  getGenreList,
  getCurrentGenre,
  updateGenre,
  getProductList,
  getCurrentProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getHistoryList,
  getTransactionModeOptions,
  getBgColorOptions,
  getProfitOptioins,
  getMarginCurrencyOptions,
  getOrderModeOptions,
  getRuleList,
};
