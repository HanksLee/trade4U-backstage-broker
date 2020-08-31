
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

interface IAgentModalProps {
  currentAgent: any;
  agents: any[];
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
    const { currentAgent, } = this.props;

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { agents, onOk, } = this.props;

        let payload: any = {
          target: values.target,
          type: values.type,
        };

        this.setState({
          confirmLoading: true,
        });

        const res = await this.$api.agency.transferAgent(currentAgent.id, payload).catch(e => {

        });
        if (res && res.status == 200) {
          this.$msg.success('移转划交成功');
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
    const { form, onCancel, currentAgent, } = this.props;
    const { confirmLoading, agentOptions, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title="移交划转"
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Form className='editor-form'>
          <FormItem label='用户名' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('username', {
              initialValue: currentAgent && currentAgent.username,
            })(
              <Input disabled={true} />
            )}
          </FormItem>
          <FormItem label='原归属' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('agent_name', {
              initialValue: currentAgent && currentAgent.agent_name,
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
          <FormItem label='类型' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('type', {
              rules: [
                { required: true, message: '请选择类型', }
              ],
            })(
              <Radio.Group>
                <Radio value={'include_self'}>包括自己</Radio>
                <Radio value={'exclude_self'}>不包括自己</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem {...getFormItemLayout(5, 19)}>
            <section style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.65)', }}>
              <p>
                【包括自己】相当于转移关系，将自己和下属客户都转移到他人名下
              </p>
              <p>
                【不包括自己】相当于将自己的客户移交给别人
              </p>
            </section>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}