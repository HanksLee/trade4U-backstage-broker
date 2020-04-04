import { action, observable } from "mobx";
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
  sidebar: any[] | null = null;
  @action
  setSidebar = (sidebar: any) => {
    this.sidebar = sidebar;
  }

  @observable
  permissions: any[] | null = null;
  @action
  setPermissions = (permissions: string[]) => {
    this.permissions = permissions;
  }

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
