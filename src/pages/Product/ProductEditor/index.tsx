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
import Validator from "utils/validator";
import { inject, observer } from "mobx-react";
import utils from "utils";
import cloneDeep from "lodash/cloneDeep";
import { WeeklyOrder, THREE_DAY_OPTIONS, WeeklyMap } from "constant";
import moment from "moment";

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const TextArea = Input.TextArea;
const radioStyle = { display: "block", marginBottom: 12, };
const RangePicker = DatePicker.RangePicker;

const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

export interface IProductEditorProps {}

export interface IProductEditorState {}

// @ts-ignore
@Form.create()
@inject("common", "product")
@observer
export default class ProductEditor extends BaseReact<
IProductEditorProps,
IProductEditorState
> {
  state = {
    mode: "add",
    typeOptions: [],
    marketOptions: [],
    transactionModeOptions: [],
    bgColorOptions: [],
    currencyOptions: [],
    orderModeOptions: [],
    deposit_rule_options: [],
    profit_bounght_rule_options: [],
    profit_sale_rule_options: [],
    margin_rule_options: [], // 保证金
    profit_rule_options: [], // 盈亏计算
    pre_pay_rule_options: [], // 预付款
    delay_rule_options: [], // 库存费
    tax_rule_options: [], // 税金
    fee_rule_options: [],
  };

  async componentDidMount() {
    this.init();
    this.getGenreOptions(); // 获取品种类型
    this.getMarketOptions(); // 获取行情产品类型
    this.getTransactionModeOptions(); // 获取成交模式
    this.getBgColorOptions(); // 获取背景色
    this.getCurrencyOptions(); // 获取货币类型
    this.getOrderModeOptions(); // 获取挂单模式
    this.getDifferentScopeOptions(); // 获取不同 scope 下的计算规则
  }

  componentWillUnmount() {
    this.props.product.setCurrentProduct({}, true, false);
  }

  init = async () => {
    const search = this.$qs.parse(this.props.location.search);

    this.setState(
      {
        mode: search.id == 0 ? "add" : "edit",
      },
      async () => {
        const currentProduct = utils.getLStorage("currentProduct");

        if (currentProduct) {
          confirm({
            title: "行情产品恢复操作",
            content:
              "检测到您存在未提交的行情产品记录，请问是否从上次编辑中恢复状态？",
            onOk: () => {
              this.props.product.setCurrentProduct(currentProduct);
            },
            onCancel: () => {
              this.init();
              utils.rmLStorage("currentProduct");
            },
          });
        } else {
          if (this.state.mode === "edit") {
            await this.$store.product.getCurrentProduct(search.id);
          } else {
            this.props.product.setCurrentProduct({}, true, false);
          }
        }
      }
    );
  };

  getDifferentScopeOptions = () => {
    const scopes = [
      "margin_rule",
      "profit_rule",
      "pre_pay_rule",
      "delay_rule",
      "tax_rule",
      "fee_rule"
    ];

    scopes.forEach(scope => {
      this.getScopeOptions(scope);
    });
  };
  getScopeOptions = async (scope?) => {
    const res = await this.$api.product.getRuleList({
      params: {
        scope,
      },
    });

    this.setState({
      [`${scope}_options`]: res.data.results,
    });
  };

  getGenreOptions = async () => {
    const res = await this.$api.product.getGenreList({ offset: 0, limit: 200, });
    this.setState({
      typeOptions: res.data.results,
    });
  };

  getMarketOptions = async () => {
    const res = await this.$api.product.getProductList({
      offset: 0,
      limit: 200,
    });
    this.setState({
      marketOptions: res.data.results,
      marketMeta: {
        total: res.count,
      },
    });
  };

  getTransactionModeOptions = async () => {
    const res = await this.$api.product.getTransactionModeOptions({
      page: 1,
      page_size: 200,
    });

    if (res.status == 200) {
      this.setState({
        transactionModeOptions: res.data.data || [],
      });
    }
  };

  getBgColorOptions = async () => {
    const res = await this.$api.product.getBgColorOptions({
      page: 1,
      page_size: 200,
    });

    if (res.status == 200) {
      this.setState({
        bgColorOptions: res.data.data || [],
      });
    }
  };

  getCurrencyOptions = async () => {
    // const res = await this.$api.exchange.getProfitOptioins({ page: 1, page_size: 200, });

    const res = await this.$api.common.getConstantByKey(
      "system_currency_choices"
    );
    this.setState({
      currencyOptions: res.data.data,
    });
  };

  getOrderModeOptions = async () => {
    const res = await this.$api.product.getOrderModeOptions({
      page: 1,
      page_size: 200,
    });

    if (res.status == 200) {
      this.setState({
        orderModeOptions: res.data.data || [],
      });
    }
  };

  renderEditor = () => {
    const { getFieldDecorator, } = this.props.form;
    const {
      setCurrentProduct,
      currentShowProduct,
      currentProduct,
    } = this.props.product;
    const {
      typeOptions,
      marketOptions,
      transactionModeOptions,
      bgColorOptions,
      currencyOptions,
      orderModeOptions,
      margin_rule_options,
      profit_rule_options,
      tax_rule_options,
      fee_rule_options,
      delay_rule_options,
    } = this.state;
    // console.log('delay_rule_options', delay_rule_options);

    return (
      <Form className="editor-form">
        <FormItem>
          <h2 className="editor-form-title form-title">基本配置</h2>
        </FormItem>

        <FormItem label="产品名称" {...getFormItemLayout(3, 12)} required>
          {getFieldDecorator("name", {
            initialValue: currentShowProduct && currentShowProduct.name,
          })(
            <Input
              placeholder="请输入产品名称"
              onChange={evt => {
                setCurrentProduct(
                  {
                    name: evt.target.value,
                  },
                  false
                );
              }}
              style={{ display: "inline-block", width: 200, }}
            />
          )}
          {/* <span style={{ color: 'rgb(153, 153, 153)', fontSize: 12, marginLeft: 8, }}>*</span> */}
        </FormItem>
        <FormItem
          label="行情产品"
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
          required
        >
          {getFieldDecorator("product", {
            initialValue:
              currentShowProduct.product &&
              currentShowProduct.product.toString(),
          })(
            <Select
              // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择行情产品"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    product: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {marketOptions.map(item => (
                // @ts-ignore
                <Option key={item.id.toString()}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="小位数" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("decimals_place", {
            initialValue:
              currentShowProduct && currentShowProduct.decimals_place,
          })(
            <InputNumber
              min={0}
              type="number"
              placeholder="请输入小位数"
              onChange={value => {
                setCurrentProduct(
                  {
                    decimals_place: value,
                  },
                  false
                );
              }}
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem label="描述" {...getFormItemLayout(3, 8)}>
          {getFieldDecorator("description", {
            initialValue: currentShowProduct && currentShowProduct.description,
            rules: [],
          })(
            <TextArea
              placeholder="请输入产品描述"
              rows={6}
              onChange={evt => {
                setCurrentProduct(
                  {
                    description: evt.target.value,
                  },
                  false
                );
              }}
            />
          )}
        </FormItem>
        <FormItem
          label="交易品种类型"
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
          required
        >
          {getFieldDecorator("type", {
            initialValue:
              currentShowProduct.type && currentShowProduct.type.toString(),
          })(
            <Select
              // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择交易品种类型"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    type: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {typeOptions.map(item => (
                // @ts-ignore
                <Option key={item.id.toString()}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem
          label="成交模式"
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
          required
        >
          {getFieldDecorator("transaction_mode", {
            initialValue:
              currentShowProduct.transaction_mode != null &&
              currentShowProduct.transaction_mode.toString(),
          })(
            <Select
              // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择成交模式"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    transaction_mode: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {transactionModeOptions.map(item => (
                // @ts-ignore
                <Option key={item.field.toString()}>{item.translation}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem
          label="背景颜色"
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
          required
        >
          {getFieldDecorator("background", {
            initialValue: currentShowProduct && currentShowProduct.background,
          })(
            <Select
              // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择背景颜色"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    background: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {bgColorOptions.map(item => (
                // @ts-ignore
                <Option key={item.field}>{item.translation}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem
          label="获利货币"
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
          required
        >
          {getFieldDecorator("profit_currency", {
            initialValue:
              currentShowProduct && currentShowProduct.profit_currency,
          })(
            <Select
              // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择获利货币"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    profit_currency: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {currencyOptions.map(item => (
                // @ts-ignore
                <Option key={item.field}>{item.translation}</Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem
          label="预付款货币"
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
          required
        >
          {getFieldDecorator("margin_currency", {
            initialValue:
              currentShowProduct && currentShowProduct.margin_currency,
          })(
            <Select
              // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择预付款货币"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    margin_currency: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {currencyOptions.map(item => (
                // @ts-ignore
                <Option key={item.field}>{item.translation}</Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem label="最大交易手数" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("max_lots", {
            initialValue:
              currentShowProduct && currentShowProduct.max_lots,
          })(
            <InputNumber
              min={0}
              type="number"
              placeholder="请输入最大交易手数"
              onChange={value => {
                setCurrentProduct(
                  {
                    max_lots: value,
                  },
                  false
                );
              }}
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem label="最小交易手数" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("min_lots", {
            initialValue:
              currentShowProduct && currentShowProduct.min_lots,
          })(
            <InputNumber
              min={0}
              type="number"
              placeholder="请输入最小交易手数"
              onChange={value => {
                setCurrentProduct(
                  {
                    min_lots: value,
                  },
                  false
                );
              }}
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem
          label="挂单模式
          "
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
          required
        >
          {getFieldDecorator("orders_mode", {
            initialValue: currentShowProduct && currentShowProduct.orders_mode,
          })(
            <Select
              // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择挂单模式"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    orders_mode: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {orderModeOptions.map(item => (
                // @ts-ignore
                <Option key={item.field}>{item.translation}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="点差" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("spread", {
            initialValue: currentShowProduct && currentShowProduct.spread,
          })(
            <InputNumber
              min={0}
              type="number"
              placeholder="请输入点差"
              onChange={value => {
                setCurrentProduct(
                  {
                    spread: value,
                  },
                  false
                );
              }}
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem
          label="点差模式"
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
          required
        >
          {getFieldDecorator("spread_mode", {
            initialValue: currentShowProduct && currentShowProduct.spread_mode,
          })(
            <Select
              // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择点差模式"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    spread_mode: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {[
                {
                  field: "fix",
                  translation: "固定点差",
                },
                {
                  field: "float",
                  translation: "浮动点差",
                }
              ].map(item => (
                // @ts-ignore
                <Option key={item.field}>{item.translation}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="止盈止损位" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("limit_stop_level", {
            initialValue:
              currentShowProduct && currentShowProduct.limit_stop_level,
          })(
            <InputNumber
              min={0}
              type="number"
              placeholder="请输入点差"
              onChange={value => {
                setCurrentProduct(
                  {
                    limit_stop_level: value,
                  },
                  false
                );
              }}
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>

        <FormItem label="交易数步长" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("lots_step", {
            initialValue: currentShowProduct && currentShowProduct.lots_step,
          })(
            <InputNumber
              min={0}
              type="number"
              placeholder="请输入交易量步长"
              onChange={value => {
                setCurrentProduct(
                  {
                    lots_step: value,
                  },
                  false
                );
              }}
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem
          label="价格变动最小单位
"
          {...getFormItemLayout(3, 12)}
        >
          {getFieldDecorator("min_unit_of_price_change", {
            initialValue:
              currentShowProduct && currentShowProduct.min_unit_of_price_change,
          })(
            <InputNumber
              min={0}
              type="number"
              placeholder="请输入价格变动最小单位
          "
              onChange={value => {
                setCurrentProduct(
                  {
                    min_unit_of_price_change: value,
                  },
                  false
                );
              }}
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem>
          <h2 className="editor-form-title form-title">保证金计算</h2>
        </FormItem>

        <FormItem label="合约大小" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("contract_size", {
            initialValue: currentShowProduct && currentShowProduct.contract_size,
          })(
            <InputNumber
              min={0}
              type="number"
              placeholder="请输入合约大小"
              onChange={value => {
                setCurrentProduct(
                  {
                    contract_size: value,
                  },
                  false
                );
              }}
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem
          label="保证金计算"
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
        >
          {getFieldDecorator("calculate_for_cash_deposit", {
            initialValue:
              currentShowProduct &&
              currentShowProduct.calculate_for_cash_deposit,
          })(
            <Select
              // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择保证金计算"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    calculate_for_cash_deposit: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {margin_rule_options.map(item => (
                // @ts-ignore
                <Option key={item.func_name}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem
          label="盈亏计算（多）"
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
        >
          {getFieldDecorator("profit_calculate_for_bought", {
            initialValue:
              currentShowProduct &&
              currentShowProduct.profit_calculate_for_bought,
          })(
            <Select
              // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择盈亏计算（多）"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    profit_calculate_for_bought: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {profit_rule_options.map(item => (
                // @ts-ignore
                <Option key={item.func_name}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem
          label="盈亏计算（空）"
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
        >
          {getFieldDecorator("profit_calculate_for_sale", {
            initialValue:
              currentShowProduct && currentShowProduct.profit_calculate_for_sale,
          })(
            <Select
              // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择盈亏计算（空）"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    profit_calculate_for_sale: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {profit_rule_options.map(item => (
                // @ts-ignore
                <Option key={item.func_name}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem>
          <h2 className="editor-form-title form-title">利润设定</h2>
        </FormItem>
        <FormItem label="买入库存费（%）" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("purchase_fee", {
            initialValue: currentShowProduct && currentShowProduct.purchase_fee,
          })(
            <InputNumber
              type="number"
              placeholder="请输入买入库存费
            "
              onChange={value => {
                setCurrentProduct(
                  {
                    purchase_fee: value,
                  },
                  false
                );
              }}
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem label="卖出库存费（%）" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("selling_fee", {
            initialValue: currentShowProduct && currentShowProduct.selling_fee,
          })(
            <InputNumber
              type="number"
              placeholder="请输入卖出库存费"
              onChange={value => {
                setCurrentProduct(
                  {
                    selling_fee: value,
                  },
                  false
                );
              }}
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem
          label="库存费计算"
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
        >
          {getFieldDecorator("calculate_for_fee", {
            initialValue:
            currentShowProduct && currentShowProduct.calculate_for_fee,
          })(
            <Select
            // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择税金计算"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    calculate_for_fee: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {delay_rule_options.map(item => (
              // @ts-ignore
                <Option key={item.func_name}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem
          label="三日库存费"
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
        >
          {getFieldDecorator("three_days_swap", {
            initialValue:
            currentShowProduct && currentShowProduct.three_days_swap,
          })(
            <Select
            // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择三日库存费"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    three_days_swap: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {THREE_DAY_OPTIONS.map(item => (
              // @ts-ignore
                <Option key={item.id}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem
          label="买入手续费"
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
        >
          {getFieldDecorator("hands_fee_for_bought", {
            initialValue:
            currentShowProduct && currentShowProduct.hands_fee_for_bought,
          })(
            <Select
            // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择买入手续费"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    hands_fee_for_bought: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {fee_rule_options.map(item => (
              // @ts-ignore
                <Option key={item.func_name}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem
          label="卖出手续费"
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
        >
          {getFieldDecorator("hands_fee_for_sale", {
            initialValue:
            currentShowProduct && currentShowProduct.hands_fee_for_sale,
          })(
            <Select
            // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请输入卖出手续费"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    hands_fee_for_sale: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {fee_rule_options.map(item => (
              // @ts-ignore
                <Option key={item.func_name}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem
          label="税金计算"
          className="push-type-select"
          {...getFormItemLayout(3, 6)}
        >
          {getFieldDecorator("calculate_for_tax", {
            initialValue:
            currentShowProduct && currentShowProduct.calculate_for_tax,
          })(
            <Select
            // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择税金计算"
              onChange={(value, elem: any) => {
                setCurrentProduct(
                  {
                    calculate_for_tax: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {tax_rule_options.map(item => (
              // @ts-ignore
                <Option key={item.func_name}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem>
          <h2 className="editor-form-title form-title">交易时间段</h2>
        </FormItem>
        <Row style={{ marginBottom: 10, textAlign: "center", fontWeight: 500, }}>
          <Col span={3}>交易日</Col>
          <Col span={6}>上午交易时间</Col>
          <Col span={6}>下午交易时间</Col>
        </Row>
        {!utils.isEmpty(currentShowProduct.trading_times) && (
          <>
            {currentShowProduct.trading_times.map((item, index) => {
              return (
                <FormItem
                  key={item.day}
                  label={WeeklyMap[item.day]}
                  {...getFormItemLayout(3, 16)}
                >
                  <TimePicker
                    style={{ marginRight: 10, width: 200, }}
                    placeholder={"请输入上午交易开始时间"}
                    value={item.trades && item.trades[0]}
                    onChange={time => {
                      const tradeMap = {};
                      const copy = currentProduct.trading_times
                        ? cloneDeep(JSON.parse(currentProduct.trading_times))
                        : tradeMap;

                      if (utils.isEmpty(copy)) {
                        WeeklyOrder.forEach(item => {
                          copy[item] = {
                            trades: [],
                          };
                        });
                      }
                      // if (!copy[item.day].trades ) {
                      //   copy[item.day].trades  = [];
                      // }
                      copy[item.day].trades[0] = time.unix();
                      // console.log(copy);
                      setCurrentProduct(
                        {
                          trading_times: JSON.stringify(copy),
                        },
                        false
                      );

                      setCurrentProduct(
                        {
                          trading_times: JSON.stringify(copy),
                        },
                        false
                      );
                    }}
                  />
                  <TimePicker
                    value={item.trades && item.trades[1]}
                    placeholder={"请输入上午交易结束时间"}
                    style={{ marginRight: 10, width: 200, }}
                    onChange={time => {
                      const tradeMap = {};
                      const copy = currentProduct.trading_times
                        ? cloneDeep(JSON.parse(currentProduct.trading_times))
                        : tradeMap;

                      if (utils.isEmpty(copy)) {
                        WeeklyOrder.forEach(item => {
                          copy[item] = {
                            trades: [],
                          };
                        });
                      }
                      copy[item.day].trades[1] = time.unix();
                      setCurrentProduct(
                        {
                          trading_times: JSON.stringify(copy),
                        },
                        false
                      );
                    }}
                  />
                  <TimePicker
                    value={item.trades && item.trades[2]}
                    placeholder={"请输入下午交易开始时间"}
                    style={{ marginRight: 10, width: 200, }}
                    onChange={time => {
                      const tradeMap = {};
                      const copy = currentProduct.trading_times
                        ? cloneDeep(JSON.parse(currentProduct.trading_times))
                        : tradeMap;

                      if (utils.isEmpty(copy)) {
                        WeeklyOrder.forEach(item => {
                          copy[item] = {
                            trades: [],
                          };
                        });
                      }
                      copy[item.day].trades[2] = time.unix();
                      setCurrentProduct(
                        {
                          trading_times: JSON.stringify(copy),
                        },
                        false
                      );
                    }}
                  />
                  <TimePicker
                    value={item.trades && item.trades[3]}
                    placeholder={"请输入下午交易结束时间"}
                    style={{ marginRight: 10, width: 200, }}
                    onChange={time => {
                      const tradeMap = {};
                      const copy = currentProduct.trading_times
                        ? cloneDeep(JSON.parse(currentProduct.trading_times))
                        : tradeMap;

                      if (utils.isEmpty(copy)) {
                        WeeklyOrder.forEach(item => {
                          copy[item] = {
                            trades: [],
                          };
                        });
                      }
                      copy[item.day].trades[3] = time.unix();
                      setCurrentProduct(
                        {
                          trading_times: JSON.stringify(copy),
                        },
                        false
                      );
                    }}
                  />
                </FormItem>
              );
            })}
          </>
        )}
        <FormItem className="editor-form-btns">
          <Button onClick={this.goBack}>取消</Button>
          {
            <Button
              disabled={currentProduct.id}
              type="primary"
              onClick={this.handleSubmit}
            >
              {this.state.mode == "edit" ? "确认修改" : "保存"}
            </Button>
          }
        </FormItem>
      </Form>
    );
  };

  goBack = () => {
    setTimeout(() => {
      this.props.history.goBack();
      this.props.product.setCurrentProduct({});
      utils.rmLStorage("currentProduct");
    }, 300);
  };

  handleSubmit = async evt => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { currentProduct, } = this.props.product;
        const { mode, } = this.state;
        let payload: any = {
          name: currentProduct.name,
          type: currentProduct.type,
          product: currentProduct.product,
          decimals_place: currentProduct.decimals_place,
          contract_size: currentProduct.contract_size,
          spread: currentProduct.spread,
          limit_stop_level: currentProduct.limit_stop_level,
          margin_currency: currentProduct.margin_currency,
          profit_currency: currentProduct.profit_currency,
          max_lots: currentProduct.max_lots,
          min_lots: currentProduct.min_lots,
          lots_step: currentProduct.lots_step,
          min_unit_of_price_change: currentProduct.min_unit_of_price_change,
          transaction_mode: currentProduct.transaction_mode,
          purchase_fee: currentProduct.purchase_fee,
          selling_fee: currentProduct.selling_fee,
          description: currentProduct.description,
          background: currentProduct.background,
          orders_mode: currentProduct.orders_mode,
          hands_fee_for_bought: currentProduct.hands_fee_for_bought,
          hands_fee_for_sale: currentProduct.hands_fee_for_sale,
          three_days_swap: currentProduct.three_days_swap,
          trading_times: currentProduct.trading_times,
          calculate_for_cash_deposit: currentProduct.calculate_for_cash_deposit,
          profit_calculate_for_bought:
            currentProduct.profit_calculate_for_bought,
          profit_calculate_for_sale: currentProduct.profit_calculate_for_sale,
          calculate_for_fee: currentProduct.calculate_for_fee,
          calculate_for_tax: currentProduct.calculate_for_tax,
          spread_mode: currentProduct.spread_mode,
        };

        // console.log('payload', payload);
        const errMsg = this.getValidation(payload);
        // payload.trading_times = JSON.stringify(payload.trading_times);
        if (errMsg) return this.$msg.warn(errMsg);
        if (mode == "add") {
          const res = await this.$api.product.createProduct(payload);

          if (res.status == 201) {
            this.$msg.success("交易品种创建成功");
            setTimeout(() => {
              this.goBack();
              this.props.product.getProductList({
                current_page: this.props.product.filterProduct.current_page,
                page_size: this.props.product.filterProduct.page_size,
              });
            }, 1500);
          }
        } else {
          const res = await this.$api.product.updateProduct(
            currentProduct.id,
            payload
          );

          if (res.status == 200) {
            this.$msg.success("交易品种更新成功");
            setTimeout(() => {
              this.goBack();
              this.props.product.getProductList({
                current_page: this.props.product.filterProduct.current_page,
                page_size: this.props.product.filterProduct.page_size,
              });
            }, 1500);
          }
        }
      }
    });
  };

  getValidation = (payload: any) => {
    const validator = new Validator();

    validator.add(payload.name, [
      {
        strategy: "isNonEmpty",
        errMsg: "请输入交易品种名字",
      }
    ]);

    validator.add(payload.type, [
      {
        strategy: "isNonEmpty",
        errMsg: "请选择交易品种类型",
      }
    ]);

    validator.add(payload.product, [
      {
        strategy: "isNonEmpty",
        errMsg: "请选择行情产品",
      }
    ]);

    validator.add(payload.margin_currency, [
      {
        strategy: "isNonEmpty",
        errMsg: "请选择预售货币款",
      }
    ]);

    validator.add(payload.profit_currency, [
      {
        strategy: "isNonEmpty",
        errMsg: "请选择获利货币",
      }
    ]);

    validator.add(payload.transaction_mode, [
      {
        strategy: "isNonEmpty",
        errMsg: "请选择成交模式",
      }
    ]);

    let errMsg: any = validator.start();
    if (!payload.trading_times) {
      errMsg = "请设置交易时间段";
    } else {
      for (let i = 0; i < WeeklyOrder.length; i++) {
        let dayKey = WeeklyOrder[i];
        let dayValue = WeeklyMap[dayKey];
        let trading_times = JSON.parse(payload.trading_times);
        let day: any = trading_times[dayKey];

        if (utils.isEmpty(day.trades)) {
          errMsg = `请输入 ${dayValue} 的交易时间段`;
          break;
        } else {
          if (day.trades[1] < day.trades[0]) {
            errMsg = `${dayValue} 的上午交易结束时间不得小于开始时间`;
            break;
          }

          if (day.trades[2] < day.trades[1]) {
            errMsg = `${dayValue} 的下午交易开始时间不得小于上午交易结束时间`;
            break;
          }

          if (day.trades[3] < day.trades[2]) {
            errMsg = `${dayValue} 的下午交易结束时间不得小于开始时间`;
            break;
          }
        }
      }
    }

    return errMsg;
  };

  render() {
    return (
      <div className="editor food-card-editor">
        <section className="editor-content panel-block">
          {this.renderEditor()}
        </section>
      </div>
    );
  }
}
