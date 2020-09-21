import * as React from "react";
import { withRoutePermissionGuard } from "components/withRoutePermissionGuard";
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
  Row,
  message
} from "antd";
import { THREE_DAY_OPTIONS } from "constant";
import { TradingTimeBoard } from "../TradingTimeBoard";
import { inject } from "mobx-react";
import styles from "./index.module.scss";
import classnames from "classnames/bind";
const cx = classnames.bind(styles);

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
 * ASHARES Ａ股
 * commodity 大宗商品
 * IXIX 指数
 * 该种产品分类的栏位选项
 */
const fieldOptionsOfSymbolType = {
  HK: {
    position_type: ["T+0"],
  },
  MT: {
    position_type: ["T+0", "T+1", "T+2", "T+3"],
  },
  ASHARES: {
    position_type: ["T+0", "T+1"],
  },
};
// 找不到产品选项时的预设值
const defaultFieldOptionsOfSymbolType = {
  position_type: ["T+0", "T+1", "T+2", "T+3"],
};
// 栏位资讯
const infoOfField = {
  type_display: { label: "交易类型", },
  name: { label: "产品名称", },
  decimals_place: { label: "小位数", },
  description: { label: "描述", },
  transaction_mode: { label: "成交模式", },
  profit_currency: { label: "获利货币", },
  margin_currency: { label: "预付款货币", },
  orders_mode: { label: "挂单模式", },
  volume_step: { label: "交易数步长", },
  contract_size: { label: "合约大小", },
  position_type: { label: "持仓类型", },
  max_position_days: { label: "持仓天数", },
  leverage: { label: "杠杆", },
  calculate_for_buy_hands_fee: { label: "买入手续费计算", },
  calculate_for_sell_hands_fee: { label: "卖出手续费计算", },
  hands_fee_for_buy: { label: "买入手续费率", },
  hands_fee_for_sell: { label: "卖出手续费率", },
  calculate_for_buy_tax: { label: "买入税费计算", },
  calculate_for_sell_tax: { label: "卖出税费计算", },
  tax_for_buy: { label: "买入税率", },
  tax_for_sell: { label: "卖出税率", },
  calculate_for_buy_stock_fee: { label: "买入库存费计算(多)", },
  calculate_for_sell_stock_fee: { label: "卖出库存费計算(空)", },
  purchase_fee: { label: "买入库存费率(多)", },
  selling_fee: { label: "卖出库存费率(空)", },
  max_lots: { label: "最大手数", },
  min_lots: { label: "最小手数", },
  spread: { label: "点差", },
  spread_mode: { label: "点差模式", },
  calculate_for_cash_deposit: { label: "保证金计算", },
  profit_calculate_for_bought: { label: "盈亏计算(多)", },
  profit_calculate_for_sale: { label: "盈亏计算(空)", },
  three_days_swap: { label: "三日库存费", },
  status: { label: "是否可用", },
};

const spreadModeOptions = [
  {
    field: "fix",
    translation: "固定点差",
  },
  {
    field: "float",
    translation: "浮动点差",
  }
];
@withRoutePermissionGuard("/dashboard/exchange/product/editor", {
  exact: false,
})
@Form.create()
@inject("common", "product")
export default class ProductEditor extends BaseReact {
  state = {
    scopes,
    rulesOfScope: {},
    formItemLayout: {
      labelCol: { span: 4, },
      wrapperCol: { span: 12, },
    },
    fieldOptions: {},
    transactionModeOptions: [],
    orderModeOptions: [],
    currencyOptions: [],
    spreadModeOptions,
    tradingTime: [],
  };

  componentDidMount() {
    this.init();
  }
  init = async () => {
    const { scopes, } = this.state;
    const parsedQueryString = this.$qs.parse(this.props.location.search);
    const { id, } = parsedQueryString;
    const { setFieldsValue, } = this.props.form;
    const res = await this.$api.product.getCurrentProduct(id);
    // console.log("res.data :>> ", res.data);
    const initFieldValue = this.mapApiDataToFieldValue(res.data);
    const fieldOptions =
      fieldOptionsOfSymbolType[res.data.code] ||
      defaultFieldOptionsOfSymbolType;
    const tradingTime = res.data.trading_times_display;
    this.setState({ fieldOptions, tradingTime, });
    setFieldsValue(initFieldValue);

    this.getRulesOfScope();
    this.getTransactionModeOptions();
    this.getOrderModeOptions();
    this.getCurrencyOptions();
  };
  getRulesOfScope = async () => {
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
  getTransactionModeOptions = async () => {
    const res = await this.$api.product.getTransactionModeOptions();
    this.setState({
      transactionModeOptions: res.data.data,
    });
    // console.log("transactionModeOptions :>> ", res);
  };
  getOrderModeOptions = async () => {
    const res = await this.$api.product.getOrderModeOptions();
    // console.log("orderModeOptions :>> ", res);
    this.setState({
      orderModeOptions: res.data.data,
    });
  };
  getCurrencyOptions = async () => {
    const res = await this.$api.common.getConstantByKey(
      "system_currency_choices"
    );
    // console.log("currencyOptions :>> ", res);
    this.setState({
      currencyOptions: res.data.data,
    });
  };

  mapApiDataToFieldValue = input => {
    // 将 api 回传格式转为栏位值
    const payload = { ...input, };

    payload.leverage = payload.leverage ? payload.leverage.split(",") : [];
    return payload;
  };
  mapFieldValueToApiData = input => {
    // 将表单栏位值转为 api 吃的格式
    const payload = { ...input, };
    payload.leverage = payload.leverage.join(",");
    return payload;
  };
  getRulesOfField = fieldName => {
    const scope = scopeOfField[fieldName];
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
      const res = await this.$api.product.updateProduct(id, payload);
      if (res.status === 200) {
        message.success("编辑成功");
        this.props.product.getProductList();
        this.props.history.push("/dashboard/exchange/product");
      } else {
        message.error("表单送出失败，请确认");
      }
      console.log("payload :>> ", payload);
      console.log("res :>> ", res);
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
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(
                    <Input type="text" disabled={true} />
                  )}
                </Form.Item>
              );
            })("type_display")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(
                    <Input type="text" disabled={true} />
                  )}
                </Form.Item>
              );
            })("name")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(
                    <InputNumber className={cx("input-number")} min={0} />
                  )}
                </Form.Item>
              );
            })("decimals_place")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(<Input.TextArea autoSize />)}
                </Form.Item>
              );
            })("description")}
            {(name => {
              const info = infoOfField[name];
              const options = fieldOptions[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  <Tooltip
                    title="T+0 (可多可空)、T+1 (只能作多)"
                    placement="topLeft"
                  >
                    {getFieldDecorator(name, {
                      rules: [
                        {
                          required: true,
                          message: "必填",
                        }
                      ],
                    })(
                      <Select mode="tags" placeholder="Please select">
                        {options &&
                          options.map(option => (
                            <Select.Option key={option} value={option}>
                              {option}
                            </Select.Option>
                          ))}
                      </Select>
                    )}
                  </Tooltip>
                </Form.Item>
              );
            })("position_type")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(
                    <InputNumber className={cx("input-number")} />
                  )}
                </Form.Item>
              );
            })("max_position_days")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  <Tooltip
                    title="最多3个，以 , 符号区隔，例如： 1,2,3"
                    placement="topLeft"
                  >
                    {getFieldDecorator(name, {
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
                    })(
                      <Select
                        mode="tags"
                        tokenSeparators={[","]}
                        open={false}
                      />
                    )}
                  </Tooltip>
                </Form.Item>
              );
            })("leverage")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name, {
                    rules: [
                      {
                        required: true,
                        message: "必填",
                      }
                    ],
                  })(
                    <Select optionLabelProp="label" placeholder="Please select">
                      {this.state.transactionModeOptions.map(each => (
                        <Select.Option
                          key={each.field}
                          value={each.field}
                          label={each.translation}
                        >
                          {each.translation}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })("transaction_mode")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name, {
                    rules: [
                      {
                        required: true,
                        message: "必填",
                      }
                    ],
                  })(
                    <Select optionLabelProp="label" placeholder="Please select">
                      {this.state.orderModeOptions.map(each => (
                        <Select.Option
                          key={each.field}
                          value={each.field}
                          label={each.translation}
                        >
                          {each.translation}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })("orders_mode")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name, {
                    rules: [
                      {
                        required: true,
                        message: "必填",
                      }
                    ],
                  })(
                    <Select optionLabelProp="label" placeholder="Please select">
                      {this.state.currencyOptions.map(each => (
                        <Select.Option
                          key={each.field}
                          value={each.field}
                          label={each.translation}
                        >
                          {each.translation}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })("profit_currency")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name, {
                    rules: [
                      {
                        required: true,
                        message: "必填",
                      }
                    ],
                  })(
                    <Select optionLabelProp="label" placeholder="Please select">
                      {this.state.currencyOptions.map(each => (
                        <Select.Option
                          key={each.field}
                          value={each.field}
                          label={each.translation}
                        >
                          {each.translation}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })("margin_currency")}

            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(
                    <InputNumber className={cx("input-number")} min={0} />
                  )}
                </Form.Item>
              );
            })("volume_step")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name, {
                    rules: [
                      {
                        required: true,
                        message: "必填",
                      }
                    ],
                  })(<InputNumber className={cx("input-number")} min={0} />)}
                </Form.Item>
              );
            })("contract_size")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  <Tooltip title="不限制请填 -1" placement="topLeft">
                    {getFieldDecorator(name, {
                      rules: [
                        {
                          required: true,
                          message: "最大手数必填，如不限制请填 -1",
                        }
                      ],
                    })(<InputNumber className={cx("input-number")} min={-1} />)}
                  </Tooltip>
                </Form.Item>
              );
            })("max_lots")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name, {
                    rules: [
                      {
                        required: true,
                        message: "最小手数必填",
                      }
                    ],
                  })(<InputNumber className={cx("input-number")} min={1} />)}
                </Form.Item>
              );
            })("min_lots")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(
                    <InputNumber className={cx("input-number")} />
                  )}
                </Form.Item>
              );
            })("spread")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(
                    <Select optionLabelProp="label" placeholder="Please select">
                      {this.renderClearOption()}
                      {this.state.spreadModeOptions.map(each => (
                        <Select.Option
                          key={each.field}
                          value={each.field}
                          label={each.translation}
                        >
                          {each.translation}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })("spread_mode")}
            {renderGroupHeader("税费计算")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(
                    <Select placeholder="Please select">
                      {this.getRulesOfField(name).map(rule => (
                        <Select.Option key={rule.id} value={rule.func_name}>
                          {rule.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })("calculate_for_buy_tax")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(
                    <Select placeholder="Please select">
                      {this.getRulesOfField(name).map(rule => (
                        <Select.Option key={rule.id} value={rule.func_name}>
                          {rule.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })("calculate_for_sell_tax")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(<InputPercent />)}
                </Form.Item>
              );
            })("tax_for_buy")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(<InputPercent />)}
                </Form.Item>
              );
            })("tax_for_sell")}
            {renderGroupHeader("保证金计算")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name, {
                    rules: [
                      {
                        required: true,
                        message: "必填",
                      }
                    ],
                  })(
                    <Select placeholder="Please select">
                      {this.getRulesOfField(name).map(rule => (
                        <Select.Option key={rule.id} value={rule.func_name}>
                          {rule.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })("calculate_for_cash_deposit")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name, {
                    rules: [
                      {
                        required: true,
                        message: "必填",
                      }
                    ],
                  })(
                    <Select placeholder="Please select">
                      {this.getRulesOfField(name).map(rule => (
                        <Select.Option key={rule.id} value={rule.func_name}>
                          {rule.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })("profit_calculate_for_bought")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name, {
                    rules: [
                      {
                        required: true,
                        message: "必填",
                      }
                    ],
                  })(
                    <Select placeholder="Please select">
                      {this.getRulesOfField(name).map(rule => (
                        <Select.Option key={rule.id} value={rule.func_name}>
                          {rule.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })("profit_calculate_for_sale")}
            {renderGroupHeader("利润设定")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(
                    <Select optionLabelProp="label" placeholder="Please select">
                      {renderClearOption()}
                      {this.getRulesOfField(name).map(rule => (
                        <Select.Option
                          key={rule.id}
                          value={rule.func_name}
                          label={rule.name}
                        >
                          {rule.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })("calculate_for_buy_hands_fee")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(
                    <Select optionLabelProp="label" placeholder="Please select">
                      {renderClearOption()}
                      {this.getRulesOfField(name).map(rule => (
                        <Select.Option
                          key={rule.id}
                          value={rule.func_name}
                          label={rule.name}
                        >
                          {rule.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })("calculate_for_sell_hands_fee")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(<InputPercent />)}
                </Form.Item>
              );
            })("hands_fee_for_buy")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(<InputPercent />)}
                </Form.Item>
              );
            })("hands_fee_for_sell")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(
                    <Select optionLabelProp="label" placeholder="Please select">
                      {renderClearOption()}
                      {this.getRulesOfField(name).map(rule => (
                        <Select.Option
                          key={rule.id}
                          value={rule.func_name}
                          label={rule.name}
                        >
                          {rule.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })("calculate_for_buy_stock_fee")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(
                    <Select optionLabelProp="label" placeholder="Please select">
                      {renderClearOption()}
                      {this.getRulesOfField(name).map(rule => (
                        <Select.Option
                          key={rule.id}
                          value={rule.func_name}
                          label={rule.name}
                        >
                          {rule.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })("calculate_for_sell_stock_fee")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(<InputPercent />)}
                </Form.Item>
              );
            })("purchase_fee")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(<InputPercent />)}
                </Form.Item>
              );
            })("selling_fee")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item
                  data-name={name}
                  label={info.label}
                  {...formItemLayout}
                >
                  {getFieldDecorator(name)(
                    <Select optionLabelProp="label" placeholder="Please select">
                      {renderClearOption()}
                      {THREE_DAY_OPTIONS.map(day => (
                        <Select.Option
                          key={day.id}
                          value={day.name}
                          label={day.name}
                        >
                          {day.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              );
            })("three_days_swap")}
            {renderGroupHeader("交易时段")}
            <Row>
              <Col span={16}>
                <TradingTimeBoard data={this.state.tradingTime} />
              </Col>
            </Row>
            {renderGroupHeader("其他设定")}
            {(name => {
              const info = infoOfField[name];
              return (
                <Form.Item label={info.label} required {...formItemLayout}>
                  {getFieldDecorator(name)(
                    <Radio.Group>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              );
            })("status")}
            <Row>
              <Col span={16} className={cx("button-group")}>
                <Button
                  className={cx("button")}
                  onClick={() => this.props.history.go(-1)}
                >
                  取消
                </Button>
                <Button
                  className={cx("button")}
                  type="primary"
                  onClick={this.handleSubmit}
                >
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
