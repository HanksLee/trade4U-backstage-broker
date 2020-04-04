
import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { Form, Input, Modal, Radio, Select } from 'antd';

const FormItem = Form.Item;
const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

interface IAgentModalProps {
  currentAccount: any;
  onOk: () => void;
  onCancel: () => void;
}

interface IAgentModalState {
  confirmLoading: boolean;
  agentOptions: any[];
}

// @ts-ignore
@Form.create()
export default class TransferCustomModal extends BaseReact<IAgentModalProps, IAgentModalState> {
  state: IAgentModalState = {
    confirmLoading: false,
    agentOptions: [],
  }

  async componentDidMount() {
    const res = await this.$api.agency.getAgentList({
      params: {
        current_page: 1,
        page_size: 100,
      },
    });
    this.setState({
      agentOptions: res.data.results,
    });
  }


  handleSubmit = async (evt) => {
    const { currentAccount, } = this.props;

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let payload: any = {
          target: values.target,
        };

        this.setState({
          confirmLoading: true,
        });

        const res = await this.$api.account.transferAccountToAgent(currentAccount.id, payload);
        if (res && res.status == 200) {
          this.$msg.success('划转成功成功');
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
    const { confirmLoading, agentOptions, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title="客户划转代理"
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Form className='editor-form'>
          <FormItem label='姓名' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('username', {
              initialValue: currentAccount && currentAccount.username,
            })(
              <Input disabled={true} />
            )}
          </FormItem>
          <FormItem label='原归属' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('agent_name', {
              initialValue: currentAccount && currentAccount.agent_name,
            })(
              <Input disabled={true} />
            )}
          </FormItem>
          <FormItem label='目标归属' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('target', {
              rules: [
                { required: true, message: '请选择目标归属', }
              ],
            })(
              <Select
                placeholder="请选择目标归属"
                style={{ width: '200px', }}
              >
                {
                  agentOptions.map(cause => <Select.Option value={cause.id}>{cause.username}</Select.Option>)
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}