import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

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

const getSMSRecordList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/sms_record", config);

// const deleteVerify = (id: string, config: AxiosRequestConfig): Promise<any> =>
//   API.delete(`/broker/accountverify/${id}`, config);

export default {
  getSMSChannelList,
  addSMSChannel,
  updateSMSChannel,
  deleteSMSChannel,
  getSMSTemplateList,
  addSMSTemplate,
  updateSMSTemplate,
  deleteSMSTemplate,
  getSMSRecordList,
};
