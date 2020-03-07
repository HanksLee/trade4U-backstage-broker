import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getGroupList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/group", config);

const createGroup = (config) => API.post('/broker/group', config);

const updateGroup = (id: string, config): Promise<any> =>
  API.patch(`/broker/group/${id}`, config);

const deleteGroup = (id: string): Promise<any> =>
  API.delete(`/broker/group/${id}`);

const getGroupDetail = (id: string): Promise<any> =>
  API.get(`/broker/group/${id}`);

const getGroupSymbolTypeList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/group_symbol_type", config);

const createGroupSymbolType = (config) => API.post('/broker/group_symbol_type', config);

const updateGroupSymbolType = (id: string, config): Promise<any> =>
  API.patch(`/broker/group_symbol_type/${id}`, config);

const deleteGroupSymbolType = (id: string): Promise<any> =>
  API.delete(`/broker/group_symbol_type/${id}`);

export default {
  getGroupList,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupDetail,
  getGroupSymbolTypeList,
  createGroupSymbolType,
  updateGroupSymbolType,
  deleteGroupSymbolType,
};
