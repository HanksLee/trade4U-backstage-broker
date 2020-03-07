import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { Form, Input, Modal, Select, InputNumber } from 'antd';
import { inject, observer } from 'mobx-react';

const FormItem = Form.Item;
const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

interface PaymentType {
  id: string;
  name: string;
}

interface IEditGroupModalProps {
  group: any;
  onOk: () => void;
  onCancel: () => void;
}

interface IEditGroupModalState {
  paymentOptions: PaymentType [];
  confirmLoading: boolean;
}

// @ts-ignore
@Form.create()
@inject('common', 'group')
@observer
export default class EditGroupModal extends BaseReact<IEditGroupModalProps, IEditGroupModalState> {
  state = {
    paymentOptions: [],
    confirmLoading: false,
  }

  async componentDidMount() {
    const res = await this.$api.finance.getPaymentList();
    this.setState({
      paymentOptions: res.data.results,
    });
  }

  handleSubmit = async (evt) => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { group, onOk, } = this.props;

        let payload: any = {
          name: values.name,
          margin_call: values.margin_call || 0,
          stop_out_level: values.stop_out_level || 0,
        };

        if (values.status !== undefined) {
          payload.status = values.status ? 1 : 0;
        }

        if (values.payment) {
          payload.payment = values.payment;
        }

        this.setState({
          confirmLoading: true,
        });

        this.$api.group.updateGroup(group.id, payload)
          .then(() => {
            this.$msg.success('客户组更新成功');
            onOk();
          }, () => {
            this.setState({
              confirmLoading: false,
            });
          });
      }
    });
  }

  render() {
    const { form, group, onCancel, } = this.props;
    const { paymentOptions, confirmLoading, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title='编辑'
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Form className='editor-form'>
          <FormItem label='客户组名称' {...getFormItemLayout(6, 13)} required>
            {getFieldDecorator('name', {
              initialValue: group.name,
              rules: [
                { required: true, message: '请填写客户组名称', }
              ],
            })(
              <Input placeholder="请输入客户组名称" disabled={group.is_default} />
            )}
          </FormItem>
          <FormItem label='状态' {...getFormItemLayout(6, 13)}>
            {getFieldDecorator('status', {
              initialValue: group.status,
            })(
              <Select style={{ width: '120px', }}>
                <Select.Option value={1}>启用</Select.Option>
                <Select.Option value={0}>禁用</Select.Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='支付方式' {...getFormItemLayout(6, 13)}>
            {getFieldDecorator('payment', {
              initialValue: group && group.payment.map(item => item.id),
            })(
              <Select mode='multiple'>
                {
                  paymentOptions.map(payment => <Select.Option value={payment.id}>{payment.name}</Select.Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem label='预警线(百分比)' {...getFormItemLayout(6, 13)}>
            {getFieldDecorator('margin_call', {
              initialValue: group.margin_call,
            })(
              <InputNumber min={0} max={100} placeholder="请输入预警线(百分比)" />
            )}
          </FormItem>
          <FormItem label='强平线(百分比)' {...getFormItemLayout(6, 13)}>
            {getFieldDecorator('stop_out_level', {
              initialValue: group.stop_out_level,
            })(
              <InputNumber min={0} max={100} placeholder="请输入强平线(百分比)" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}