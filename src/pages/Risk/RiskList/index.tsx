import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import { withRoutePermissionGuard } from "components/withRoutePermissionGuard";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";

export interface IRiskListProps {}

export interface IRiskListState {}

/* eslint new-cap: "off" */
@withRoutePermissionGuard("/dashboard/risk", { exact: false, })
@inject("common", "risk")
@observer
export default class RiskList extends BaseReact<
IRiskListProps,
IRiskListProps
> {

  state={

  };

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/risk") {
      this.props.history.replace("/dashboard/risk/list");
    }
  }

  render() {
    const computedTitle = "风控记录";
    return(
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <CommonList {...this.props} config={listConfig(this)} />
      </div>
    );
  }



}