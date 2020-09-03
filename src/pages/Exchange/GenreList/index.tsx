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
    genreList:null,
    currentPage: 1,
  };
  async componentDidMount() {
    // @todo 这里需要从 commonStore 中设置默认的分页
    const {
      paginationConfig: { defaultPageSize, defaultCurrent, },
    } = this.props.common;
    this.setPagination(defaultPageSize, defaultCurrent);
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/exchange/genre") {
      this.props.history.replace("/dashboard/exchange/genre/list");
    }
  }

  getGenreList = async (payload = {}) => {
    console.log('this.state.pagination :>> ', this.state.pagination);
    const res = await this.$api.product.getAllSymbolType({
      params: this.state.pagination,
    });
    const genreList = res.data.results;
    console.log('res :>> ', res);
    this.setState({ genreList, });
  };
 
  setPagination = async (pageSize, pageNum) => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          page_size: pageSize,
          page: pageNum,
        },
      },
      async () => {
        const pagination = this.state.pagination;
        this.getGenreList(pagination);
      }
    );
  };
  // @ts-ignore
  // private onSearch = async () => {
  //   const pagination: any = this.state.pagination;
  //   this.setState(
  //     {
  //       pagination: {
  //         ...pagination,
  //         page: 1,
  //       },
  //       currentPage: 1,
  //     },
  //     () => {
  //       this.getGenreList(this.state.pagination);
  //     }
  //   );
  // };
  // // @ts-ignore
  // private onReset = async () => {
  //   // @ts-ignore
  //   const pagination: any = { page: 1, page_size: this.state.pagination.page_size, };

  //   this.setState(
  //     {
  //       pagination,
  //       currentPage: 1,
  //     },
  //     () => {
  //       this.getGenreList(this.state.pagination);
  //     }
  //   );
  // };

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
