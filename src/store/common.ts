import { action, observable, computed } from "mobx";
import BaseStore from "store/base";
class CommonStore extends BaseStore {
  @observable
  paginationConfig = {
    defaultCurrent: 1,
    showSizeChanger: true,
    showQuickJumper: true,
    defaultPageSize: 10,
    showTotal: (total, range) => `共 ${total} 条`,
    pageSizeOptions: ["10", "20", "30", "40", "50"],
  };

  @observable
  userInfo: any = {};

  @observable
  menu: any[] | null = null;
  @action
  setMenu = (menu: any) => {
    this.menu = menu;
  }

  @observable
  permissions: any[] | null = null;

  @action
  setPermissions = (permissions: string[]) => {
    this.permissions = permissions;
  }
  @computed
  get permissionMap() {
    // 映射 permission array 成 permission hashmap
    return this.permissions.reduce((obj, permission, idx) => {
      obj[permission] = true;
      return obj;
    }, {});
  }
  // @computed
  // get permissionRoutes() {
  //   // console.log('PERMISSION_TO_ROUTE :>> ', PERMISSION_TO_ROUTE);
  //   // 映射 permission 成允許顯示的 route hashmap
  //   return this.permissions.reduce((obj, permission, idx) => {
  //     const route = PERMISSION_TO_ROUTE[permission];
  //     if (route) obj[route] = true;
  //     return obj;
  //   }, {});
  // }
  @action
  getUserInfo = async params => {
    const token = "";
    if (token) {
      return true;
    } else {
      return false;
    }
  };
}

export default new CommonStore();
