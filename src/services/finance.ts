import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getDepositList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/deposit", config);

const getCurrentDeposit = (id: string, config): Promise<any> =>
  API.get(`/broker/deposit/${id}`, config);

const createDeposit = (config): Promise<any> =>
  API.post(`/broker/deposit`, config);

const updateDeposit = (id: string, config): Promise<any> =>
  API.patch(`/broker/deposit/${id}`, config);

const deleteDeposit = (id: string, config: AxiosRequestConfig): Promise<any> =>
  API.delete(`/broker/deposit/${id}`, config);

const getWithdrawList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/withdraw", config);

const getCurrentWithdraw = (id: string, config): Promise<any> =>
  API.get(`/broker/withdraw/${id}`, config);

const createWithdraw = (config): Promise<any> =>
  API.post(`/broker/withdraw`, config);

const updateWithdraw = (id: string, config): Promise<any> =>
  API.patch(`/broker/withdraw/${id}`, config);

const deleteWithdraw = (id: string, config: AxiosRequestConfig): Promise<any> =>
  API.delete(`/broker/withdraw/${id}`, config);

const getPaymentList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/payment", config);

const getCurrentPayment = (id: string, config): Promise<any> =>
  API.get(`/broker/payment/${id}`, config);

const createPayment = (config): Promise<any> =>
  API.post(`/broker/payment`, config);

const updatePayment = (id: string, config): Promise<any> =>
  API.patch(`/broker/payment/${id}`, config);

const deletePayment = (id: string, config: AxiosRequestConfig): Promise<any> =>
  API.delete(`/broker/payment/${id}`, config);

const getRateList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/exchangerate", config);

const getCurrentRate = (id: string, config): Promise<any> =>
  API.get(`/broker/exchangerate/${id}`, config);

const createRate = (config): Promise<any> =>
  API.post(`/broker/exchangerate`, config);

const updateRate = (id: string, config): Promise<any> =>
  API.patch(`/broker/exchangerate/${id}`, config);

const deleteRate = (id: string, config: AxiosRequestConfig): Promise<any> =>
  API.delete(`/broker/exchangerate/${id}`, config);

export default {
  getDepositList,
  getCurrentDeposit,
  createDeposit,
  updateDeposit,
  deleteDeposit,
  getWithdrawList,
  getCurrentWithdraw,
  createWithdraw,
  updateWithdraw,
  deleteWithdraw,
  getPaymentList,
  getCurrentPayment,
  createPayment,
  updatePayment,
  deletePayment,
  getRateList,
  getCurrentRate,
  createRate,
  updateRate,
  deleteRate,
};
