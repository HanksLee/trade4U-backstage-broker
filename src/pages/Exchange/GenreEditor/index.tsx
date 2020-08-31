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

const scopeOfFields = {
  calculate_for_buy_hands_fee: "fee_rule",
  calculate_for_sell_hands_fee: "fee_rule",
  calculate_for_buy_tax: "",
  calculate_for_sell_tax: "",
  purchase_fee: "",
  selling_fee: "",
  profit_calculate_for_bought: "profit_rule",
  profit_calculate_for_sale: "profit_rule",
};
const selectOptions = {
  position_type: ["T+0（多空）", "T+1（多）"],
  calculate_for_buy_hands_fee: [
    "买入手数 * 固定金额",
    "交易量 * 买入价 * 比例"
  ],
  calculate_for_sell_hands_fee: [
    "卖出手数 * 固定金额",
    "交易量 * 卖出价 * 比例"
  ],
  calculate_for_buy_tax: ["买入手数 * 交易合約量 * 比例 * 買入價格"],
  calculate_for_sell_tax: ["卖出手数 * 交易合約量 * 比例 * 賣出價格"],
  purchase_fee: ["买入价 * 交易量 * 库存费 / 百分比(100)"],
  selling_fee: ["賣出价 * 交易量 * 库存费 / 百分比(100)"],
  calculate_for_cash_deposit:['股票【买入价 * 交易量 / 杠杠】', '外汇【交易手数 * 1000】'],
  profit_calculate_for_bought: [
    "股票【（买入价 - 平仓价）* 交易量 * 杠杆 - 手续费 - 税金 - 库存费】",
    "股票【（平仓价 - 买入价）* 交易量 * 杠杆 - 手续费 - 税金 - 库存费】"
  ],
  profit_calculate_for_sale: [
    "股票【（买入价 - 平仓价）* 交易量 * 杠杆 - 手续费 - 税金 - 库存费】",
    "股票【（平仓价 - 买入价）* 交易量 * 杠杆 - 手续费 - 税金 - 库存费】"
  ],
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
    broker: 2,
    calculate_for_buy_hands_fee: null,
    calculate_for_buy_stock_fee: null,
    calculate_for_buy_tax: null,
    calculate_for_cash_deposit: null,
    calculate_for_sell_hands_fee: null,
    calculate_for_sell_stock_fee: null,
    calculate_for_sell_tax: null,
    code: "HK",
    hands_fee_for_buy: 0,
    hands_fee_for_sell: 0,
    id: 3,
    leverage: "2,3,4",
    max_lots: 0,
    max_position_days: null,
    min_lots: 0,
    position_type: ["T+0", "T+1"],
    profit_calculate_for_bought: null,
    profit_calculate_for_sale: null,
    purchase_fee: 0,
    selling_fee: 0,
    status: 1,
    stop_loss_point: null,
    symbol_type: 6,
    symbol_type_name: "港股",
    take_profit_point: null,
    tax_for_buy: 1,
    tax_for_sell: 0,
    three_days_swap: null,
    volume_step: 0,
  };

  componentDidMount() {
    // this.props.onRef(this);
    this.init();
  }
  init = async () => {
    const parsedQueryString = this.$qs.parse(this.props.location.search);
    const { id, } = parsedQueryString;
    // console.log("id :>> ", id);
    // console.log("this.props :>> ", this.props);
    // console.log("this.$api :>> ", this.$api);
    const res = await this.$api.product.getCurrentSymbolType(id);
    const scopes = [
      "margin_rule",
      "profit_rule",
      "pre_pay_rule",
      "delay_rule",
      "tax_rule",
      "fee_rule"
    ];
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
    // console.log(
    //   "ruleList :>> ",
    //   ruleList.map(each => each.data.results)
    // );
  };
  setFormData = (field, value) => {
    this.setState({ formData: { [field]: value, }, });
  };
  render() {
    // const { currentGenre, setCurrentGenre, } = this.props.exchange;
    const { getFieldDecorator, } = this.props.form;

    return (
      <div className="editor talent-editor">
        <Form className="editor-form">
          <Form.Item label="交易类型">{this.state.symbol_type_name}</Form.Item>
          <Form.Item data-id="position_type" label="持仓类型">
            <Select
              mode="tags"
              placeholder="Please select"
              defaultValue={[]}
              onChange={e => {
                 
                // this.setFormData("position_type");
              }}
            >
              {selectOptions["position_type"].map(option => (
                <Select.Option key={option}>{option}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item data-id="max_position_days" label="持仓天数">
            <Input type="text" />
          </Form.Item>
          <Form.Item data-id="leverage" label="杠杆">
            {getFieldDecorator("leverage", {
              rules: [
                {
                  required: true,
                  message: "必填",
                }
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            data-id="calculate_for_buy_hands_fee"
            label="买入手续费计算"
          >
            <Select
              placeholder="Please select"
              defaultValue={[]}
              onChange={e => {
                 
              }}
            >
              {selectOptions["calculate_for_buy_hands_fee"].map(option => (
                <Select.Option key={option}>{option}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            data-id="calculate_for_sell_hands_fee"
            label="卖出手续费计算"
          >
            <Select
              placeholder="Please select"
              defaultValue={[]}
              onChange={e => {
                 
              }}
            >
              {selectOptions["calculate_for_sell_hands_fee"].map(option => (
                <Select.Option key={option}>{option}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item data-id="hands_fee_for_buy" label="买入手续费费率">
            <Input type="text" />
          </Form.Item>
          <Form.Item data-id="hands_fee_for_sell" label="卖出手续费费率">
            <Input type="text" />
          </Form.Item>
          <Form.Item data-id="calculate_for_buy_tax" label="买入税费计算">
            <Select
              placeholder="Please select"
              defaultValue={[]}
              onChange={e => {
                 
              }}
            >
              {selectOptions["calculate_for_buy_tax"].map(option => (
                <Select.Option key={option}>{option}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item data-id="calculate_for_sell_tax" label="卖出税费计算">
            <Select
              placeholder="Please select"
              defaultValue={[]}
              onChange={e => {
                 
              }}
            >
              {selectOptions["calculate_for_sell_tax"].map(option => (
                <Select.Option key={option}>{option}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item data-id="tax_for_buy" label="买入税率">
            <Input type="text" />
          </Form.Item>
          <Form.Item data-id="tax_for_sell" label="卖出税率">
            <Input type="text" />
          </Form.Item>
          <Form.Item
            data-id="purchase_fee"
            label="买入库存费计算（作多库存费）"
          >
            <Select
              placeholder="Please select"
              defaultValue={[]}
              onChange={e => {
                 
              }}
            >
              {selectOptions["purchase_fee"].map(option => (
                <Select.Option key={option}>{option}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item data-id="selling_fee" label="卖出库存费计算（作空库存费）">
            <Select
              placeholder="Please select"
              defaultValue={[]}
              onChange={e => {
                 
              }}
            >
              {selectOptions["selling_fee"].map(option => (
                <Select.Option key={option}>{option}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            data-id="calculate_for_buy_stock_fee"
            label="买入库存费率（作多库存费）"
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item
            data-id="calculate_for_sell_stock_fee"
            label="卖出库存费率（作空库存费）"
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item data-id="max_lots" label="最大手数">
            {getFieldDecorator("max_lots", {
              rules: [
                {
                  required: true,
                  message: "必填",
                }
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item data-id="min_lots" label="最小手数">
            {getFieldDecorator("min_lots", {
              rules: [
                {
                  required: true,
                  message: "必填",
                }
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item data-id="take_profit_point" label="止盈线"></Form.Item>
          <Form.Item data-id="stop_loss_point" label="止损线"></Form.Item>
          <Form.Item data-id="spread" label="点差"></Form.Item>
          <Form.Item data-id="spread_mode" label="点差模式"></Form.Item>
          <Form.Item data-id="calculate_for_cash_deposit" label="保证金计算">
            {getFieldDecorator("calculate_for_cash_deposit", {
              rules: [
                {
                  required: true,
                  message: "必填",
                }
              ],
            })(
              <Select
                placeholder="Please select"
                defaultValue={[]}
                onChange={e => {
                   
                }}
              >
                {selectOptions["calculate_for_cash_deposit"].map(option => (
                  <Select.Option key={option}>{option}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            data-id="profit_calculate_for_bought"
            label="盈虧計算（多）"
          >
            {getFieldDecorator("profit_calculate_for_bought", {
              rules: [
                {
                  required: true,
                  message: "必填",
                }
              ],
            })(
              <Select
                placeholder="Please select"
                defaultValue={[]}
                onChange={e => {
                   
                }}
              >
                {selectOptions["profit_calculate_for_bought"].map(option => (
                  <Select.Option key={option}>{option}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item data-id="profit_calculate_for_sale" label="盈虧計算（空）">
            {getFieldDecorator("profit_calculate_for_sale", {
              rules: [
                {
                  required: true,
                  message: "必填",
                }
              ],
            })(
              <Select
                placeholder="Please select"
                defaultValue={[]}
                onChange={e => {
                   
                }}
              >
                {selectOptions["profit_calculate_for_sale"].map(option => (
                  <Select.Option key={option}>{option}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item data-id="three_days_swap" label="三日库存费">
            <Select
              placeholder="Please select"
              defaultValue={[]}
              onChange={e => {
                 
              }}
            >
              {selectOptions["three_days_swap"].map(option => (
                <Select.Option key={option}>{option}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

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
