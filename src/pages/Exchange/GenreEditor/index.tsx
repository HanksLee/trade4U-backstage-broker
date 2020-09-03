import * as React from "react";
import { BaseReact } from "components/BaseReact";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Tooltip,
  Button,
  Radio,
  Col,
  Row
} from "antd";
import { inject } from "mobx-react";
import styles from "./index.module.scss";
import classnames from "classnames/bind";
const cx = classnames.bind(styles);

export interface IGenreEditorProps {}

export interface IGenreEditorState {}
// 利润规则 scope
const scopes = [
  "margin_rule",
  "profit_rule",
  "pre_pay_rule",
  "delay_rule",
  "tax_rule",
  "fee_rule"
];
// 栏位的利润规则 scope
const scopeOfField = {
  calculate_for_buy_hands_fee: "fee_rule",
  calculate_for_sell_hands_fee: "fee_rule",
  calculate_for_buy_tax: "tax_rule",
  calculate_for_sell_tax: "tax_rule",
  calculate_for_buy_stock_fee: "delay_rule",
  calculate_for_sell_stock_fee: "delay_rule",
  profit_calculate_for_bought: "profit_rule",
  profit_calculate_for_sale: "profit_rule",
  calculate_for_cash_deposit: "margin_rule",
};
/**
 * MT 外汇
 * HK 港股
 * 该种产品分类的栏位选项
 */
const fieldOptionsOfSymbolType = {
  HK: {
    position_type: ["T+0", "T+1"],
    three_days_swap: ["週一", "週二", "週三", "週四", "週五", "週六", "週日"],
  },
  MT: {
    position_type: ["T+0", "T+1", "T+2", "T+3"],
    three_days_swap: ["週一", "週二", "週三", "週四", "週五", "週六", "週日"],
  },
};

// @ts-ignore
@Form.create()
@inject("common", "exchange", "product")
export default class GenreEditor extends BaseReact<
IGenreEditorProps,
IGenreEditorState
> {
  state = {
    scopes,
    scopeOfFields: scopeOfField,
    rulesOfScope: {},
    formLayout: "horizontal",
    formItemLayout: {
      labelCol: { span: 4, },
      wrapperCol: { span: 12, },
    },
    fieldOptions: {},
  };

  componentDidMount() {
    // this.props.onRef(this);
    this.init();
  }
  init = async () => {
    const { scopes, } = this.state;
    const parsedQueryString = this.$qs.parse(this.props.location.search);
    const { id, } = parsedQueryString;
    const { setFieldsValue, } = this.props.form;
    const res = await this.$api.product.getCurrentSymbolType(id);
    const initFieldValue = this.mapApiDataToFieldValue(res.data);
    const fieldOptions = fieldOptionsOfSymbolType[res.data.code];
    this.setState({ fieldOptions, });
    setFieldsValue(initFieldValue);
    // console.log("res :>> ", res);

    // 取得栏位选项公式 （利润规则）
    const ruleList = await Promise.all(
      scopes.map(scope =>
        this.$api.product.getRuleList({
          params: {
            scope,
          },
        })
      )
    );
    const rulesOfScope = ruleList
      .map(each => each.data.results)
      .reduce((obj, rules, index) => {
        const scope = scopes[index];
        obj[scope] = rules;
        return obj;
      }, {});
    this.setState({ rulesOfScope, });
    // console.log("ruleList :>> ", ruleList);
    // console.log("this.state.rulesOfScope :>> ", this.state.rulesOfScope);
  };
  mapApiDataToFieldValue = input => {
    // 将 api 回传格式转为栏位值
    const payload = { ...input, };
    payload.leverage = payload.leverage.split(",");
    return payload;
  };
  mapFieldValueToApiData = input => {
    // 将表单栏位值转为 api 吃的格式
    const payload = { ...input, };
    payload.leverage = payload.leverage.join(",");
    return payload;
  };
  getRulesOfField = fieldName => {
    const scope = this.state.scopeOfFields[fieldName];
    const rules = this.state.rulesOfScope[scope];
    return rules || [];
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (err) return;
      const payload = this.mapFieldValueToApiData(values);
      const parsedQueryString = this.$qs.parse(this.props.location.search);
      const { id, } = parsedQueryString;
      const res = await this.$api.product.updateSymbolType(id, payload);
      // console.log("values :>> ", values);
      // console.log("payload :>> ", payload);
      // console.log("res :>> ", res);
      if (res.status === 200) {
        // this.props.history.goBack();
      } else {
        // TODO: 提示使用者表单送出失败
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
    const { formItemLayout, fieldOptions, } = this.state;
    const { renderGroupHeader, renderClearOption, } = this;

    return (
      <div className="editor">
        <section className="panel-block">
          <Form className="editor-form" layout={"horizontal"}>
            {renderGroupHeader("基本配置")}
            <Form.Item
              data-name="symbol_type_name"
              label="交易类型"
              {...formItemLayout}
            >
              {getFieldDecorator("symbol_type_name")(
                <Input type="text" disabled={true} />
              )}
            </Form.Item>
            <Form.Item
              data-name="position_type"
              label="持仓类型"
              {...formItemLayout}
            >
              <Tooltip
                title="T+0 (可多可空)、T+1 (只能作多)"
                placement="topLeft"
              >
                {getFieldDecorator("position_type", {
                  rules: [
                    {
                      required: true,
                      message: "必填",
                    }
                  ],
                })(
                  <Select mode="tags" placeholder="Please select">
                    {fieldOptions["position_type"] &&
                      fieldOptions["position_type"].map(option => (
                        <Select.Option key={option} value={option}>
                          {option}
                        </Select.Option>
                      ))}
                  </Select>
                )}
              </Tooltip>
            </Form.Item>
            <Form.Item
              data-name="max_position_days"
              label="持仓天数"
              {...formItemLayout}
            >
              {getFieldDecorator("max_position_days")(
                <InputNumber className={cx("input-number")} />
              )}
            </Form.Item>
            <Form.Item data-name="leverage" label="杠杆" {...formItemLayout}>
              <Tooltip
                title="最多3个，以 , 符号区隔，例如： 1,2,3"
                placement="topLeft"
              >
                {getFieldDecorator("leverage", {
                  rules: [
                    {
                      required: true,
                      message: "必填",
                    },
                    {
                      validator: async (_, value) => {
                        if (value.length > 3)
                          throw new Error("不能设置超过 3 个");
                      },
                    }
                  ],
                })(<Select mode="tags" tokenSeparators={[","]} open={false} />)}
              </Tooltip>
            </Form.Item>
            <Form.Item
              data-name="max_lots"
              label="最大手数"
              {...formItemLayout}
            >
              <Tooltip title="不限制请填 -1" placement="topLeft">
                {getFieldDecorator("max_lots", {
                  rules: [
                    {
                      required: true,
                      message: "最大手数必填，如不限制请填 -1",
                    }
                  ],
                })(<InputNumber className={cx("input-number")} min={-1} />)}
              </Tooltip>
            </Form.Item>
            <Form.Item
              data-name="min_lots"
              label="最小手数"
              {...formItemLayout}
            >
              {getFieldDecorator("min_lots", {
                rules: [
                  {
                    required: true,
                    message: "最小手数必填",
                  }
                ],
              })(<InputNumber className={cx("input-number")} min={1} />)}
            </Form.Item>
            <Form.Item
              data-name="take_profit_point"
              label="止盈线"
              {...formItemLayout}
            >
              {getFieldDecorator("take_profit_point")(<InputPercent />)}
            </Form.Item>
            <Form.Item
              data-name="stop_loss_point"
              label="止损线"
              {...formItemLayout}
            >
              {getFieldDecorator("stop_loss_point")(<InputPercent />)}
            </Form.Item>
            <Form.Item data-name="spread" label="点差" {...formItemLayout}>
              {getFieldDecorator("spread")(
                <InputNumber className={cx("input-number")} />
              )}
            </Form.Item>
            <Form.Item
              data-name="spread_mode"
              label="点差模式"
              {...formItemLayout}
            >
              {getFieldDecorator("spread_mode")(<Input type="text" />)}
            </Form.Item>

            {renderGroupHeader("税费计算")}
            <Form.Item
              data-name="calculate_for_buy_tax"
              label="买入税费计算"
              {...formItemLayout}
            >
              {getFieldDecorator("calculate_for_buy_tax")(
                <Select placeholder="Please select">
                  {this.getRulesOfField("calculate_for_buy_tax").map(rule => (
                    <Select.Option key={rule.id} value={rule.func_name}>
                      {rule.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              data-name="calculate_for_sell_tax"
              label="卖出税费计算"
              {...formItemLayout}
            >
              {getFieldDecorator("calculate_for_sell_tax")(
                <Select placeholder="Please select">
                  {this.getRulesOfField("calculate_for_sell_tax").map(rule => (
                    <Select.Option key={rule.id} value={rule.func_name}>
                      {rule.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              data-name="tax_for_buy"
              label="买入税率"
              {...formItemLayout}
            >
              {getFieldDecorator("tax_for_buy")(<InputPercent />)}
            </Form.Item>
            <Form.Item
              data-name="tax_for_sell"
              label="卖出税率"
              {...formItemLayout}
            >
              {getFieldDecorator("tax_for_sell")(<InputPercent />)}
            </Form.Item>

            {renderGroupHeader("保证金计算")}
            <Form.Item
              data-name="calculate_for_cash_deposit"
              label="保证金计算"
              {...formItemLayout}
            >
              {getFieldDecorator("calculate_for_cash_deposit", {
                rules: [
                  {
                    required: true,
                    message: "必填",
                  }
                ],
              })(
                <Select placeholder="Please select">
                  {this.getRulesOfField("calculate_for_cash_deposit").map(
                    rule => (
                      <Select.Option key={rule.id} value={rule.func_name}>
                        {rule.name}
                      </Select.Option>
                    )
                  )}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              data-name="profit_calculate_for_bought"
              label="盈亏计算（多）"
              {...formItemLayout}
            >
              {getFieldDecorator("profit_calculate_for_bought", {
                rules: [
                  {
                    required: true,
                    message: "必填",
                  }
                ],
              })(
                <Select placeholder="Please select">
                  {this.getRulesOfField("profit_calculate_for_bought").map(
                    rule => (
                      <Select.Option key={rule.id} value={rule.func_name}>
                        {rule.name}
                      </Select.Option>
                    )
                  )}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              data-name="profit_calculate_for_sale"
              label="盈亏计算（空）"
              {...formItemLayout}
            >
              {getFieldDecorator("profit_calculate_for_sale", {
                rules: [
                  {
                    required: true,
                    message: "必填",
                  }
                ],
              })(
                <Select placeholder="Please select">
                  {this.getRulesOfField("profit_calculate_for_sale").map(
                    rule => (
                      <Select.Option key={rule.id} value={rule.func_name}>
                        {rule.name}
                      </Select.Option>
                    )
                  )}
                </Select>
              )}
            </Form.Item>

            {renderGroupHeader("利润设定")}
            <Form.Item
              data-name="calculate_for_buy_hands_fee"
              label="买入手续费计算"
              {...formItemLayout}
            >
              {getFieldDecorator("calculate_for_buy_hands_fee")(
                <Select optionLabelProp="label" placeholder="Please select">
                  {renderClearOption()}
                  {this.getRulesOfField("calculate_for_buy_hands_fee").map(
                    rule => (
                      <Select.Option
                        key={rule.id}
                        value={rule.func_name}
                        label={rule.name}
                      >
                        {rule.name}
                      </Select.Option>
                    )
                  )}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              data-name="calculate_for_sell_hands_fee"
              label="卖出手续费计算"
              {...formItemLayout}
            >
              {getFieldDecorator("calculate_for_sell_hands_fee")(
                <Select optionLabelProp="label" placeholder="Please select">
                  {renderClearOption()}
                  {this.getRulesOfField("calculate_for_sell_hands_fee").map(
                    rule => (
                      <Select.Option
                        key={rule.id}
                        value={rule.func_name}
                        label={rule.name}
                      >
                        {rule.name}
                      </Select.Option>
                    )
                  )}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              data-name="hands_fee_for_buy"
              label="买入手续费费率"
              {...formItemLayout}
            >
              {getFieldDecorator("hands_fee_for_buy")(<InputPercent />)}
            </Form.Item>
            <Form.Item
              data-name="hands_fee_for_sell"
              label="卖出手续费费率"
              {...formItemLayout}
            >
              {getFieldDecorator("hands_fee_for_sell")(<InputPercent />)}
            </Form.Item>
            <Form.Item
              data-name="calculate_for_buy_stock_fee"
              label="买入库存费计算（多）"
              {...formItemLayout}
            >
              {getFieldDecorator("calculate_for_buy_stock_fee")(
                <Select optionLabelProp="label" placeholder="Please select">
                  {renderClearOption()}
                  {this.getRulesOfField("calculate_for_buy_stock_fee").map(
                    rule => (
                      <Select.Option
                        key={rule.id}
                        value={rule.func_name}
                        label={rule.name}
                      >
                        {rule.name}
                      </Select.Option>
                    )
                  )}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              data-name="calculate_for_sell_stock_fee"
              label="卖出库存费计算（空）"
              {...formItemLayout}
            >
              {getFieldDecorator("calculate_for_sell_stock_fee")(
                <Select optionLabelProp="label" placeholder="Please select">
                  {renderClearOption()}
                  {this.getRulesOfField("calculate_for_sell_stock_fee").map(
                    rule => (
                      <Select.Option
                        key={rule.id}
                        value={rule.func_name}
                        label={rule.name}
                      >
                        {rule.name}
                      </Select.Option>
                    )
                  )}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              data-name="purchase_fee"
              label="买入库存费率（多）"
              {...formItemLayout}
            >
              {getFieldDecorator("purchase_fee")(<InputPercent />)}
            </Form.Item>
            <Form.Item
              data-name="selling_fee"
              label="卖出库存费率（空）"
              {...formItemLayout}
            >
              {getFieldDecorator("selling_fee")(<InputPercent />)}
            </Form.Item>
            <Form.Item
              data-name="three_days_swap"
              label="三日库存费"
              {...formItemLayout}
            >
              {getFieldDecorator("three_days_swap")(
                <Select optionLabelProp="label" placeholder="Please select">
                  {renderClearOption()}
                  {fieldOptions["three_days_swap"] &&
                    fieldOptions["three_days_swap"].map(option => (
                      <Select.Option key={option} value={option} label={option}>
                        {option}
                      </Select.Option>
                    ))}
                </Select>
              )}
            </Form.Item>

            {renderGroupHeader("其他设定")}
            <Form.Item label="是否可用" required {...formItemLayout}>
              {getFieldDecorator("status")(
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              )}
            </Form.Item>

            <Row>
              <Col span={16} className={cx("button-group")}>
                <Button type="primary" onClick={this.handleSubmit}>
                  提交
                </Button>
              </Col>
            </Row>
          </Form>
        </section>
      </div>
    );
  }
}

class InputPercent extends React.Component {
  render() {
    return (
      <InputNumber
        className={cx("input-number")}
        formatter={value => `${value}%`}
        parser={value => value.replace("%", "")}
        {...this.props}
      />
    );
  }
}

class FormItemWithTooltip extends React.Component {
  render() {
    const { tooltipProps = {}, ...formItemProps } = this.props;
    return (
      <Form.Item {...formItemProps}>
        <Tooltip placement="topLeft" {...tooltipProps}>
          {this.props.children}
        </Tooltip>
      </Form.Item>
    );
  }
}
