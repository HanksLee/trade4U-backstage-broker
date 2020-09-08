import * as React from "react";
import { BaseReact } from "components/BaseReact";
import {
  Form,
  Input,
  InputNumber,
  Button,
  TimePicker,
  Checkbox,
  Tooltip,
  Row,
  Col,
  Radio,
  Select
} from "antd";
import CommonHeader from "components/CommonHeader";
import { withRoutePermissionGuard } from "components/withRoutePermissionGuard";
import { ROUTE_TO_PERMISSION } from "constant";
import { inject, observer } from "mobx-react";
import utils from "utils";
import moment from "moment";
import { keys } from "mobx";
import styles from "./index.module.scss";
import classnames from "classnames/bind";
const cx = classnames.bind(styles);

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

export interface ISystemEditorProps {}

export interface ISystemEditorState {}

// @ts-ignore

const dayIndex = {
  0: "周一",
  1: "周二",
  2: "周三",
  3: "周四",
  4: "周五",
  5: "周六",
  6: "周日",
};
const platformCurrency = {
  HKD: "港币",
  CNY: "人民币",
  USD: "美金",
};

@withRoutePermissionGuard("/dashboard/system/params", {
  exact: false,
  permissionCode: ROUTE_TO_PERMISSION["/dashboard/system/params"],
})
@Form.create()
@inject("common", "system")
@observer
export default class SystemEditor extends BaseReact<
ISystemEditorProps,
ISystemEditorState
> {
  state = {};

  async componentDidMount() {
    this.init();
  }

  componentWillUnmount() {}

  onPeriodsChange = (checkedValues: any) => {
    checkedValues.sort(function(a, b) {
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
  mapFieldValueToApiData = input => {
    // 将栏位值转为 API 吃的格式
    const payload = { ...input, };
    const {
      withdraw_daily_start,
      withdraw_daily_end,
      withdraw_periods,
      function_ipo,
      function_news,
      function_quote,
      function_setting,
      function_transaction,
    } = payload;
    payload["withdraw_periods"] = withdraw_periods.join(",");
    payload["withdraw_daily_start"] = withdraw_daily_start
      ? withdraw_daily_start.format("HH:mm")
      : "";
    payload["withdraw_daily_end"] = withdraw_daily_end
      ? withdraw_daily_end.format("HH:mm")
      : "";
    return payload;
  };
  mapApiDataToFieldValue = input => {
    // 将 api 回来的值转为表格栏位要求的格式
    // console.log("input :>> ", input);
    const payload = { ...input, };
    const {
      withdraw_daily_start,
      withdraw_daily_end,
      withdraw_periods,
      function_ipo,
      function_news,
      function_quote,
      function_setting,
      function_transaction,
    } = payload;
    payload["withdraw_periods"] = withdraw_periods.split(",");
    payload["withdraw_daily_start"] = withdraw_daily_start
      ? moment(withdraw_daily_start, "HH:mm")
      : null;
    payload["withdraw_daily_end"] = withdraw_daily_end
      ? moment(withdraw_daily_end, "HH:mm")
      : null;
    payload["function_ipo"] = utils.parseBool(function_ipo); // convert "false" to false
    payload["function_news"] = utils.parseBool(function_news);
    payload["function_quote"] = utils.parseBool(function_quote);
    payload["function_setting"] = utils.parseBool(function_setting);
    payload["function_transaction"] = utils.parseBool(function_transaction);
    return payload;
  };
  init = async () => {
    const { setFieldsValue, } = this.props.form;
    const { $api, } = this.props.system;
    const res = await $api.system.getBrokerConfigList();
    if (res.status === 200) {
      // 转换 api 回传的 json 阵列 => json 物件
      const initApiData = res.data.reduce((obj, curr) => {
        const { key, value, } = curr;
        obj[key] = value;
        return obj;
      }, {});
      const initFieldsValue = this.mapApiDataToFieldValue(initApiData);
      setFieldsValue(initFieldsValue);
      // console.log("initFieldsValue :>> ", initFieldsValue);
    }
  };

  handleSubmit = async (evt: any) => {
    const { $api, } = this.props.system;
    this.props.form.validateFields(async (err, values) => {
      if (err) return;
      // console.log("values :>> ", values);
      const payload = this.mapFieldValueToApiData(values);
      // console.log("payload :>> ", payload);
      try {
        const res = await $api.system.updateBrokerConfig(payload);
        if (res.status === 200) {
          this.$msg.success("系统参数更新成功");
          this.init();
        }
      } catch (err) {
        this.$msg.error("系统参数更新失败");
      }
    });
  };
  renderGroupHeader = title => {
    return (
      <Form.Item>
        <h2 className="form-title">{title}</h2>
      </Form.Item>
    );
  };
  renderClearOption = () => {
    return (
      <Select.Option key="clear" value={null} label="">
        －清除设置－
      </Select.Option>
    );
  };
  render() {
    const { getFieldDecorator, } = this.props.form;
    const { renderGroupHeader, renderClearOption, } = this;
    return (
      <>
        <CommonHeader {...this.props} links={[]} title="系统参数" />
        <div className="editor food-card-editor">
          <section className="editor-content panel-block">
            <Form className="editor-form">
              {renderGroupHeader("出金时间配置")}
              <Form.Item label="時間段" {...getFormItemLayout(4, 12)}>
                {getFieldDecorator("withdraw_periods")(
                  <Checkbox.Group
                    style={{ width: "100%", }}
                    onChange={this.onPeriodsChange}
                  >
                    {Object.entries(dayIndex).map(([key, val]) => (
                      <Col span={3} key={key}>
                        <Checkbox value={key}>{val}</Checkbox>
                      </Col>
                    ))}
                  </Checkbox.Group>
                )}
              </Form.Item>
              <Form.Item label="起始时间" {...getFormItemLayout(4, 12)}>
                {getFieldDecorator("withdraw_daily_start")(
                  <TimePicker
                    style={{ width: `100%`, }}
                    format="HH:mm"
                    defaultOpenValue={moment("00:00", "HH:mm")}
                  />
                )}
              </Form.Item>
              <Form.Item label="结束时间" {...getFormItemLayout(4, 12)}>
                {getFieldDecorator("withdraw_daily_end")(
                  <TimePicker
                    style={{ width: `100%`, }}
                    format="HH:mm"
                    defaultOpenValue={moment("00:00", "HH:mm")}
                  />
                )}
              </Form.Item>
              {renderGroupHeader("出金金额和次数配置")}
              <Form.Item label="最大出金金额" {...getFormItemLayout(4, 12)}>
                <Tooltip title="不限制请填 -1" placement="topLeft">
                  {getFieldDecorator("max_withdraw", {
                    rules: [
                      { required: true, message: "必填，不限制请填 -1", },
                      {
                        validator: async (_, value) => {
                          const val = Number(value);
                          if (val < 0 && val !== -1) {
                            throw new Error("必须 >0，不限制请填 -1");
                          }
                        },
                      }
                    ],
                  })(
                    <InputNumber
                      step={0.01}
                      min={-1}
                      style={{ width: `100%`, }}
                    />
                  )}
                </Tooltip>
              </Form.Item>
              <Form.Item label="最小出金金额" {...getFormItemLayout(4, 12)}>
                {getFieldDecorator("min_withdraw", {
                  rules: [{ required: true, message: "必填", }],
                })(
                  <InputNumber step={0.01} min={0} style={{ width: `100%`, }} />
                )}
              </Form.Item>
              <Form.Item label="每日出金次数" {...getFormItemLayout(4, 12)}>
                {getFieldDecorator("withdraw_daily_times")(
                  <InputNumber min={0} style={{ width: `100%`, }} />
                )}
              </Form.Item>
              {renderGroupHeader("止盈止损显示")}
              <Form.Item label="止盈止损显示" {...getFormItemLayout(4, 12)}>
                {getFieldDecorator("order_tp_sl_unit")(
                  <Radio.Group>
                    <Radio value={"price"}>按单价显示</Radio>
                    <Radio value={"profit"}>按金额显示</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              {renderGroupHeader("报价显示设定")}
              <Form.Item label="报价显示设定" {...getFormItemLayout(4, 12)}>
                {getFieldDecorator("quoted_price")(
                  <Radio.Group>
                    <Radio value={"one_price"}>单报价</Radio>
                    <Radio value={"two_price"}>双报价</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              {renderGroupHeader("审批提示时间")}
              <Form.Item label="审批提示时间" {...getFormItemLayout(4, 12)}>
                {getFieldDecorator("user_authentication")(
                  <Radio.Group>
                    <Radio value={"not_required"}>不认证</Radio>
                    <Radio value={"deposit_authentication"}>入金前认证</Radio>
                    <Radio value={"withdraw_authentication"}>出金前认证</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              {renderGroupHeader("平台货币")}
              <Form.Item label="平台货币" {...getFormItemLayout(4, 12)}>
                {getFieldDecorator("platform_currency")(
                  <Select optionLabelProp="label" placeholder="Please select">
                    {Object.entries(platformCurrency).map(([key, val]) => (
                      <Select.Option
                        key={key}
                        value={key}
                        label={`${key} ${val}`}
                      >
                        {`${key} ${val}`}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="出金货币" {...getFormItemLayout(4, 12)}>
                {getFieldDecorator("withdraw_currency")(
                  <Select optionLabelProp="label" placeholder="Please select">
                    {Object.entries(platformCurrency).map(([key, val]) => (
                      <Select.Option
                        key={key}
                        value={key}
                        label={`${key} ${val}`}
                      >
                        {`${key} ${val}`}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              {renderGroupHeader("前台显示设定")}
              <Form.Item label="行情按钮是否显示" {...getFormItemLayout(4, 12)}>
                {getFieldDecorator("function_quote")(
                  <Radio.Group>
                    <Radio value={false}>否</Radio>
                    <Radio value={true}>是</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="申购按钮是否显示" {...getFormItemLayout(4, 12)}>
                {getFieldDecorator("function_ipo")(
                  <Radio.Group>
                    <Radio value={false}>否</Radio>
                    <Radio value={true}>是</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="交易按钮是否显示" {...getFormItemLayout(4, 12)}>
                {getFieldDecorator("function_transaction")(
                  <Radio.Group>
                    <Radio value={false}>否</Radio>
                    <Radio value={true}>是</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="新闻按钮是否显示" {...getFormItemLayout(4, 12)}>
                {getFieldDecorator("function_news")(
                  <Radio.Group>
                    <Radio value={false}>否</Radio>
                    <Radio value={true}>是</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="设置按钮是否显示" {...getFormItemLayout(4, 12)}>
                {getFieldDecorator("function_setting")(
                  <Radio.Group>
                    <Radio value={false}>否</Radio>
                    <Radio value={true}>是</Radio>
                  </Radio.Group>
                )}
              </Form.Item>

              <Row>
                <Col span={16} className={cx("button-group")}>
                  <Button type="primary" onClick={this.handleSubmit}>
                    保存
                  </Button>
                </Col>
              </Row>
            </Form>
          </section>
        </div>
      </>
    );
  }
}

class InputFloat extends React.Component {
  render() {
    const { fractionDigits, ...restProps } = this.props;
    const step = 1 / 10 ** fractionDigits;
    const parser = value => value;
    return (
      <InputNumber step={step} parser={parser} {...restProps}></InputNumber>
    );
  }
}
