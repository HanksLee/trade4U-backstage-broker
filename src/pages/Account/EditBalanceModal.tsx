
import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { Form, Input, Modal, InputNumber, Radio, Select } from 'antd';

const FormItem = Form.Item;
const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

interface CauseType {
  field: string;
  translation: string;
};

interface IEditBalanceModalProps {
  id: number;
  username: string;
  phone: string;
  balance: number;
  onOk: () => void;
  onCancel: () => void;
}

interface IEditBalanceModalState {
  confirmLoading: boolean;
  causeOptions: CauseType[]; 
}

// @ts-ignore
@Form.create()
export default class EditBalanceModal extends BaseReact<IEditBalanceModalProps, IEditBalanceModalState> {
  state: IEditBalanceModalState = {
    confirmLoading: false,
    causeOptions: [],
  }

  async componentDidMount() {
    const res = await this.$api.common.getConstantByKey('fund_cause_choices');
    this.setState({
      causeOptions: res.data.data,
    });
  }
  

  handleSubmit = async (evt) => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { id, onOk, } = this.props;

        let payload: any = {
          balance: values.balance,
          cause: values.cause,
          in_or_out: values.in_or_out,
          remarks: values.remarks,
        };

        this.setState({
          confirmLoading: true,
        });

        this.$api.account.updateAccountBalance(id, payload)
          .then(() => {
            this.$msg.success('余额修改成功');
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
    const { form, username, phone, balance, onCancel, } = this.props;
    const { confirmLoading, causeOptions, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title="编辑余额"
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Form className='editor-form'>
          <FormItem label='用户名' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('username', {
              initialValue: username,
            })(
              <Input disabled={true} />
            )}
          </FormItem>
          <FormItem label='手机号' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('phone', {
              initialValue: phone,
            })(
              <Input disabled={true} />
            )}
          </FormItem>
          <FormItem label='余额' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('balance', {
              initialValue: balance,
              rules: [
                { required: true, message: '请填写余额', }
              ],
            })(
              <InputNumber placeholder="请输入余额" style={{ width: '200px', }} />
            )}
          </FormItem>
          <FormItem label='类型' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('in_or_out', {
              rules: [
                { required: true, message: '请选择类型', }
              ],
            })(
              <Radio.Group>
                <Radio value={1}>增加</Radio>
                <Radio value={0}>减少</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label='明细原因' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('cause', {
              rules: [
                { required: true, message: '请填写明细原因', }
              ],
            })(
              <Select placeholder="请选中明细原因" style={{ width: '200px', }}>
                {
                  causeOptions.map(cause => <Select.Option value={cause.field}>{cause.translation}</Select.Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem label='备注' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('remarks', {
              rules: [
                { required: true, message: '请填写备足', }
              ],
            })(
              <Input placeholder="请输入明细备注" style={{ width: '200px', }} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}