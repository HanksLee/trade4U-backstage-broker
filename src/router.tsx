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
  // {
  //   component: loadable(() => import(/* webpackChunkName: "Index" */ './pages/Index')),
  // },
  {
    component: loadable(() => import(/* webpackChunkName: "Deposit" */ './pages/Finance/Deposit/DepositList')),
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
