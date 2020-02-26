export const SHARE_DATA = {
  title: "",
  desc: "",
  link: "",
  imgUrl: "",
};

export const FORMAT_TIME = 'YYYY.MM.DD HH:mm';

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

export const WeeklyOrder = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

// 主要用于控制菜单的显示隐藏
export const PAGE_PERMISSION_MAP = {
  '/dashboard/role': 'VIEW_ROLE_PAGE',
  '/dashboard/order/postion': 'VIEW_ORDER_POSITION_PAGE',
};
