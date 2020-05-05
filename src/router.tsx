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
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "verify-opne-account-page" */ "./pages/Verify/AgentVerify"
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "verify-withdraw-commission-page" */ "./pages/Verify/WithdrawCommission"
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "verify-withdraw-apply-page" */ "./pages/Verify/WithdrawApply"
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "verify-opne-account-page" */ "./pages/Verify/OpenAccount"
      )
    ),
  },
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
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: "message-type" */ "./pages/Message/Type")
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "message-content" */ "./pages/Message/Content"
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "group-page" */ './pages/Group/GroupList'
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "open-order-page" */ "./pages/Order/OpenOrder/OpenOrderList"
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "close-order-page" */ "./pages/Order/CloseOrder/CloseOrderList"
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "account-report-page" */ "./pages/Report/AccountReport"
      )
    ),
  },
  {
    component: loadable(() =>
      import(
        /* webpackChunkName: "agency-report-page" */ "./pages/Report/AgencyReport"
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
