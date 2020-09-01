import * as React from "react";
import { BaseReact } from "components/BaseReact";
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Radio,
  InputNumber,
  DatePicker,
  TimePicker,
  Row,
  Col
} from "antd";
import "./index.scss";
import { inject } from "mobx-react";

const FormItem = Form.Item;
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
const scopeOfFields = {
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
  position_type: ["T+0（多空）", "T+1（多）"],
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
    scopeOfFields,
    ruleOfScope: {},
    formLayout: "horizontal",
    formItemLayout: {
      labelCol: { span: 4, },
      wrapperCol: { span: 14, },
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

    const ruleList = await Promise.all(
      scopes.map(scope =>
        this.$api.product.getRuleList({
          params: {
            scope,
          },
        })
      )
    );
    // console.log("res :>> ", res);
    const fieldValue = this.formatResponseDataToFieldValue(res.data);
    setFieldsValue(fieldValue);
    // console.log("ruleList :>> ", ruleList);
    // console.log(
    //   "ruleList :>> ",
    //   ruleList.map(each => each.data.results)
    // );
    const ruleOfScope = {};
    ruleList
      .map(each => each.data.results)
      .forEach((rule, index) => {
        const scope = scopes[index];
        ruleOfScope[scope] = rule;
      });
    this.setState({ ruleOfScope, });
    // console.log("this.state.ruleOfScope :>> ", this.state.ruleOfScope);
  };
  formatResponseDataToFieldValue = data => {
    data.leverage = data.leverage.split(",");
    return data;
  };
  getRuleOfField = fieldName => {
    const scope = this.state.scopeOfFields[fieldName];
    const rule = this.state.ruleOfScope[scope];
    return rule || [];
  };

  render() {
    // const { currentGenre, setCurrentGenre, } = this.props.exchange;
    const { getFieldDecorator, } = this.props.form;
    const { formItemLayout, } = this.state;
    // console.log("fieldsValue :>> ", this.props.form.getFieldsValue());

    return (
      <div className="editor talent-editor">
        <Form className="editor-form" layout={"horizontal"}>
          <Form.Item
            data-id="symbol_type_name"
            label="交易类型"
            {...formItemLayout}
          >
            {getFieldDecorator("symbol_type_name")(
              <Input type="text" disabled={true} />
            )}
          </Form.Item>
          <Form.Item
            data-id="position_type"
            label="持仓类型"
            {...formItemLayout}
          >
            {getFieldDecorator("position_type")(
              <Select mode="tags" placeholder="Please select">
                {selectOptions["position_type"].map(option => (
                  <Select.Option key={option}>{option}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            data-id="max_position_days"
            label="持仓天数"
            {...formItemLayout}
          >
            {getFieldDecorator("max_position_days")(
              <InputNumber type="text" />
            )}
          </Form.Item>
          <Form.Item data-id="leverage" label="杠杆" {...formItemLayout}>
            {getFieldDecorator("leverage", {
              rules: [
                {
                  required: true,
                  message: "必填",
                }
              ],
            })(<Select mode="tags" tokenSeparators={[","]} open={false} />)}
          </Form.Item>
          <Form.Item
            data-id="calculate_for_buy_hands_fee"
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
            data-id="calculate_for_sell_hands_fee"
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
            data-id="hands_fee_for_buy"
            label="买入手续费费率"
            {...formItemLayout}
          >
            {getFieldDecorator("hands_fee_for_buy")(
              <InputNumber
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace("%", "")}
              />
            )}
          </Form.Item>
          <Form.Item
            data-id="hands_fee_for_sell"
            label="卖出手续费费率"
            {...formItemLayout}
          >
            {getFieldDecorator("hands_fee_for_sell")(
              <InputNumber
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace("%", "")}
              />
            )}
          </Form.Item>
          <Form.Item
            data-id="calculate_for_buy_tax"
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
            data-id="calculate_for_sell_tax"
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
          <Form.Item data-id="tax_for_buy" label="买入税率" {...formItemLayout}>
            {getFieldDecorator("tax_for_buy")(
              <InputNumber
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace("%", "")}
              />
            )}
          </Form.Item>
          <Form.Item
            data-id="tax_for_sell"
            label="卖出税率"
            {...formItemLayout}
          >
            {getFieldDecorator("tax_for_sell")(
              <InputNumber
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace("%", "")}
              />
            )}
          </Form.Item>
          <Form.Item
            data-id="calculate_for_buy_stock_fee"
            label="买入库存费计算（作多库存费）"
            {...formItemLayout}
          >
            {getFieldDecorator("calculate_for_buy_stock_fee")(
              <Select placeholder="Please select">
                {this.getRuleOfField("calculate_for_buy_stock_fee").map(rule => (
                  <Select.Option key={rule.id} value={rule.func_name}>
                    {rule.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            data-id="calculate_for_buy_stock_fee"
            label="卖出库存费计算（作空库存费）"
            {...formItemLayout}
          >
            {getFieldDecorator("calculate_for_buy_stock_fee")(
              <Select placeholder="Please select">
                {this.getRuleOfField("calculate_for_sell_stock_fee").map(rule => (
                  <Select.Option key={rule.id} value={rule.func_name}>
                    {rule.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            data-id="purchase_fee"
            label="买入库存费率（作多库存费）"
            {...formItemLayout}
          >
            {getFieldDecorator("purchase_fee")(
              <InputNumber
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace("%", "")}
              />
            )}
          </Form.Item>

          <Form.Item
            data-id="selling_fee"
            label="卖出库存费率（作空库存费）"
            {...formItemLayout}
          >
            {getFieldDecorator("selling_fee")(
              <InputNumber
                min={-100}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace("%", "")}
              />
            )}
          </Form.Item>
          <Form.Item data-id="max_lots" label="最大手数" {...formItemLayout}>
            {getFieldDecorator("max_lots", {
              rules: [
                {
                  required: true,
                  message: "必填",
                }
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item data-id="min_lots" label="最小手数" {...formItemLayout}>
            {getFieldDecorator("min_lots", {
              rules: [
                {
                  required: true,
                  message: "必填",
                }
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            data-id="take_profit_point"
            label="止盈线"
            {...formItemLayout}
          >
            {getFieldDecorator("take_profit_point")(<Input type="text" />)}
          </Form.Item>
          <Form.Item
            data-id="stop_loss_point"
            label="止损线"
            {...formItemLayout}
          >
            {getFieldDecorator("stop_loss_point")(<Input type="text" />)}
          </Form.Item>
          <Form.Item data-id="spread" label="点差" {...formItemLayout}>
            {getFieldDecorator("spread")(<Input type="text" />)}
          </Form.Item>
          <Form.Item data-id="spread_mode" label="点差模式" {...formItemLayout}>
            {getFieldDecorator("spread_mode")(<Input type="text" />)}
          </Form.Item>
          <Form.Item
            data-id="calculate_for_cash_deposit"
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
                {this.getRuleOfField("calculate_for_cash_deposit").map(rule => (
                  <Select.Option key={rule.id} value={rule.func_name}>
                    {rule.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            data-id="profit_calculate_for_bought"
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
            data-id="profit_calculate_for_sale"
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
                {this.getRuleOfField("profit_calculate_for_sale").map(rule => (
                  <Select.Option key={rule.id} value={rule.func_name}>
                    {rule.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            data-id="three_days_swap"
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
        </Form>
      </div>
    );
  }
}

// function CustomFormItem({}) {
//   const children =
//     typeof props.children === "function"
//       ? props.children(props)
//       : props.children;
//   return <Form.Item {...props} >{children}</Form.Item>;
// }
class LagacyGenreEditor extends BaseReact<
IGenreEditorProps,
IGenreEditorState
> {
  state = {};

  async componentDidMount() {
    this.props.onRef(this);
  }

  render() {
    const { currentGenre, setCurrentGenre, } = this.props.exchange;
    const { getFieldDecorator, } = this.props.form;

    return (
      <div className="editor talent-editor">
        <Form className="editor-form">
          <FormItem label="类型名称" {...getFormItemLayout(6, 14)}>
            {getFieldDecorator("name", {
              initialValue: currentGenre.name,
              rules: [],
            })(
              <Input
                placeholder="请输入品种类型名称"
                onChange={evt => {
                  setCurrentGenre(
                    {
                      name: evt.target.value,
                    },
                    false
                  );
                }}
              />
            )}
          </FormItem>
          <FormItem
            label="是否可用"
            required
            {...getFormItemLayout(6, 14)}
            className="editor-upshelf"
          >
            {getFieldDecorator("in_use", {
              initialValue: currentGenre && currentGenre.in_use,
            })(
              <Radio.Group
                onChange={evt => {
                  setCurrentGenre(
                    {
                      in_use: evt.target.value,
                    },
                    false
                  );
                }}
              >
                <Radio style={radioStyle} value={1}>
                  是
                </Radio>
                <Radio style={radioStyle} value={0}>
                  否
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
