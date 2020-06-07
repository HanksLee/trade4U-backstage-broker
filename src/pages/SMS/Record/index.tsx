import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
// import utils from "utils";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import { PAGE_PERMISSION_MAP } from "constant";
import "./index.scss";

export interface SMSRecord {
  id: number;
  type: string;
  key: string;
  status: number;
  description: string;
  extra_params: string;
}

interface ISMSRecordState {
  smsRecordList: SMSRecord[];
}

interface SMSRecordListState extends ISMSRecordState {
  tableLoading: boolean;
  selectedRowKeys: string[];
  tempFilter: any;
  total: number;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/sms/smsrecord", {
  exact: false,
  permissionCode: PAGE_PERMISSION_MAP["/dashboard/sms/smsrecord"],
})
@inject("common", "sms")
@observer
export default class SMSRecordList extends BaseReact<{}, SMSRecordListState> {
  state = {
    smsRecordList: [],
    tableLoading: false,
    selectedRowKeys: [],
    tempFilter: {},
    total: 0,
  };

  async componentDidMount() {
    const { filterRecord, } = this.props.sms;
    const { paginationConfig, } = this.props.common;

    this.getDataList({
      page_size: filterRecord.page_size || paginationConfig.defaultPageSize,
      page: filterRecord.page || 1,
    });
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/sms/smsrecord") {
      this.props.history.replace("/dashboard/sms/smsrecord/list");
    }
  }

  getDataList = async (filterRecord?: any) => {
    const payload = filterRecord
      ? { ...this.props.sms.filterRecord, ...filterRecord, }
      : this.props.sms.filterRecord;
    this.setState({
      tableLoading: true,
    });

    const res = await this.$api.sms.getSMSRecordList({ params: payload, });
    const { results, page_size, current_page, count, } = res.data;
    if (results.length === 0 && current_page !== 1) {
      // 删除非第一页的最后一条记录，自动翻到下一页
      this.getDataList({ ...payload, page: current_page - 1, });
    } else {
      this.props.sms.setFilterRecord({
        page_size,
        page: current_page,
      });
      this.setState({
        smsRecordList: results,
        tableLoading: false,
        total: count,
      });
    }
  };

  // @ts-ignore
  private onSearch = async () => {
    const filter: any = {
      page: 1,
      ...this.state.tempFilter,
    };
    this.getDataList(filter);
  };

  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    this.getDataList({
      page: 1,
    });
    this.setState({
      tempFilter: {},
    });
  };

  onInputChanged = (field, value) => {
    this.setState((prevState: SMSRecordListState) => ({
      tempFilter: {
        ...prevState.tempFilter,
        [field]: value,
      },
    }));
  };

  render() {
    const { match, } = this.props;
    return (
      <>
        <div>
          <CommonHeader {...this.props} links={[]} title="短信列表" />
          {/* {<CommonList {...this.props} config={listConfig(this)} />} */}
          <Route
            path={`${match.url}/list`}
            render={props => (
              <CommonList {...props} config={listConfig(this)} />
            )}
          />
        </div>
      </>
    );
  }
}
