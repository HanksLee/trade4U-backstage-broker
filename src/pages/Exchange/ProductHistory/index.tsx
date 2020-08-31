import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import ProductEdtior from "../ProductEditor";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";

import utils from "utils";

export interface IProductHistoryProps {}

export interface IProductHistoryState {
  // filter: any;
}

/* eslint new-cap: "off" */
@inject("common", "product")
@observer
export default class ProductHistory extends BaseReact<
IProductHistoryProps,
IProductHistoryState
> {
  state = {
    filter: {},
    tableLoading: false,
    currentPage: 1,
    selectedRowKeys: [],
    name: undefined,
    product__code: undefined,
    type__name: undefined,
    status: undefined,
  };

  async componentDidMount() {
    // @todo 这里需要从 commonStore 中设置默认的分页



  }

  componentDidUpdate() {

  }


  // @ts-ignore
  private onBatch = async value => {};

  render() {
    return (
      <div>
        <CommonList {...this.props} config={listConfig(this)} />
      </div>
    );
  }
}
