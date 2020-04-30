import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getOpenOrderList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/in-transaction-order", config);

const getOpenOrderDetail = (order_number: string): Promise<any> =>
  API.get(`/broker/in-transaction-order/${order_number}`);

const getCloseOrderList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/finish-order", config);

const getCloseOrderDetail = (order_number: string): Promise<any> =>
  API.get(`/broker/finish-order/${order_number}`);

const getOrderFormula = (order_number: string, config: AxiosRequestConfig): Promise<any> =>
  API.get(`/broker/order/${order_number}/transaction`, config);

export default {
  getOpenOrderList,
  getOpenOrderDetail,
  getCloseOrderList,
  getCloseOrderDetail,
  getOrderFormula,
};
