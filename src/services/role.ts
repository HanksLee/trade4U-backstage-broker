import { moonAPI as API } from "utils/request";

// 获取用户可见菜单和权限数据
const getMenus = (config): Promise<any> =>
  API.get('/broker/see-menu', config);

const getRoleList = (config): Promise<any> =>
  API.get("/broker/role", config);

const getRoleDetail = (id: string): Promise<any> =>
  API.get(`/broker/role/${id}`);

const createRole = (config) => API.post('/broker/role', config);

const updateRole = (id: string, config): Promise<any> =>
  API.put(`/broker/role/${id}`, config);

const deleteRole = (id: string): Promise<any> =>
  API.delete(`/broker/role/${id}`);

// 获取所有菜单和权限数据
const getRoleMenuList = (config): Promise<any> =>
  API.get("/system/role-menu", config);

const updateRolePermission = (config): Promise<any> =>
  API.post(`/system/role-menu`, config);

export default {
  getMenus,
  getRoleList,
  getRoleDetail,
  createRole,
  updateRole,
  deleteRole,
  getRoleMenuList,
  updateRolePermission,
};