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

export const WeeklyOrder = [
  0,
  1,
  2,
  3,
  4,
  5,
  6
];

export const WeeklyMap = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

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

// 主要用于控制菜单的显示隐藏，key 为路由地址，value 为主后台配置的菜单权限
export const PAGE_PERMISSION_MAP = {
  "/dashboard/role": "VIEW_ROLE_PAGE",
  "/dashboard/order": "VIEW_ORDER_PAGE",
  "/dashboard/order/position": "VIEW_ORDER_POSITION_PAGE",
  "/dashboard/manager": "VIEW_MANAGER_PAGE",
  "/dashboard/account": "VIEW_ACCOUNT_PAGE",
  "/dashboard/account/account": "VIEW_ACCOUNT_LIST_PAGE",
  "/dashboard/account/transaction": "VIEW_ACCOUNT_TRANSACTION_PAGE",
  "/dashboard/finance": "VIEW_FINANCE_PAGE",
  "/dashboard/finance/deposit": "VIEW_FINANCE_DEPOSIT_PAGE",
  "/dashboard/finance/withdraw": "VIEW_FINANCE_WITHDRAW_PAGE",
  "/dashboard/finance/payment": "VIEW_FINANCE_PAYMENT_PAGE",
  "/dashboard/finance/rate": "VIEW_FINANCE_RATE_PAGE",
  "/dashboard/product": "VIEW_PRODUCT_PAGE",
  "/dashboard/group": "VIEW_GROUP_PAGE",
  "/dashboard/agency": "VIEW_AGENCY_PAGE",
  "/dashboard/agency/log": "VIEW_AGENCY_LOG_PAGE",
  "/dashboard/agency/info": "VIEW_AGENCY_INFO_PAGE",
  "/dashboard/agency/agent": "VIEW_AGENCY_AGENT_PAGE",
  "/dashboard/verify": "VIEW_VERIFY_PAGE",
  "/dashboard/verify/openaccount": "VIEW_VERIFY_OPEN_ACCOUNT_PAGE",
  "/dashboard/verify/commission": "VIEW_VERIFY_COMMISSION_PAGE",
  "/dashboard/verify/withdrawapply": "VIEW_VERIFY_WITHDRAW_APPLY_PAGE",
  "/dashboard/verify/agentverify": "VIEW_VERIFY_AGENT_VERIFY_PAGE",
  "/dashboard/system": "VIEW_SYSTEM_PAGE",
  "/dashboard/system/baseinfo": "VIEW_SYSTEM_BASE_INFO_PAGE",
  "/dashboard/system/params": "VIEW_SYSTEM_PARAMS_PAGE",
  "/dashboard/message": "VIEW_MESSAGE_PAGE",
  "/dashboard/message/type": "VIEW_MESSAGE_TYPE_PAGE",
  "/dashboard/message/content": "VIEW_MESSAGE_CONTENT_PAGE",
};

export const PAGE_ROUTES = [
  {
    title: "财务管理",
    path: "/dashboard/finance",
    children: [
      {
        title: "入金管理",
        path: "/dashboard/finance/deposit",
      },
      {
        title: "出金管理",
        path: "/dashboard/finance/withdraw",
      },
      {
        title: "支付方式",
        path: "/dashboard/finance/payment",
      },
      {
        title: "出入金汇率表",
        path: "/dashboard/finance/rate",
      }
    ],
  }
];
