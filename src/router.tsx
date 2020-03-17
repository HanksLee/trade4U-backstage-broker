import * as React from "react";
import loadable from "@loadable/component";

/**
 * @description 按需加载页面级别组件
 */
const routes: any[] = [
  {
    component: loadable(() =>
      import(/* webpackChunkName: "manager-page" */ "./pages/Manager")
    ),
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: "role-page" */ "./pages/Role")
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "account-page" */ "./pages/Account/AccountList"
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "transaction-page" */ "./pages/Account/TransactionList"
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "finance-deposit-page" */ "./pages/Finance/Deposit/DepositList"
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "finance-withdraw-page" */ "./pages/Finance/Withdraw/WithdrawList"
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "finance-payment-page" */ "./pages/Finance/Payment/PaymentList"
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "finance-rate-page" */ "./pages/Finance/Rate/RateList"
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "product-page" */ "./pages/Product/ProductList"
      )
    ),
  },
  // {
  //   component: loadable(() =>
  //     import(
  //       /* webpackChunkName: "verify-opne-account-page" */ "./pages/verify/OpenAccount"
  //     )
  //   )
  // },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "system-base-info-page" */ "./pages/System/SystemBaseInfo"
      )
    ),
  },
  ,
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "system-params-page" */ "./pages/System/SystemParams"
      )
    ),
  }, // {
  //   component: loadable(() => import(/* webpackChunkName: "agency-log" */ './pages/Agency/AgencyLog/AgencyLogList')),
  // },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "agency-log" */ "./pages/Agency/AgencyLog/AgencyLogList"
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "agency-info" */ "./pages/Agency/AgencyInfo/AgencyInfoList"
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "agency-agent" */ "./pages/Agency/AgencyMember/AccountList"
      )
    ),
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
