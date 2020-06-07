import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getManagerList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/manager", config);

const addManager = (config: AxiosRequestConfig): Promise<any> =>
  API.post("/broker/manager", config);

const getManagerDetail = (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => API.get(`/broker/manager/${id}`, config);

const updateManager = (id: string, config: AxiosRequestConfig): Promise<any> =>
  API.patch(`/broker/manager/${id}`, config);

const deleteManager = (id: string, config: AxiosRequestConfig): Promise<any> =>
  API.delete(`/broker/manager/${id}`, config);

export default {
  getManagerList,
  addManager,
  getManagerDetail,
  updateManager,
  deleteManager,
};
