import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getDepositList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/system/symbol", config);

const getCurrentDeposit = (id: string, config): Promise<any> =>
  API.get(`/system/symbol/${id}`, config);

const createDeposit = (config): Promise<any> =>
  API.post(`/system/symbol`, config);

const updateDeposit = (id: string, config): Promise<any> =>
  API.patch(`/system/symbol/${id}`, config);

const deleteDeposit = (id: string, config: AxiosRequestConfig): Promise<any> =>
  API.delete(`/system/symbol/${id}`, config);

const getWithdrawList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/system/symbol", config);

const getCurrentWithdraw = (id: string, config): Promise<any> =>
  API.get(`/system/symbol/${id}`, config);

const createWithdraw = (config): Promise<any> =>
  API.post(`/system/symbol`, config);

const updateWithdraw = (id: string, config): Promise<any> =>
  API.patch(`/system/symbol/${id}`, config);

const deleteWithdraw = (id: string, config: AxiosRequestConfig): Promise<any> =>
  API.delete(`/system/symbol/${id}`, config);

const getPaymentList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/system/symbol", config);

const getCurrentPayment = (id: string, config): Promise<any> =>
  API.get(`/system/symbol/${id}`, config);

const createPayment = (config): Promise<any> =>
  API.post(`/system/symbol`, config);

const updatePayment = (id: string, config): Promise<any> =>
  API.patch(`/system/symbol/${id}`, config);

const deletePayment = (id: string, config: AxiosRequestConfig): Promise<any> =>
  API.delete(`/system/symbol/${id}`, config);

  const getRateList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/system/symbol", config);

const getCurrentRate = (id: string, config): Promise<any> =>
  API.get(`/system/symbol/${id}`, config);

const createRate = (config): Promise<any> =>
  API.post(`/system/symbol`, config);

const updateRate = (id: string, config): Promise<any> =>
  API.patch(`/system/symbol/${id}`, config);

const deleteRate = (id: string, config: AxiosRequestConfig): Promise<any> =>
  API.delete(`/system/symbol/${id}`, config);

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
