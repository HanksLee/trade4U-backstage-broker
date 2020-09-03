import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import "./index.scss";
import utils from "utils";
import GenreEditor from "pages/Exchange/GenreEditor";

export interface IExchangeGenreProps {}

export interface IExchangeGenreState {
  // pagination: any;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/exchange/genre", { exact: false, })
@inject("common")
@observer
export default class ExchangeGenre extends BaseReact<
IExchangeGenreProps,
IExchangeGenreState
> {
  private $genreEditor = null;
  state = {
    pagination: {},
    selectedRowKeys: [],
    genreList: null,
  };
  async componentDidMount() {
    // 从 commonStore 中拿取分页预设值，加入到组件的 state
    const { paginationConfig, } = this.props.common;
    // console.log('paginationConfig :>> ', paginationConfig);
    const current = paginationConfig.defaultCurrent;
    const pageSize = paginationConfig.defaultPageSize;
    const pagination = { ...paginationConfig, current, pageSize, } ;
    this.setState({ pagination,  });
    this.getGenreList(pagination);
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/exchange/genre") {
      this.props.history.replace("/dashboard/exchange/genre/list");
    }
  }
  getGenreList = async pagination => {
    const { current, pageSize, } = pagination;
    // console.log("pagination :>> ", pagination);
    const res = await this.$api.product.getAllSymbolType({
      params: { page_size: pageSize, page: current, },
    });
    // console.log('res :>> ', res);
    const genreList = res.data.results;
    this.setState({ genreList, });
  };

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
