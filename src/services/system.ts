import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getBrokerDealerList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/broker_dealer", config);

const updateBrokerDealer = (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => API.patch(`/broker/broker_dealer/${id}`, config);

const getBrokerConfigList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/config", config);

const updateBrokerConfig = (config: any): Promise<any> =>
  API.post("/broker/config", config, {
    headers: { "Content-Type": "application/json", },
  });

// const deleteVerify = (id: string, config: AxiosRequestConfig): Promise<any> =>
//   API.delete(`/broker/accountverify/${id}`, config);

export default {
  getBrokerDealerList,
  updateBrokerDealer,
  getBrokerConfigList,
  updateBrokerConfig,
};
