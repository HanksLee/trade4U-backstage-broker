import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";

export interface ICurrencyHistoryListProps {}

export interface ICurrencyHistoryListState {}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/currency_history", { exact: false, })
@inject("common", "currencyHistory")
@observer
export default class CurrencyHistoryList extends BaseReact<
ICurrencyHistoryListProps,
ICurrencyHistoryListProps
> {
  state = {};

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/currency_history") {
      this.props.history.replace("/dashboard/currency_history/list");
    }
  }

  render() {
    const computedTitle = "汇率行情";
    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <CommonList {...this.props} config={listConfig(this)} />
      </div>
    );
  }
}
