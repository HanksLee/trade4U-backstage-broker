import * as React from "react";
import loadable from "@loadable/component";

/**
 * @description 按需加载页面级别组件
 */
const routes: any[] = [
  {
    component: loadable(() => import(/* webpackChunkName: "manager-page" */ './pages/Manager')),
  },
  {
    component: loadable(() => import(/* webpackChunkName: "role-page" */ './pages/Role')),
  },
  {
    component: loadable(() => import(/* webpackChunkName: "account-page" */ './pages/Account/AccountList')),
  },
  {
    component: loadable(() => import(/* webpackChunkName: "transaction-page" */ './pages/Account/TransactionList')),
  },
  {
    component: loadable(() => import(/* webpackChunkName: "Deposit" */ './pages/Finance/Deposit/DepositList')),
  },
  {
    component: loadable(() => import(/* webpackChunkName: "Withdraw" */ './pages/Finance/Withdraw/WithdrawList')),
  },
  {
    component: loadable(() => import(/* webpackChunkName: "Withdraw" */ './pages/Finance/Payment/PaymentList')),
  },
  {
    component: loadable(() => import(/* webpackChunkName: "finance-rate" */ './pages/Finance/Rate/RateList')),
  }
];

export default function AppRouter(props) {
  return (
    <>
      {routes.map((route, index) => (
        <route.component key={index} />
      ))}
    </>
  );
}
