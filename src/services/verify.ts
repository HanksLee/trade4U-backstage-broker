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
export default {
  getVerifyList,
  updateVerify,
  deleteVerify,
  getWithdrawApplyList,
};
