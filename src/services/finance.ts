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

export default {
  getDepositList,
  getCurrentDeposit,
  createDeposit,
  updateDeposit,
  deleteDeposit,
};
