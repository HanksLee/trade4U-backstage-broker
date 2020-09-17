import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getSubscriptionList = (payload: AxiosRequestConfig): Promise<any> => {
  return API.get("/broker/newstock", payload);
};
const getLotteryList = (payload: AxiosRequestConfig): Promise<any> => {
  return API.get("broker/newstock-participate", payload);
};
const updateLotteryList = (id, payload: AxiosRequestConfig): Promise<any> => {
  return API.patch(`broker/newstock-participate/${id}`, payload);
};

export default { getSubscriptionList, getLotteryList, updateLotteryList, };
