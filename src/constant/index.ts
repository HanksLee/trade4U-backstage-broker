// 主要用于控制菜单的显示隐藏，key 为路由地址，value 为主后台配置的菜单权限
export { ROUTE_TO_PERMISSION, PERMISSION_TO_ROUTE } from "./routePermission";

export const SHARE_DATA = {
  title: "",
  desc: "",
  link: "",
  imgUrl: "",
};

export const FORMAT_TIME = "YYYY.MM.DD HH:mm:ss";

export const UPLOAD_URL = "https://upyun.com";

export const marketOptions = [
  {
    id: 1,
    name: "上证",
  },
  {
    id: 2,
    name: "日经",
  },
  {
    id: 3,
    name: "纳斯达克",
  }
];

export const depositOptions = [
  {
    id: 0,
    name: "未支付",
  },
  {
    id: 1,
    name: "已支付",
  }
];

export const WeeklyOrder = [6, 0, 1, 2, 3, 4, 5];

export const WeeklyMap = {
  6: "Sunday",
  0: "Monday",
  1: "Tuesday",
  2: "Wednesday",
  3: "Thursday",
  4: "Friday",
  5: "Saturday",
};

export const THREE_DAY_OPTIONS = [
  {
    id: 0,
    name: "周一",
  },
  {
    id: 1,
    name: "周二",
  },
  {
    id: 2,
    name: "周三",
  },
  {
    id: 3,
    name: "周四",
  },
  {
    id: 4,
    name: "周五",
  },
  {
    id: 5,
    name: "周六",
  },
  {
    id: 6,
    name: "周日",
  }
];
