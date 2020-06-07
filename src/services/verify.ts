import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getVerifyList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/accountverify", config);

const updateVerify = (id: string, config: AxiosRequestConfig): Promise<any> =>
  API.patch(`/broker/accountverify/${id}`, config);

const deleteVerify = (id: string, config: AxiosRequestConfig): Promise<any> =>
  API.delete(`/broker/accountverify/${id}`, config);

const getWithdrawApplyList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/withdrawapply", config);

const updateWithdrawApply = (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => API.patch(`/broker/withdrawapply/${id}`, config);

const deleteWithdrawApply = (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => API.delete(`/broker/withdrawapply/${id}`, config);

const getWithdrawcommissionList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/withdrawcommission", config);

const updateWithdrawCommission = (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => API.patch(`/broker/withdrawcommission/${id}`, config);

const getAgentVerifyList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/agentverify", config);

const updateAgentVerify = (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => API.patch(`/broker/agentverify/${id}`, config);

const deleteAgentVerify = (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => API.delete(`/broker/agentverify/${id}`, config);
export default {
  getVerifyList,
  updateVerify,
  deleteVerify,
  getWithdrawApplyList,
  updateWithdrawApply,
  deleteWithdrawApply,
  getWithdrawcommissionList,
  updateWithdrawCommission,
  getAgentVerifyList,
  updateAgentVerify,
  deleteAgentVerify,
};
