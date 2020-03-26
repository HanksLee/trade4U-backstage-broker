import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getMessageTypeList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/messagetype", config);

const addMessageType = (config: AxiosRequestConfig): Promise<any> =>
  API.post("/broker/messagetype", config);

const updateMessageType = (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => API.patch(`/broker/messagetype/${id}`, config);

const deleteMessageType = (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => API.delete(`/broker/messagetype/${id}`, config);

const getMessageContentList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/message", config);

const addMessageContent = (config: AxiosRequestConfig): Promise<any> =>
  API.post("/broker/message", config);

const updateMessageContent = (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => API.patch(`/broker/message/${id}`, config);

const deleteMessageContent = (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => API.delete(`/broker/message/${id}`, config);

export default {
  getMessageTypeList,
  addMessageType,
  updateMessageType,
  deleteMessageType,
  getMessageContentList,
  addMessageContent,
  updateMessageContent,
  deleteMessageContent,
};
