import * as React from "react";
// import utils from "utils";
import { BaseReact } from "components/BaseReact";
import { Form, Input, Modal, Cascader } from "antd";
import { inject, observer } from "mobx-react";
// import { stringify } from "querystring";
// import Password from "antd/lib/input/Password";

const FormItem = Form.Item;
const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

interface IEditAgentVerifyModalProps {
  agentVerify: any;
  onOk: () => void;
  onCancel: () => void;
}

interface IEditAgentVerifyModalState {
  roleList: any[];
  defaultRole: any[];
  confirmLoading: boolean;
}

// @ts-ignore
@Form.create()
@inject("common")
@observer
export default class EditAgentVerifyModal extends BaseReact<
IEditAgentVerifyModalProps,
IEditAgentVerifyModalState
> {
  state = {
    confirmLoading: false,
    roleList: [],
    defaultRole: [],
  };

  componentDidMount() {}

  handleSubmit = async evt => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { agentVerify, onOk, } = this.props;

        let payload: any = {
          reason: values.reason,
          inspect_status: Number(values.inspect_status),
        };
        this.setState({
          confirmLoading: true,
        });

        this.$api.verify.updateVerify(agentVerify.id, payload).then(
          () => {
            this.$msg.success("開戶審批更新成功");
            onOk();
          },
          () => {
            this.setState({
              confirmLoading: false,
            });
          }
        );
      }
    });
  };

  render() {
    const { form, agentVerify, onCancel, } = this.props;
    const { confirmLoading, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title={"代理审批编辑"}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Form className="editor-form">
          <FormItem label="审核原因" {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator("reason", {
              initialValue: (agentVerify && agentVerify.reason) || "",
              rules: [{ required: true, message: "审核原因不能为空", }],
            })(<Input placeholder="请输入审核原因" />)}
          </FormItem>
          {agentVerify && (
            <FormItem label="审核状态" {...getFormItemLayout(5, 13)} required>
              {getFieldDecorator("inspect_status", {
                initialValue: (agentVerify && [
                  String(agentVerify.inspect_status)
                ]) || ["0"],
                rules: [{ required: true, message: "状态不能为空值", }],
              })(
                <Cascader
                  options={[
                    {
                      value: "0",
                      label: "未审核",
                    },
                    {
                      value: "1",
                      label: "待审核",
                    },
                    {
                      value: "2",
                      label: "审核通过",
                    },
                    {
                      value: "3",
                      label: "审核失败",
                    }
                  ]}
                />
              )}
            </FormItem>
          )}
        </Form>
      </Modal>
    );
  }
}
