import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import EditSMSChannelModal from "./EditSMSChannelModal";
import listConfig from "./config";
// import utils from "utils";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import { ROUTE_TO_PERMISSION } from "constant";
import "./index.scss";

export interface SMSChannel {
  id: number;
  type: string;
  key: string;
  status: number;
  description: string;
  extra_params: string;
}

interface ISMSChannelState {
  smsChannelList: SMSChannel[];
  currentSMSChannel: SMSChannel | null;
  isShowEditSMSChannelModal: boolean;
}

interface SMSChannelListState extends ISMSChannelState {
  tableLoading: boolean;
  selectedRowKeys: string[];
  tempFilter: any;
  total: number;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/sms/smschannel", {
  exact: false,
  permissionCode: ROUTE_TO_PERMISSION["/dashboard/sms/smschannel"],
})
@inject("common", "sms")
@observer
export default class SMSChannelList extends BaseReact<{}, SMSChannelListState> {
  state = {
    smsChannelList: [],
    tableLoading: false,
    selectedRowKeys: [],
    tempFilter: {},
    total: 0,
    roleList: [],
    currentSMSChannel: null,
    isShowEditSMSChannelModal: false,
  };

  async componentDidMount() {
    const { filterChannel, } = this.props.sms;
    const { paginationConfig, } = this.props.common;

    this.getDataList({
      page_size: filterChannel.page_size || paginationConfig.defaultPageSize,
      page: filterChannel.page || 1,
    });
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/sms/smschannel") {
      this.props.history.replace("/dashboard/sms/smschannel/list");
    }
  }

  getDataList = async (filterChannel?: any) => {
    const payload = filterChannel
      ? { ...this.props.sms.filterChannel, ...filterChannel, }
      : this.props.sms.filterChannel;
    this.setState({
      tableLoading: true,
    });

    const res = await this.$api.sms.getSMSChannelList({ params: payload, });
    const { results, page_size, current_page, count, } = res.data;
    if (results.length === 0 && current_page !== 1) {
      // 删除非第一页的最后一条记录，自动翻到下一页
      this.getDataList({ ...payload, page: current_page - 1, });
    } else {
      this.props.sms.setFilterChannel({
        page_size,
        page: current_page,
      });
      this.setState({
        smsChannelList: results,
        tableLoading: false,
        total: count,
      });
    }
  };

  deleteSMSChannel = async (id: string) => {
    const res = await this.$api.sms.deleteSMSChannel(id);
    if (res.status === 204) {
      this.getDataList();
    } else {
      this.$msg.error(res.data.message);
    }
  };

  showEditSMSChannelModal = (SMSChannel?: SMSChannel) => {
    if (SMSChannel) {
      this.setState({
        currentSMSChannel: SMSChannel,
      });
    }

    this.setState({
      isShowEditSMSChannelModal: true,
    });
  };

  hideEditSMSChannelModal = () => {
    this.setState({
      isShowEditSMSChannelModal: false,
      currentSMSChannel: null,
    });
  };

  handleUpdateSMSChannel = () => {
    this.hideEditSMSChannelModal();
    this.getDataList();
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
    this.setState((prevState: SMSChannelListState) => ({
      tempFilter: {
        ...prevState.tempFilter,
        [field]: value,
      },
    }));
  };

  render() {
    const { match, } = this.props;
    const { currentSMSChannel, isShowEditSMSChannelModal, } = this.state;
    return (
      <>
        <div>
          <CommonHeader {...this.props} links={[]} title="通道列表" />
          {/* {<CommonList {...this.props} config={listConfig(this)} />} */}
          <Route
            path={`${match.url}/list`}
            render={props => (
              <CommonList {...props} config={listConfig(this)} />
            )}
          />
        </div>
        {isShowEditSMSChannelModal && (
          <EditSMSChannelModal
            smsChannel={currentSMSChannel}
            onOk={this.handleUpdateSMSChannel}
            onCancel={this.hideEditSMSChannelModal}
          />
        )}
      </>
    );
  }
}
