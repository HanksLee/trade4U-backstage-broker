import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getLogList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/rebate-record", config);


const getInfoList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/agent-transaction", config);

const getAgentList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/agent", config);

const getCurrentAgent = (id: string, config): Promise<any> =>
  API.get(`/broker/agent/${id}`, config);

const createAgent = (config): Promise<any> =>
  API.post(`/broker/agent`, config);

const updateAgent = (id: string, config): Promise<any> =>
  API.patch(`/broker/agent/${id}`, config);

const deleteAgent = (id: string, config: AxiosRequestConfig): Promise<any> =>
  API.delete(`/broker/agent/${id}`, config);

const getAccountList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/agent", config);

const createAccount = (config) => API.post('/broker/agent', config);

const updateAccount = (id: string, config): Promise<any> =>
  API.patch(`/broker/agent/${id}`, config);

const deleteAccount = (id: string): Promise<any> =>
  API.delete(`/broker/agent/${id}`);

const getAccountDetail = (id: string): Promise<any> =>
  API.get(`/broker/agent/${id}`);

const resetAccountPassword = (id: string, config): Promise<any> =>
  API.put(`/broker/agent/${id}/reset-pwd`, config);

const updateAccountBalance = (id: string, config): Promise<any> =>
  API.put(`/broker/account/${id}/change-balance`, config);

const getAccountLoginLog = (id: string, config): Promise<any> =>
  API.get(`/broker/agent/${id}/login-log`, config);

const getTransactionList = (config): Promise<any> =>
  API.get(`/broker/transaction`, config);

const getJumpUrl = (id: number, config) => API.get(`/broker/agent/${id}/jump`);

const transferCustom = (group_id: number, config) => API.put(`/broker/agent2group/${group_id}`, config);

const transferAgent = (id, config) => API.put(`/broker/agent/${id}/migrate`, config);

const getRuleList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/profit_rule", config);

const getRebateSettings = (id, config) => API.get(`/broker/agent/${id}/commission-rule`, config);

const updateRebateSettings = (id, config) => API.patch(`/broker/agent/${id}/commission-rule`, config);



export default {
  getLogList,
  getInfoList,
  getAgentList,
  getCurrentAgent,
  createAgent,
  updateAgent,
  deleteAgent,
  getAccountList,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountDetail,
  resetAccountPassword,
  updateAccountBalance,
  getAccountLoginLog,
  getTransactionList,
  getJumpUrl,
  transferCustom,
  transferAgent,
  getRuleList,
  getRebateSettings,
  updateRebateSettings,
};
