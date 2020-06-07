import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getBrokerDealerList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/broker_dealer", config);

const updateBrokerDealer = (config: AxiosRequestConfig): Promise<any> =>
  API.patch("/broker/broker_dealer", config);

const getBrokerConfigList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/config", config);

const updateBrokerConfig = (config: any): Promise<any> =>
  API.post("/broker/config", config, {
    headers: { "Content-Type": "application/json", },
  });

const getSMSChannelList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/sms_channel", config);

const addSMSChannel = (config: AxiosRequestConfig): Promise<any> =>
  API.post("/broker/sms_channel", config);

const updateSMSChannel = (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => API.patch(`/broker/sms_channel/${id}`, config);

const deleteSMSChannel = (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => API.delete(`/broker/sms_channel/${id}`, config);

const getSMSTemplateList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/sms_template", config);

const addSMSTemplate = (config: AxiosRequestConfig): Promise<any> =>
  API.post("/broker/sms_template", config);

const updateSMSTemplate = (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => API.patch(`/broker/sms_template/${id}`, config);

const deleteSMSTemplate = (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => API.delete(`/broker/sms_template/${id}`, config);

const getSMSRecordlList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/sms_record", config);

// const deleteVerify = (id: string, config: AxiosRequestConfig): Promise<any> =>
//   API.delete(`/broker/accountverify/${id}`, config);

export default {
  getBrokerDealerList,
  updateBrokerDealer,
  getBrokerConfigList,
  updateBrokerConfig,
  getSMSChannelList,
  addSMSChannel,
  updateSMSChannel,
  deleteSMSChannel,
  getSMSTemplateList,
  addSMSTemplate,
  updateSMSTemplate,
  deleteSMSTemplate,
  getSMSRecordlList,
};
