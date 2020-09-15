import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getSubscriptionList = (
  config: AxiosRequestConfig
): Promise<any> => {
  return API.get("/broker/newstock", config);
};
const getLotteryList = (config: AxiosRequestConfig): Promise<any> => {
  return API.get("broker/newstockparticipant", config);
};

export default { getSubscriptionList, getLotteryList, };
