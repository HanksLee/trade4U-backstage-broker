// 主要用于控制菜单的显示隐藏，key 为路由地址，value 为主后台配置的菜单权限
export { ROUTE_TO_PERMISSION, PERMISSION_TO_ROUTE } from "./routePermission";

export const SHARE_DATA = {
  title: "",
  desc: "",
  link: "",
  imgUrl: "",
};

export const FORMAT_TIME = "YYYY.MM.DD HH:mm:ss";

export const DEPOSIT_OPTIONS = [
  {
    id: 0,
    name: "未支付",
  },
  {
    id: 1,
    name: "已支付",
  }
];

export const THREE_DAY_OPTIONS = [
  {
    id: 0,
    name: "周日",
  },
  {
    id: 1,
    name: "周一",
  },
  {
    id: 2,
    name: "周二",
  },
  {
    id: 3,
    name: "周三",
  },
  {
    id: 4,
    name: "周四",
  },
  {
    id: 5,
    name: "周五",
  },
  {
    id: 6,
    name: "周六",
  }
];
export const WEEKLY_ORDER = [0, 1, 2, 3, 4, 5, 6];
export const DAYS_OF_WEEK = {
  0: { "zh-cn": "周日", "en-us": "Sunday", },
  1: { "zh-cn": "周一", "en-us": "Monday", },
  2: { "zh-cn": "周二", "en-us": "Tuesday", },
  3: { "zh-cn": "周三", "en-us": "Wednesday", },
  4: { "zh-cn": "周四", "en-us": "Thursday", },
  5: { "zh-cn": "周五", "en-us": "Friday", },
  6: { "zh-cn": "周六", "en-us": "Saturday", },
};

// 市场品种类型
export const MARKET_TYPE = {
  HK: { name: "港股", },
  SZ: { name: "深圳", },
  SH: { name: "上证", },
};

export const SYMBOL_TYPE = {
  HK: "港股",
  ASHARES: "A股",
  MT: "外汇",
  hk: "港股",
  a_shares: "A股",
};

// 可用融资比例
export const LOAN_OPTIONS = {
  0: "不融资",
  10: "10%",
  20: "20%",
  30: "30%",
  40: "40%",
  50: "50%",
  60: "60%",
  70: "70%",
  80: "80%",
  90: "90%",
};
// 新股申购活动状态
export const NEW_STOCK_SUBSCRIPTION_STATUS = {
  1: "未开始",
  2: "进行中",
  3: "已截止",
  4: "已公布",
};
