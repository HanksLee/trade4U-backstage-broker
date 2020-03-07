export const SHARE_DATA = {
  title: "",
  desc: "",
  link: "",
  imgUrl: "",
};

export const FORMAT_TIME = 'YYYY.MM.DD HH:mm:ss';

export const UPLOAD_URL = "https://upyun.com";

export const marketOptions = [
  {
    id: 1,
    name: '上证',
  },
  {
    id: 2,
    name: '日经',
  },
  {
    id: 3,
    name: '纳斯达克',
  }
];

export const depositOptions = [
  {
    id: 0,
    name: '未支付',
  },
  {
    id: 1,
    name: '已支付',
  }
];

export const WeeklyOrder = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export const THREE_DAY_OPTIONS = [
  {
    id: 0,
    name: '周日',
  },
  {
    id: 1,
    name: '周一',
  },
  {
    id: 2,
    name: '周二',
  },
  {
    id: 3,
    name: '周三',
  },
  {
    id: 4,
    name: '周四',
  },
  {
    id: 5,
    name: '周五',
  },
  {
    id: 6,
    name: '周六',
  }
];

// 主要用于控制菜单的显示隐藏，key 为路由地址，value 为主后台配置的菜单权限
export const PAGE_PERMISSION_MAP = {
  '/dashboard/role': 'VIEW_ROLE_PAGE',
  '/dashboard/order': 'VIEW_ORDER_PAGE',
  '/dashboard/order/position': 'VIEW_ORDER_POSITION_PAGE',
  '/dashboard/manager': 'VIEW_MANAGER_PAGE',
  '/dashboard/account': 'VIEW_ACCOUNT_PAGE',
  '/dashboard/account/account': 'VIEW_ACCOUNT_LIST_PAGE',
  '/dashboard/account/transaction': 'VIEW_ACCOUNT_TRANSACTION_PAGE',
  '/dashboard/finance': 'VIEW_FINANCE_PAGE',
  '/dashboard/finance/deposit': 'VIEW_FINANCE_DEPOSIT_PAGE',
  '/dashboard/finance/withdraw': 'VIEW_FINANCE_WITHDRAW_PAGE',
  '/dashboard/finance/payment': 'VIEW_FINANCE_PAYMENT_PAGE',
  '/dashboard/finance/rate': 'VIEW_FINANCE_RATE_PAGE',
  '/dashboard/product': 'VIEW_PRODUCT_PAGE',
  '/dashboard/group': 'VIEW_GROUP_PAGE',
};

export const PAGE_ROUTES = [
  {
    title: '财务管理',
    path: '/dashboard/finance',
    children: [
      {
        title: '入金管理',
        path: '/dashboard/finance/deposit',
      },
      {
        title: '出金管理',
        path: '/dashboard/finance/withdraw',
      },
      {
        title: '支付方式',
        path: '/dashboard/finance/payment',
      },
      {
        title: '出入金汇率表',
        path: '/dashboard/finance/rate',
      }
    ],
  }
];
