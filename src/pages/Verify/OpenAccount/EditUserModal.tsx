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

interface IEditUserVerityModalProps {
  userVerity: any;
  onOk: () => void;
  onCancel: () => void;
}

interface IEditUserVerityModalState {
  roleList: any[];
  defaultRole: any[];
  confirmLoading: boolean;
}

// @ts-ignore
@Form.create()
@inject("common")
@observer
export default class EditUserVerityModal extends BaseReact<
IEditUserVerityModalProps,
IEditUserVerityModalState
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
        const { userVerity, onOk, } = this.props;

        let payload: any = {
          reason: values.reason,
          inspect_status: Number(values.status),
        };
        this.setState({
          confirmLoading: true,
        });

        this.$api.verify.updateVerify(userVerity.id, payload).then(
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
    const { form, userVerity, onCancel, } = this.props;
    const { confirmLoading, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title={"開戶審批編輯"}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Form className="editor-form">
          <FormItem label="審核原因" {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator("reason", {
              initialValue: (userVerity && userVerity.reason) || "",
              rules: [{ required: true, message: "審核原因不能为空", }],
            })(<Input placeholder="请输入審核原因" />)}
          </FormItem>
          {userVerity && (
            <FormItem label="審核狀態" {...getFormItemLayout(5, 13)} required>
              {getFieldDecorator("status", {
                initialValue: (userVerity && [
                  String(userVerity.inspect_status)
                ]) || ["0"],
                rules: [{ required: true, message: "状态不能为空值", }],
              })(
                <Cascader
                  options={[
                    {
                      value: "0",
                      label: "未審核",
                    },
                    {
                      value: "1",
                      label: "待審核",
                    },
                    {
                      value: "2",
                      label: "審核通過",
                    },
                    {
                      value: "3",
                      label: "審核失敗",
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
