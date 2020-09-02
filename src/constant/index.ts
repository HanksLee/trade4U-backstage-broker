import utils from "../utils";
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
    id: 6,
    name: "周日",
  },
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
  }
];

// 主要用于控制菜单的显示隐藏，key 为路由地址，value 为主后台配置的菜单权限
export const ROUTE_TO_PERMISSION = {
  "/dashboard/risk": "view_risk_control_sls",
  "/dashboard/currency_history": "view_platform_currency_history",
  "/dashboard/role": "VIEW_ROLE_PAGE",
  "/dashboard/order": "view_order",
  "/dashboard/order/open": "view_in_transaction_order",
  "/dashboard/order/close": "view_finish_order",
  "/dashboard/manager": "view_manager",
  "/dashboard/account": "view_account",
  "/dashboard/account/account": "VIEW_ACCOUNT_LIST_PAGE",
  "/dashboard/account/transaction": "view_transaction",
  "/dashboard/finance": "VIEW_FINANCE_PAGE",
  "/dashboard/finance/deposit": "VIEW_FINANCE_DEPOSIT_PAGE",
  "/dashboard/finance/withdraw": "VIEW_FINANCE_WITHDRAW_PAGE",
  "/dashboard/finance/payment": "VIEW_FINANCE_PAYMENT_PAGE",
  "/dashboard/finance/rate": "VIEW_FINANCE_RATE_PAGE",

  "/dashboard/exchange": "VIEW_PRODUCT_PAGE",
  "/dashboard/exchange/product": "view_broker_symbol",
  "/dashboard/exchange/genre": "view_broker_symbol_type",

  "/dashboard/group": "view_group",
  "/dashboard/agency": "VIEW_AGENCY_PAGE",
  "/dashboard/agency/log": "VIEW_AGENCY_LOG_PAGE",
  "/dashboard/agency/info": "VIEW_AGENCY_INFO_PAGE",
  "/dashboard/agency/agent": "VIEW_AGENCY_AGENT_PAGE",
  "/dashboard/verify": "view_verify",
  "/dashboard/verify/openaccount": "view_account_verify",
  "/dashboard/verify/commission": "view_withdraw_commission",
  "/dashboard/verify/withdrawapply": "view_withdraw_apply",
  "/dashboard/verify/agentverify": "view_agent_verify",
  "/dashboard/system": "view_system",
  "/dashboard/system/baseinfo": "view_broker_dealer",
  "/dashboard/system/params": "view_broker_config",
  "/dashboard/message": "view_message_page",
  "/dashboard/message/type": "view_message_type",
  "/dashboard/message/content": "view_message",
  "/dashboard/report": "VIEW_REPORT_PAGE",
  "/dashboard/report/account": "view_account_report",
  "/dashboard/report/agency": "view_agent_report",
  "/dashboard/sms": "view_sms",
  "/dashboard/sms/smschannel": "view_sms_channel",
  "/dashboard/sms/smstemplate": "view_sms_template",
  "/dashboard/sms/smsrecord": "view_sms_record",
};

// 交换 ROUTE_TO_PERMISSION 键值，key 为权限名，value 为路由名
export const PERMISSION_TO_ROUTE = utils.swapObjectKeyValue(ROUTE_TO_PERMISSION);




// export const PAGE_ROUTES = [
//   {
//     title: "财务管理",
//     path: "/dashboard/finance",
//     children: [
//       {
//         title: "入金管理",
//         path: "/dashboard/finance/deposit",
//       },
//       {
//         title: "出金管理",
//         path: "/dashboard/finance/withdraw",
//       },
//       {
//         title: "支付方式",
//         path: "/dashboard/finance/payment",
//       },
//       {
//         title: "出入金汇率表",
//         path: "/dashboard/finance/rate",
//       }
//     ],
//   }
// ];
