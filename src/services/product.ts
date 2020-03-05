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
  API.get("/broker/symbol_type", config);

const getTransactionModeOptions = (config) => API.get('/constant/system_symbol_transaction_mode_choices', config);

const getBgColorOptions = (config) => API.get('/constant/background_color_choices', config);

const getProfitOptioins = (config) => API.get('/constant/system_profit_currency_choices', config);

const getMarginCurrencyOptions = (config) => API.get('/constant/system_margin_currency_choices', config);

const getOrderModeOptions = (config) => API.get('/constant/system_symbol_order_mode_choices', config);

export default {
  getProductList,
  getCurrentProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getGenreList,
  getTransactionModeOptions,
  getBgColorOptions,
  getProfitOptioins,
  getMarginCurrencyOptions,
  getOrderModeOptions,
};
