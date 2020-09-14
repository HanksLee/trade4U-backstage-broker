import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";

import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
// import "./index.scss";
import utils from "utils";
import GenreEditor from "pages/Exchange/GenreEditor";
import { withRoutePermissionGuard } from "components/withRoutePermissionGuard";
import LotteryList from "./LotteryList";
/* eslint new-cap: "off" */
@withRoutePermissionGuard("/dashboard/ipo/lottery", { exact: false, })
@inject("common")
@observer
export default class IpoLottery extends React.Component {
  state = {};
  componentDidMount() {
    if (this.props.location.pathname === "/dashboard/ipo/lottery") {
      this.props.history.replace("/dashboard/ipo/lottery/list");
    }
  }
  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/ipo/lottery") {
      this.props.history.replace("/dashboard/ipo/lottery/list");
    }
  }

  render() {
    const { match, } = this.props;
    const computedTitle = "客户中签管理";
    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <Route path={`${match.url}/list`} render={props => <LotteryList {...props}/>} />
      </div>
    );
  }
}
