import * as React from "react";
import { BaseReact } from "components/BaseReact";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Tooltip,
  Button,
  Col,
  Row
} from "antd";
import { inject } from "mobx-react";
import { TradingTimeBoard } from "../TradingTimeBoard";
import styles from "./index.module.scss";
import classnames from "classnames/bind";
const cx = classnames.bind(styles);

const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});
const radioStyle = { display: "block", marginBottom: 12, };

export interface IGenreEditorProps {}

export interface IGenreEditorState {}
const scopes = [
  "margin_rule",
  "profit_rule",
  "pre_pay_rule",
  "delay_rule",
  "tax_rule",
  "fee_rule"
];
const scopeOfField = {
  calculate_for_buy_hands_fee: "fee_rule",
  calculate_for_sell_hands_fee: "fee_rule",
  calculate_for_buy_tax: "tax_rule",
  calculate_for_sell_tax: "tax_rule",
  calculate_for_buy_stock_fee: "",
  calculate_for_sell_stock_fee: "",
  profit_calculate_for_bought: "profit_rule",
  profit_calculate_for_sale: "profit_rule",
  calculate_for_cash_deposit: "margin_rule",
};
const selectOptions = {
  position_type: ["T+0", "T+1"],
  three_days_swap: ["週一", "週二", "週三", "週四", "週五", "週六", "週日"],
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
      wrapperCol: { span: 8, },
    },
  };

  componentDidMount() {
    // this.props.onRef(this);
    this.init();
  }
  init = async () => {
    const { scopes, } = this.state;
    const parsedQueryString = this.$qs.parse(this.props.location.search);
    const { id, } = parsedQueryString;
    // console.log("id :>> ", id);
    // console.log("this.props :>> ", this.props);
    // console.log("this.$api :>> ", this.$api);
    const { setFieldsValue, } = this.props.form;
    const res = await this.$api.product.getCurrentSymbolType(id);
    const fieldValue = this.mapApiDataToFieldValue(res.data);
    setFieldsValue(fieldValue);
    // console.log("res :>> ", res);

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
  mapApiDataToFieldValue = data => {
    // 将 api 回传格式转为栏位值
    data.leverage = data.leverage.split(",");
    return data;
  };
  mapFieldValueToApiData = () => {
    // TODO: 将表单栏位值转为 api 吃的格式
  };
  getRuleOfField = fieldName => {
    const scope = this.state.scopeOfFields[fieldName];
    const rule = this.state.rulesOfScope[scope];
    return rule || [];
  };
  handleSubmit = () => {
    // console.log("fieldsValue :>> ", this.props.form.getFieldsValue());
  };
  render() {
    // const { currentGenre, setCurrentGenre, } = this.props.exchange;
    const { getFieldDecorator, } = this.props.form;
    const { formItemLayout, } = this.state;

    return (
      <div className="editor">
        <section className="panel-block">
          <Form className="editor-form" layout={"horizontal"}>
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
                {getFieldDecorator("position_type")(
                  <Select mode="tags" placeholder="Please select">
                    {selectOptions["position_type"].map(option => (
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
                <InputNumber type="text" />
              )}
            </Form.Item>
            <Form.Item data-name="leverage" label="杠杆" {...formItemLayout}>
              <Tooltip title="以 , 区隔，例如： 1,2,3" placement="topLeft">
                {getFieldDecorator("leverage", {
                  rules: [
                    {
                      required: true,
                      message: "必填",
                    }
                  ],
                })(<Select mode="tags" tokenSeparators={[","]} open={false} />)}
              </Tooltip>
            </Form.Item>
            <Form.Item
              data-name="calculate_for_buy_hands_fee"
              label="买入手续费计算"
              {...formItemLayout}
            >
              {getFieldDecorator("calculate_for_buy_hands_fee")(
                <Select placeholder="Please select">
                  {this.getRuleOfField("calculate_for_buy_hands_fee").map(
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
              data-name="calculate_for_sell_hands_fee"
              label="卖出手续费计算"
              {...formItemLayout}
            >
              {getFieldDecorator("calculate_for_sell_hands_fee")(
                <Select placeholder="Please select">
                  {this.getRuleOfField("calculate_for_sell_hands_fee").map(
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
              data-name="hands_fee_for_buy"
              label="买入手续费费率"
              {...formItemLayout}
            >
              {getFieldDecorator("hands_fee_for_buy")(
                <InputPercent min={0} max={100} />
              )}
            </Form.Item>
            <Form.Item
              data-name="hands_fee_for_sell"
              label="卖出手续费费率"
              {...formItemLayout}
            >
              {getFieldDecorator("hands_fee_for_sell")(
                <InputPercent min={0} max={100} />
              )}
            </Form.Item>
            <Form.Item
              data-name="calculate_for_buy_tax"
              label="买入税费计算"
              {...formItemLayout}
            >
              {getFieldDecorator("calculate_for_buy_tax")(
                <Select placeholder="Please select">
                  {this.getRuleOfField("calculate_for_buy_tax").map(rule => (
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
                  {this.getRuleOfField("calculate_for_sell_tax").map(rule => (
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
              {getFieldDecorator("tax_for_buy")(
                <InputPercent min={0} max={100} />
              )}
            </Form.Item>
            <Form.Item
              data-name="tax_for_sell"
              label="卖出税率"
              {...formItemLayout}
            >
              {getFieldDecorator("tax_for_sell")(
                <InputPercent min={0} max={100} />
              )}
            </Form.Item>
            <Form.Item
              data-name="calculate_for_buy_stock_fee"
              label="买入库存费计算（作多库存费）"
              {...formItemLayout}
            >
              {getFieldDecorator("calculate_for_buy_stock_fee")(
                <Select placeholder="Please select">
                  {this.getRuleOfField("calculate_for_buy_stock_fee").map(
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
              data-name="calculate_for_buy_stock_fee"
              label="卖出库存费计算（作空库存费）"
              {...formItemLayout}
            >
              {getFieldDecorator("calculate_for_buy_stock_fee")(
                <Select placeholder="Please select">
                  {this.getRuleOfField("calculate_for_sell_stock_fee").map(
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
              data-name="purchase_fee"
              label="买入库存费率（作多库存费）"
              {...formItemLayout}
            >
              {getFieldDecorator("purchase_fee")(
                <InputPercent min={0} max={100} />
              )}
            </Form.Item>

            <Form.Item
              data-name="selling_fee"
              label="卖出库存费率（作空库存费）"
              {...formItemLayout}
            >
              {getFieldDecorator("selling_fee")(
                <InputPercent min={-100} max={100} />
              )}
            </Form.Item>
            <Form.Item
              data-name="max_lots"
              label="最大手数"
              {...formItemLayout}
            >
              {getFieldDecorator("max_lots", {
                rules: [
                  {
                    required: true,
                    message: "必填",
                  }
                ],
              })(<InputNumber />)}
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
                    message: "必填",
                  }
                ],
              })(<InputNumber />)}
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
              {getFieldDecorator("spread")(<InputNumber />)}
            </Form.Item>
            <Form.Item
              data-name="spread_mode"
              label="点差模式"
              {...formItemLayout}
            >
              {getFieldDecorator("spread_mode")(<Input type="text" />)}
            </Form.Item>
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
                  {this.getRuleOfField("calculate_for_cash_deposit").map(
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
              label="盈虧計算（多）"
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
                  {this.getRuleOfField("profit_calculate_for_bought").map(
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
              label="盈虧計算（空）"
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
                  {this.getRuleOfField("profit_calculate_for_sale").map(
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
              data-name="three_days_swap"
              label="三日库存费"
              {...formItemLayout}
            >
              {getFieldDecorator("three_days_swap")(
                <Select placeholder="Please select">
                  {selectOptions["three_days_swap"].map(option => (
                    <Select.Option key={option} value={option}>
                      {option}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Row>
              <Col span={12} className={cx("button-group")}>
                <Button type="primary" onClick={this.handleSubmit}>
                  提交
                </Button>
              </Col>
            </Row>
            {/* <Form.Item {...formItemLayout}>
              <TradingTimeBoard />
            </Form.Item> */}
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
