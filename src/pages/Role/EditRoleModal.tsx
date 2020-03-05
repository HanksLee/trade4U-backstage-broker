import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { Form, Input, Modal } from "antd";
import { inject, observer } from "mobx-react";

const FormItem = Form.Item;
const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

interface IEditRoleModalProps {
  role: any;
  onOk: () => void;
  onCancel: () => void;
}

interface IEditRoleModalState {
  confirmLoading: boolean;
}

// @ts-ignore
@Form.create()
@inject("common")
@observer
export default class EditRoleModal extends BaseReact<
IEditRoleModalProps,
IEditRoleModalState
> {
  state = {
    confirmLoading: false,
  };

  handleSubmit = async evt => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { role, onOk, } = this.props;

        let payload: any = {
          name: values.name,
        };

        this.setState({
          confirmLoading: true,
        });

        if (!role) {
          this.$api.role.createRole(payload).then(
            () => {
              this.$msg.success("角色创建成功");
              onOk();
            },
            () => {
              this.setState({
                confirmLoading: false,
              });
            }
          );
        } else {
          this.$api.role.updateRole(role.id, payload).then(
            () => {
              this.$msg.success("角色更新成功");
              onOk();
            },
            () => {
              this.setState({
                confirmLoading: false,
              });
            }
          );
        }
      }
    });
  };

  render() {
    const { form, role, onCancel, } = this.props;
    const { confirmLoading, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title={role ? "编辑" : "添加"}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Form className="editor-form">
          <FormItem label="角色名称" {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator("name", {
              initialValue: role && role.name,
              rules: [{ required: true, message: "请填写角色名称", }],
            })(<Input placeholder="请输入权限名称" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
