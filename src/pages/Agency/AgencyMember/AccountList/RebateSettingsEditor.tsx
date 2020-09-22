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

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const TextArea = Input.TextArea;
const radioStyle = { marginBottom: 12, };
const RangePicker = DatePicker.RangePicker;

const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

export interface IRebateSettingsEditorProps {}

export interface IRebateSettingsEditorState {}

// @ts-ignore
@Form.create()
@inject("common", "agency")
@observer
export default class RebateSettingsEditor extends BaseReact<
IRebateSettingsEditorProps,
IRebateSettingsEditorState
> {
  state = {
    mode: "add",
    agent_rebate_options: [],
    currentAgentId: 0,
  };

  async componentDidMount() {
    this.init();
    this.getDifferentScopeOptions(); // 获取不同 scope 下的计算规则
  }

  componentWillUnmount() {
    this.props.agency.setCurrentRebate({}, true, false);
  }

  init = async () => {
    const search = this.$qs.parse(this.props.location.search);

    this.setState(
      {
        mode: search.id == 0 ? "add" : "edit",
        currentAgentId: search.id,
      },
      async () => {
        const currentRebate = utils.getLStorage("currentRebate");

        if (currentRebate) {
          confirm({
            title: "返佣设置恢复操作",
            content:
              "检测到您存在未提交的返佣设置记录，请问是否从上次编辑中恢复状态？",
            onOk: () => {
              this.props.agency.setCurrentRebate(currentRebate);
            },
            onCancel: () => {
              this.init();
              utils.rmLStorage("currentRebate");
            },
          });
        } else {
          if (this.state.mode === "edit") {
            await this.props.agency.getCurrentRebate(search.id);
          } else {
            this.props.agency.setCurrentRebate({}, true, false);
          }
        }
      }
    );
  };

  getDifferentScopeOptions = () => {
    const scopes = ["agent_rebate"];

    scopes.forEach(scope => {
      this.getScopeOptions(scope);
    });
  };
  getScopeOptions = async (scope?) => {
    const res = await this.$api.agency.getRuleList({
      params: {
        scope,
      },
    });

    this.setState({
      [`${scope}_options`]: res.data.results,
    });
  };

  renderRebateSettings = () => {
    const {
      currentRebate: { commission_rule, },
      setCurrentRebate,
    } = this.props.agency;

    return (
      <FormItem label="返佣规则设置" required {...getFormItemLayout(4, 14)}>
        <Row>
          <Col span={4}></Col>
          <Col span={4}>固定金额</Col>
          <Col span={4}>点值(%)</Col>
        </Row>
        {commission_rule.map((item, index) => {
          return (
            <Row>
              <Col span={4}>{item.name}</Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  value={item.fix_amount}
                  onChange={val => {
                    let newCommissionRule = cloneDeep(commission_rule);

                    newCommissionRule = newCommissionRule.map(
                      (item, subIndex) => {
                        if (index == subIndex) {
                          item.fix_amount = val;
                        }

                        return item;
                      }
                    );

                    setCurrentRebate(
                      {
                        commission_rule: newCommissionRule,
                      },
                      false
                    );
                  }}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  value={item.rate}
                  onChange={val => {
                    let newCommissionRule = cloneDeep(commission_rule);

                    newCommissionRule = newCommissionRule.map(
                      (item, subIndex) => {
                        if (index == subIndex) {
                          item.rate = val;
                        }

                        return item;
                      }
                    );

                    setCurrentRebate(
                      {
                        commission_rule: newCommissionRule,
                      },
                      false
                    );
                  }}
                />
              </Col>
            </Row>
          );
        })}
      </FormItem>
    );
  };

  renderEditor = () => {
    const { getFieldDecorator, } = this.props.form;
    const {
      setCurrentRebate,
      currentShowRebate,
      currentRebate,
    } = this.props.agency;
    const { agent_rebate_options, } = this.state;

    return (
      <Form className="editor-form">
        <FormItem
          label="开启返佣"
          required
          {...getFormItemLayout(4, 14)}
          className="editor-upshelf"
        >
          {getFieldDecorator("in_use", {
            initialValue: currentRebate && currentRebate.in_use,
          })(
            <Radio.Group
              onChange={evt => {
                setCurrentRebate(
                  {
                    in_use: evt.target.value,
                  },
                  false
                );
              }}
            >
              <Radio style={radioStyle} value={1}>
                开启
              </Radio>
              <Radio style={radioStyle} value={0}>
                关闭
              </Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          label="自动结算"
          required
          {...getFormItemLayout(4, 14)}
          className="editor-upshelf"
        >
          {getFieldDecorator("auto_transfer_switch", {
            initialValue: currentRebate && currentRebate.auto_transfer_switch,
          })(
            <Radio.Group
              onChange={evt => {
                setCurrentRebate(
                  {
                    auto_transfer_switch: evt.target.value,
                  },
                  false
                );
              }}
            >
              <Radio style={radioStyle} value={1}>
                开启
              </Radio>
              <Radio style={radioStyle} value={0}>
                关闭
              </Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          label="返佣结算周期"
          required
          {...getFormItemLayout(4, 14)}
          className="editor-upshelf"
        >
          {getFieldDecorator("cycle", {
            initialValue: currentRebate && currentRebate.cycle,
          })(
            <Radio.Group
              onChange={evt => {
                setCurrentRebate(
                  {
                    cycle: evt.target.value,
                  },
                  false
                );
              }}
            >
              <Radio style={radioStyle} value={"real_time"}>
                实时
              </Radio>
              <Radio style={radioStyle} value={"month"}>
                月
              </Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          label="返佣计算公式"
          className="push-type-select"
          {...getFormItemLayout(4, 6)}
        >
          {getFieldDecorator("rebate_calculation", {
            initialValue:
              currentShowRebate && currentShowRebate.rebate_calculation,
          })(
            <Select
              // @ts-ignore
              getPopupContainer={() =>
                document.getElementsByClassName("push-type-select")[0]
              }
              placeholder="请选择税金计算"
              onChange={(value, elem: any) => {
                setCurrentRebate(
                  {
                    rebate_calculation: value,
                  },
                  false
                );
              }}
              onFocus={async () => {}}
            >
              {agent_rebate_options.map(item => (
                // @ts-ignore
                <Option key={item.func_name}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        {!utils.isEmpty(currentShowRebate.commission_rule) &&
          this.renderRebateSettings()}
        <FormItem className="editor-form-btns">
          {
            <Button type="primary" onClick={this.handleSubmit}>
              {this.state.mode == "edit" ? "确认修改" : "保存"}
            </Button>
          }
          <Button onClick={this.goBack}>取消</Button>
        </FormItem>
      </Form>
    );
  };

  goBack = () => {
    setTimeout(() => {
      this.props.history.goBack();
      this.props.agency.setCurrentRebate({});
      utils.rmLStorage("currentRebate");
    }, 300);
  };

  handleSubmit = async evt => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { currentRebate, } = this.props.agency;
        const { mode, currentAgentId, } = this.state;
        let payload: any = {
          in_use: currentRebate.in_use,
          auto_transfer_switch: currentRebate.auto_transfer_switch,
          cycle: currentRebate.cycle,
          rebate_calculation: currentRebate.rebate_calculation,
          commission_rule: currentRebate.commission_rule,
        };

        const errMsg = this.getValidation(payload);
        payload.commission_rule = this.getCommitRule(payload.commission_rule);


        if (errMsg) return this.$msg.warn(errMsg);
        if (mode == "add") {
          const res = await this.$api.agency.updateRebateSettings(payload);

          if (res.status == 201) {
            this.$msg.success("返佣规则创建成功");
            setTimeout(() => {
              this.goBack();
              this.props.agency.getAgentList({
                current_page: this.props.agency.filterAgent.current_page,
                page_size: this.props.agency.filterAgent.page_size,
              });
            }, 300);
          }
        } else {
          const res = await this.$api.agency.updateRebateSettings(
            currentAgentId,
            payload
          );

          if (res.status == 200) {
            this.$msg.success("返佣规则更新成功");
            setTimeout(() => {
              this.goBack();
              this.props.agency.getAgentList({
                current_page: this.props.agency.filterAgent.current_page,
                page_size: this.props.agency.filterAgent.page_size,
              });
            }, 300);
          }
        }
      }
    });
  };

  getCommitRule = commission_rule => {
    const obj = {};

    commission_rule.forEach(item => {
      obj[item.code.toString()] = {
        fix_amount: item.fix_amount.toString(),
        rate: item.rate.toString(),
      };
    });

    return obj;
  };

  getValidation = (payload: any) => {
    const validator = new Validator();

    validator.add(payload.in_use, [
      {
        strategy: "isNonEmpty",
        errMsg: "请设置是否开启返佣",
      }
    ]);

    validator.add(payload.auto_transfer_switch, [
      {
        strategy: "isNonEmpty",
        errMsg: "请设置是否自动结算返佣",
      }
    ]);

    validator.add(payload.cycle, [
      {
        strategy: "isNonEmpty",
        errMsg: "请选择返佣结算周期",
      }
    ]);

    validator.add(payload.rebate_calculation, [
      {
        strategy: "isNonEmpty",
        errMsg: "请设置返佣计算",
      }
    ]);

    validator.add(payload.commission_rule, [
      {
        strategy: "isNonEmpty",
        errMsg: "请设置返佣规则",
      }
    ]);

    let errMsg: any = validator.start();

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
