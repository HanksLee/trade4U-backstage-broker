import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";

import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import "./index.scss";
import utils from "utils";
import GenreEditor from "pages/Exchange/GenreEditor";
import WithRoute from 'components/WithRoute';

export interface IExchangeGenreProps {}

export interface IExchangeGenreState {
  // pagination: any;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/exchange/genre", { exact: false, })
@inject("common", "product")
@observer
export default class GenreList extends BaseReact<
IExchangeGenreProps,
IExchangeGenreState
> {
  private $genreEditor = null;
  state = {
    selectedRowKeys: [],
  };
  async componentDidMount() {
    // 从 commonStore 中拿取分页预设值, 分页状态放在 ProductStore, 因为编辑完后需用分页状态去重抓列表
    const { paginationConfig, } = this.props.common;
    const { setGenreListPagination, getGenreList, } = this.props.product;
    const current = paginationConfig.defaultCurrent;
    const pageSize = paginationConfig.defaultPageSize;
    const pagination = { ...paginationConfig, current, pageSize, };
    setGenreListPagination(pagination);
    getGenreList();
    // console.log('paginationConfig :>> ', paginationConfig);
  }
  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/exchange/genre") {
      this.props.history.replace("/dashboard/exchange/genre/list");
    }
  }

  // * 按下编辑钮后, 跳转至 genreEditor 页面
  goToEditor = (record: any): void => {
    const url = `/dashboard/exchange/genre/editor?id=${
      !utils.isEmpty(record) ? record.id : 0
    }`;
    this.props.history.push(url);
  };
  // @ts-ignore
  private onBatch = async value => {};

  render() {
    const { match, } = this.props;
    const computedTitle = "交易类型设置";
    const genreList = this.props.product.genreList; // genreList 需被使用 @observer 才会更新
    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        <Route
          path={`${match.url}/editor`}
          render={props => <GenreEditor {...props} />}
        />
      </div>
    );
  }
}
