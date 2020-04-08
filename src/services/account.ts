import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getAccountList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/account", config);

const createAccount = (config) => API.post('/broker/account', config);

const updateAccount = (id: string, config): Promise<any> =>
  API.patch(`/broker/account/${id}`, config);

const deleteAccount = (id: string): Promise<any> =>
  API.delete(`/broker/account/${id}`);

const getAccountDetail = (id: string): Promise<any> =>
  API.get(`/broker/account/${id}`);

const resetAccountPassword = (id: string, config): Promise<any> =>
  API.put(`/broker/account/${id}/reset-pwd`, config);

const updateAccountBalance = (id: string, config): Promise<any> =>
  API.put(`/broker/account/${id}/change-balance`, config);

const transferAccountToAgent = (id: string, config): Promise<any> =>
  API.put(`/broker/account/${id}/migrate`, config);

const batchTransferAccountToGroup = (groupId: string, config): Promise<any> =>
  API.put(`/broker/account2group/${groupId}`, config);

const getAccountLoginLog = (id: string, config): Promise<any> =>
  API.get(`/broker/account/${id}/login-log`, config);

const getTransactionList = (config): Promise<any> =>
  API.get(`/broker/transaction`, config);

export default {
  getAccountList,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountDetail,
  resetAccountPassword,
  updateAccountBalance,
  transferAccountToAgent,
  batchTransferAccountToGroup,
  getAccountLoginLog,
  getTransactionList,
};
