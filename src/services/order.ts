import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getOpenOrderList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/in-transaction-order", config);

const getOpenOrderDetail = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/in-transaction-order", config);

const getCloseOrderList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/finish-order", config);

const getCloseOrderDetail = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/finish-order", config);

const getOrderFormula = (order_number: string): Promise<any> =>
  API.get(`/broker/order/${order_number}/transaction`);

export default {
  getOpenOrderList,
  getOpenOrderDetail,
  getCloseOrderList,
  getCloseOrderDetail,
  getOrderFormula,
};
