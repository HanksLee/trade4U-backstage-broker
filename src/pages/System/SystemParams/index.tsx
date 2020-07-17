import * as React from "react";
import { BaseReact } from "components/BaseReact";
import {
  Form,
  Input,
  Button,
  TimePicker,
  Checkbox,
  Row,
  Col,
  Radio
} from "antd";
import CommonHeader from "components/CommonHeader";
import withRoute from "components/WithRoute";
import { PAGE_PERMISSION_MAP } from "constant";
import "./index.scss";
import { inject, observer } from "mobx-react";
import utils from "utils";
import moment from "moment";
import { keys } from "mobx";

const FormItem = Form.Item;
// const Option = Select.Option;
// const confirm = Modal.confirm;
// const TextArea = Input.TextArea;
// const radioStyle = { display: "block", marginBottom: 12 };
// const RangePicker = DatePicker.RangePicker;

const getFormItemLayout = (
  label: number,
  wrapper: number,
  offset?: undefined
) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

export interface ISystemEditorProps { }

export interface ISystemEditorState {
  withdraw_periods: string;
  withdraw_daily_start: string;
  withdraw_daily_end: string;
  min_withdraw: string;
  max_withdraw: string;
  withdraw_daily_times: string;
  order_tp_sl_unit: string;
  platform_currency: string;
  user_authentication: string;
  withdraw_currency: string;
}

// @ts-ignore

@withRoute("/dashboard/system/params", {
  exact: false,
  permissionCode: PAGE_PERMISSION_MAP["/dashboard/system/params"],
})
@Form.create()
@inject("common", "system")
@observer
export default class SystemEditor extends BaseReact<
ISystemEditorProps,
ISystemEditorState
> {
  state = {
    withdraw_periods: "",
    withdraw_daily_start: "",
    withdraw_daily_end: "",
    min_withdraw: "",
    max_withdraw: "",
    withdraw_daily_times: "",
    order_tp_sl_unit: "",
    platform_currency: "",
    user_authentication: "",
    withdraw_currency: "",
  };

  async componentDidMount() {
    this.getConfig();
  }

  componentWillUnmount() {
    // this.props.product.setCurrentProduct({}, true, false);
  }

  onPeriodsChange = (checkedValues: any) => {
    checkedValues.sort(function (a, b) {
      return a - b;
    });
    this.setState({
      withdraw_periods: checkedValues.toString(),
    });
  };

  onStartTimeChange = (time: any, timeString: any) => {
    this.setState({
      withdraw_daily_start: timeString,
    });
  };

  onEndTimeChange = (time: any, timeString: any) => {
    this.setState({
      withdraw_daily_end: timeString,
    });
  };

  getConfig = async () => {
    const res = await this.$api.system.getBrokerConfigList();
    if (res.status === 200) {
      const self = this;
      res.data.forEach(function (item, index, array) {
        switch (item.key) {
          case "withdraw_periods":
            self.setState({ withdraw_periods: item.value.split(","), });
            break;
          case "withdraw_daily_start":
            self.setState({ withdraw_daily_start: item.value, });
            break;
          case "withdraw_daily_end":
            self.setState({ withdraw_daily_end: item.value, });
            break;
          case "min_withdraw":
            self.setState({ min_withdraw: item.value, });
            break;
          case "max_withdraw":
            self.setState({ max_withdraw: item.value, });
            break;
          case "withdraw_daily_times":
            self.setState({ withdraw_daily_times: item.value, });
            break;
          case "order_tp_sl_unit":
            self.setState({ order_tp_sl_unit: item.value, });
            break;
          case "platform_currency":
            self.setState({ platform_currency: item.value, });
            break;
          case "user_authentication":
            self.setState({ user_authentication: item.value, });
            break;
          case "withdraw_currency":
            self.setState({ withdraw_currency: item.value, });
            break;
        }
      });
    }
  };

  renderEditor = () => {
    const { getFieldDecorator, } = this.props.form;
    const {
      withdraw_periods,
      withdraw_daily_start,
      withdraw_daily_end,
      max_withdraw,
      min_withdraw,
      withdraw_daily_times,
      order_tp_sl_unit,
      platform_currency,
      user_authentication,
      withdraw_currency,
    } = this.state;
    const vaildatorNum = {
      patternNum: /^\d+\.?\d*$/,
      message: "密码必须为正整数或小数",
    };

    return (
      <Form className="editor-form">
        <FormItem>
          <h2 className="editor-form-title form-title">出金时间配置</h2>
        </FormItem>
        <FormItem label="時間段" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("withdraw_periods", {
            initialValue: withdraw_periods || [],
          })(
            <Checkbox.Group
              style={{ width: "100%", }}
              onChange={this.onPeriodsChange}
            >
              <Row>
                <Col span={4}>
                  <Checkbox value="0">周一</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="1">周二</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="2">周三</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="3">周四</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="4">周五</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="5">周六</Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox value="6">周日</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          )}
        </FormItem>
        <FormItem label="起始时间" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("withdraw_daily_start", {
            initialValue: withdraw_daily_start
              ? moment(withdraw_daily_start, "HH:mm")
              : moment(),
          })(
            <TimePicker
              onChange={this.onStartTimeChange}
              format="HH:mm"
              defaultOpenValue={moment("00:00", "HH:mm")}
            />
          )}
        </FormItem>
        <FormItem label="结束时间" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("withdraw_daily_end", {
            initialValue: withdraw_daily_end
              ? moment(withdraw_daily_end, "HH:mm")
              : null,
          })(
            <TimePicker
              onChange={this.onEndTimeChange}
              format="HH:mm"
              defaultOpenValue={moment("00:00", "HH:mm")}
            />
          )}
        </FormItem>
        <FormItem>
          <h2 className="editor-form-title form-title">出金金额和次数配置</h2>
        </FormItem>
        <FormItem label="最大出金金额" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("max_withdraw", {
            initialValue: max_withdraw || "",
            rules: [
              {
                pattern: vaildatorNum.patternNum,
                message: vaildatorNum.message,
              }
            ],
          })(
            <Input
              placeholder="请输入最大出金金额"
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem label="最小出金金额" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("min_withdraw", {
            initialValue: min_withdraw || "",
            rules: [
              {
                pattern: vaildatorNum.patternNum,
                message: vaildatorNum.message,
              }
            ],
          })(
            <Input
              placeholder="请输入最小出金金额"
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem label="每日出金次数" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("withdraw_daily_times", {
            initialValue: withdraw_daily_times || "",
            rules: [
              {
                pattern: vaildatorNum.patternNum,
                message: vaildatorNum.message,
              }
            ],
          })(
            <Input
              placeholder="请输入每日出金次数"
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem>
          <h2 className="editor-form-title form-title">止盈止损显示</h2>
        </FormItem>
        <FormItem label="止盈止损显示" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("order_tp_sl_unit", {
            initialValue: order_tp_sl_unit || "price",
          })(
            <Radio.Group>
              <Radio value={"price"}>按单价显示</Radio>
              <Radio value={"profit"}>按金额显示</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem>
          <h2 className="editor-form-title form-title">审批提示时间</h2>
        </FormItem>
        <FormItem label="审批提示时间" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("user_authentication", {
            initialValue: user_authentication || "deposit_authentication",
          })(
            <Radio.Group>
              <Radio value={"deposit_authentication"}>入金前认证</Radio>
              <Radio value={"withdraw_authentication"}>出金前认证</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem>
          <h2 className="editor-form-title form-title">平台货币</h2>
        </FormItem>
        <FormItem label="平台货币" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("platform_currency", {
            initialValue: platform_currency || "",
            rules: [
              {
                pattern: /[a-zA-Z]+/,
                message: "只能输入英文",
              }
            ],
          })(
            <Input
              placeholder="平台货币"
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem label="出金货币" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("withdraw_currency", {
            initialValue: withdraw_currency || "",
            rules: [
              {
                pattern: /[a-zA-Z]+/,
                message: "只能输入英文",
              }
            ],
          })(
            <Input
              placeholder="平台货币"
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem className="editor-form-btns">
          {/* <Button onClick={this.goBack}>取消</Button> */}
          {
            <Button type="primary" onClick={this.handleSubmit}>
              保存
            </Button>
          }
        </FormItem>
      </Form>
    );
  };

  handleSubmit = async (evt: any) => {
    const {
      withdraw_periods,
      withdraw_daily_start,
      withdraw_daily_end,
    } = this.state;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let valuesArr: any = [];
        valuesArr.push({
          key: "withdraw_periods",
          value: withdraw_periods,
        });
        valuesArr.push({
          key: "withdraw_daily_start",
          value: withdraw_daily_start,
        });
        valuesArr.push({
          key: "withdraw_daily_end",
          value: withdraw_daily_end,
        });
        valuesArr.push({
          key: "max_withdraw",
          value: values.max_withdraw,
        });
        valuesArr.push({
          key: "min_withdraw",
          value: values.min_withdraw,
        });
        valuesArr.push({
          key: "withdraw_daily_times",
          value: values.withdraw_daily_times,
        });
        valuesArr.push({
          key: "order_tp_sl_unit",
          value: values.order_tp_sl_unit,
        });
        valuesArr.push({
          key: "platform_currency",
          value: values.platform_currency,
        });
        valuesArr.push({
          key: "user_authentication",
          value: values.user_authentication,
        });
        valuesArr.push({
          key: "withdraw_currency",
          value: values.withdraw_currency,
        });

        const configs = JSON.stringify(valuesArr);
        const payload = { configs, };
        const res = await this.$api.system.updateBrokerConfig(
          JSON.stringify(payload)
        );
        if (res.status === 200) {
          this.$msg.success("系统参数更新成功");
          this.getConfig();
        }
      }
    });
  };

  render() {
    return (
      <>
        <CommonHeader {...this.props} links={[]} title="系统参数" />
        <div className="editor food-card-editor">
          <section className="editor-content panel-block">
            {this.renderEditor()}
          </section>
        </div>
      </>
    );
  }
}
