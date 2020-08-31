
import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;
const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

interface IResetPasswordModalProps {
  currentAccount: any;
  onOk: () => void;
  onCancel: () => void;
}

interface IResetPasswordModalState {
  confirmLoading: boolean;
}

// @ts-ignore
@Form.create()
export default class ResetPasswordModal extends BaseReact<IResetPasswordModalProps, IResetPasswordModalState> {
  state: IResetPasswordModalState = {
    confirmLoading: false,
  }

  async componentDidMount() {

  }


  handleSubmit = async (evt) => {
    const { currentAccount, } = this.props;

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let payload: any = {
          password: values.target,
        };

        this.setState({
          confirmLoading: true,
        });

        const res = await this.$api.account.resetAccountPassword(currentAccount.id, payload);
        if (res && res.status == 200) {
          this.$msg.success('修改密码成功');
          setTimeout(() => {
            this.props.onOk();
          }, 300);
        }

        this.setState({
          confirmLoading: false,
        });
      }
    });
  }

  render() {
    const { form, onCancel, currentAccount, } = this.props;
    const { confirmLoading, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title="客户修改密码"
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Form className='editor-form'>
          <FormItem label='用户名' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('username', {
              initialValue: currentAccount && currentAccount.username,
            })(
              <Input disabled={true} />
            )}
          </FormItem>
          <FormItem label='修改密码' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('target', {
              rules: [
                { required: true, message: '请输入密码', }
              ],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}