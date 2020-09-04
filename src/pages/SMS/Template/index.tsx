import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import EditSMSTemplateModal from "./EditSMSTemplateModal";
import listConfig from "./config";
// import utils from "utils";
import { withRoutePermissionGuard } from "components/withRoutePermissionGuard";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import { ROUTE_TO_PERMISSION } from "constant";
import "./index.scss";

export interface SMSTemplate {
  id: number;
  type: string;
  key: string;
  status: number;
  description: string;
  extra_params: string;
}

interface ISMSTemplateState {
  smsTemplateList: SMSTemplate[];
  currentSMSTemplate: SMSTemplate | null;
  isShowEditSMSTemplateModal: boolean;
}

interface SMSTemplateListState extends ISMSTemplateState {
  tableLoading: boolean;
  selectedRowKeys: string[];
  tempFilter: any;
  total: number;
}

/* eslint new-cap: "off" */
@withRoutePermissionGuard("/dashboard/sms/smstemplate", {
  exact: false,
  permissionCode: ROUTE_TO_PERMISSION["/dashboard/sms/smstemplate"],
})
@inject("common", "sms")
@observer
export default class SMSTemplateList extends BaseReact<
{},
SMSTemplateListState
> {
  state = {
    smsTemplateList: [],
    tableLoading: false,
    selectedRowKeys: [],
    tempFilter: {},
    total: 0,
    roleList: [],
    currentSMSTemplate: null,
    isShowEditSMSTemplateModal: false,
  };

  async componentDidMount() {
    const { filterTemplate, } = this.props.sms;
    const { paginationConfig, } = this.props.common;

    this.getDataList({
      page_size: filterTemplate.page_size || paginationConfig.defaultPageSize,
      page: filterTemplate.page || 1,
    });
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/sms/smstemplate") {
      this.props.history.replace("/dashboard/sms/smstemplate/list");
    }
  }

  getDataList = async (filterTemplate?: any) => {
    const payload = filterTemplate
      ? { ...this.props.sms.filterTemplate, ...filterTemplate, }
      : this.props.sms.filterTemplate;
    this.setState({
      tableLoading: true,
    });

    const res = await this.$api.sms.getSMSTemplateList({ params: payload, });
    const { results, page_size, current_page, count, } = res.data;
    if (results.length === 0 && current_page !== 1) {
      // 删除非第一页的最后一条记录，自动翻到下一页
      this.getDataList({ ...payload, page: current_page - 1, });
    } else {
      this.props.sms.setFilterTemplate({
        page_size,
        page: current_page,
      });
      this.setState({
        smsTemplateList: results,
        tableLoading: false,
        total: count,
      });
    }
  };

  deleteSMSTemplate = async (id: string) => {
    const res = await this.$api.sms.deleteSMSTemplate(id);
    if (res.status === 204) {
      this.getDataList();
    } else {
      this.$msg.error(res.data.message);
    }
  };

  showEditSMSTemplateModal = (SMSTemplate?: SMSTemplate) => {
    if (SMSTemplate) {
      this.setState({
        currentSMSTemplate: SMSTemplate,
      });
    }

    this.setState({
      isShowEditSMSTemplateModal: true,
    });
  };

  hideEditSMSTemplateModal = () => {
    this.setState({
      isShowEditSMSTemplateModal: false,
      currentSMSTemplate: null,
    });
  };

  handleUpdateSMSTemplate = () => {
    this.hideEditSMSTemplateModal();
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
    this.setState((prevState: SMSTemplateListState) => ({
      tempFilter: {
        ...prevState.tempFilter,
        [field]: value,
      },
    }));
  };

  render() {
    const { match, } = this.props;
    const { currentSMSTemplate, isShowEditSMSTemplateModal, } = this.state;
    return (
      <>
        <div>
          <CommonHeader {...this.props} links={[]} title="通道模版列表" />
          {/* {<CommonList {...this.props} config={listConfig(this)} />} */}
          <Route
            path={`${match.url}/list`}
            render={props => (
              <CommonList {...props} config={listConfig(this)} />
            )}
          />
        </div>
        {isShowEditSMSTemplateModal && (
          <EditSMSTemplateModal
            smsTemplate={currentSMSTemplate}
            onOk={this.handleUpdateSMSTemplate}
            onCancel={this.hideEditSMSTemplateModal}
          />
        )}
      </>
    );
  }
}
