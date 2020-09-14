import utils from "../utils";

// 用于控制菜单的显示隐藏，key 为路由地址，value 为主后台配置的菜单权限
// TODO: 统一权限名规则
export const ROUTE_TO_PERMISSION = {
  "/dashboard/risk": "view_risk_control_sls",
  "/dashboard/currency_history": "view_platform_currency_history",
  "/dashboard/role": "VIEW_ROLE_PAGE",
  "/dashboard/group": "view_group",
  "/dashboard/manager": "view_manager",
  //
  "/dashboard/order": "view_order",
  "/dashboard/order/open": "view_in_transaction_order",
  "/dashboard/order/close": "view_finish_order",

  //
  "/dashboard/account": "view_account",
  "/dashboard/account/account": "VIEW_ACCOUNT_LIST_PAGE",
  "/dashboard/account/transaction": "view_transaction",
  //
  "/dashboard/finance": "VIEW_FINANCE_PAGE",
  "/dashboard/finance/deposit": "VIEW_FINANCE_DEPOSIT_PAGE",
  "/dashboard/finance/withdraw": "VIEW_FINANCE_WITHDRAW_PAGE",
  "/dashboard/finance/payment": "VIEW_FINANCE_PAYMENT_PAGE",
  "/dashboard/finance/rate": "VIEW_FINANCE_RATE_PAGE",
  // 交易品种管理
  "/dashboard/exchange": "VIEW_PRODUCT_PAGE",
  "/dashboard/exchange/product": "view_broker_symbol",
  "/dashboard/exchange/genre": "view_broker_symbol_type",
  //
  "/dashboard/agency": "VIEW_AGENCY_PAGE",
  "/dashboard/agency/log": "VIEW_AGENCY_LOG_PAGE",
  "/dashboard/agency/info": "VIEW_AGENCY_INFO_PAGE",
  "/dashboard/agency/agent": "VIEW_AGENCY_AGENT_PAGE",
  //
  "/dashboard/verify": "view_verify",
  "/dashboard/verify/openaccount": "view_account_verify",
  "/dashboard/verify/commission": "view_withdraw_commission",
  "/dashboard/verify/withdrawapply": "view_withdraw_apply",
  "/dashboard/verify/agentverify": "view_agent_verify",
  //
  "/dashboard/system": "view_system",
  "/dashboard/system/baseinfo": "view_broker_dealer",
  "/dashboard/system/params": "view_broker_config",
  //
  "/dashboard/message": "view_message_page",
  "/dashboard/message/type": "view_message_type",
  "/dashboard/message/content": "view_message",
  //
  "/dashboard/report": "VIEW_REPORT_PAGE",
  "/dashboard/report/account": "view_account_report",
  "/dashboard/report/agency": "view_agent_report",
  //
  "/dashboard/sms": "view_sms",
  "/dashboard/sms/smschannel": "view_sms_channel",
  "/dashboard/sms/smstemplate": "view_sms_template",
  "/dashboard/sms/smsrecord": "view_sms_record",
  // 新股申购
  "/dashboard/ipo": "VIEW_IPO_PAGE",
  "/dashboard/ipo/subscription": "VIEW_IPO_SUBSCRIPTION_PAGE",
  "/dashboard/ipo/lottery": "VIEW_IPO_LOTTERY_PAGE",
};

// 交换 ROUTE_TO_PERMISSION 键值，key 为权限名，value 为路由名
export const PERMISSION_TO_ROUTE = utils.swapObjectKeyValue(
  ROUTE_TO_PERMISSION
);
