
import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { Form, InputNumber, Modal, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import { SymbolType } from './GroupSymbolList';

const FormItem = Form.Item;
const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

interface SymbolTypeOption {
  id: string;
  name: string;
}

interface IEditSymbolTypeModalProps {
  groupId: string;
  symbolType: SymbolType | null;
  onOk: () => void;
  onCancel: () => void;
}

interface IEditSymbolTypeModalState {
  symbolTypeOptions: SymbolTypeOption[];
  confirmLoading: boolean;
}

// @ts-ignore
@Form.create()
@inject('common', 'group')
@observer
export default class EditSymbolTypeModal extends BaseReact<IEditSymbolTypeModalProps, IEditSymbolTypeModalState> {
  state = {
    symbolTypeOptions: [],
    confirmLoading: false,
  };

  async componentDidMount() {
    const res = await this.$api.product.getGenreList();
    this.setState({
      symbolTypeOptions: res.data.results,
    });
  }

  handleSubmit = async (evt) => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { symbolType, onOk, } = this.props;

        let payload: any = {
          group: this.props.groupId,
          symbol_type: values.symbol_type || [],
          action: values.action,
          max_trading_volume: values.max_trading_volume || 0,
          min_trading_volume: values.min_trading_volume || 0,
          taxes: values.taxes || 0,
          standard: values.standard || 0,
          leverage: values.leverage || 0,
        };

        this.setState({
          confirmLoading: true,
        });

        if (!symbolType) {
          this.$api.group.createGroupSymbolType(payload)
            .then(() => {
              this.$msg.success('创建交易品种成功');
              onOk();
            }, () => {
              this.setState({
                confirmLoading: false,
              });
            });
        } else {
          this.$api.group.updateGroupSymbolType(symbolType.id, payload)
            .then(() => {
              this.$msg.success('交易品种更新成功');
              onOk();
            }, () => {
              this.setState({
                confirmLoading: false,
              });
            });
        }
      }
    });
  }

  render() {
    const { form, symbolType, onCancel, } = this.props;
    const { confirmLoading, symbolTypeOptions, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title={symbolType ? '编辑' : '添加'}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Form className='editor-form'>
          <FormItem label='买卖方向' {...getFormItemLayout(9, 13)}>
            {getFieldDecorator('action', {
              initialValue: (symbolType && symbolType.action && symbolType.action.length > 0) ? symbolType.action : undefined,
            })(
              <Select mode='multiple' style={{ width: '200px', }}>
                <Select.Option value='0'>做多</Select.Option>
                <Select.Option value='1'>做空</Select.Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='交易品种类型' {...getFormItemLayout(9, 13)}>
            {getFieldDecorator('symbol_type', {
              initialValue: symbolType && symbolType.symbol_type,
              rules: [{ required: true, message: "请选择交易品种类型", }],
            })(
              <Select style={{ width: '200px', }} disabled={!!symbolType}>
                {
                  symbolTypeOptions.map(item => <Select.Option value={item.id}>{item.name}</Select.Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem label='最大交易量' {...getFormItemLayout(9, 13)}>
            {getFieldDecorator('max_trading_volume', {
              initialValue: symbolType && symbolType.max_trading_volume,
            })(
              <InputNumber style={{ width: '200px', }} />
            )}
          </FormItem>
          <FormItem label='最小交易量' {...getFormItemLayout(9, 13)}>
            {getFieldDecorator('min_trading_volume', {
              initialValue: symbolType && symbolType.min_trading_volume,
            })(
              <InputNumber style={{ width: '200px', }} />
            )}
          </FormItem>
          <FormItem label='加收手续费(百分比)' {...getFormItemLayout(9, 13)}>
            {getFieldDecorator('taxes', {
              initialValue: symbolType && symbolType.taxes,
            })(
              <InputNumber style={{ width: '200px', }} />
            )}
          </FormItem>
          <FormItem label='交易成本每手加收(百分比)' {...getFormItemLayout(9, 13)}>
            {getFieldDecorator('standard', {
              initialValue: symbolType && symbolType.standard,
            })(
              <InputNumber style={{ width: '200px', }} />
            )}
          </FormItem>
          <FormItem label='杠杆' {...getFormItemLayout(9, 13)}>
            {getFieldDecorator('leverage', {
              initialValue: symbolType && symbolType.leverage,
            })(
              <InputNumber style={{ width: '200px', }} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}