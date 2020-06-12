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

interface IEditCommissionVerifyModalProps {
  commissionVerify: any;
  onOk: () => void;
  onCancel: () => void;
}

interface IEditCommissionVerifyModalState {
  confirmLoading: boolean;
}

// @ts-ignore
@Form.create()
@inject("common")
@observer
export default class EditCommissionVerifyModal extends BaseReact<
IEditCommissionVerifyModalProps,
IEditCommissionVerifyModalState
> {
  state = {
    confirmLoading: false,
  };

  componentDidMount() {}

  handleSubmit = async evt => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { commissionVerify, onOk, } = this.props;

        let payload: any = {
          username: values.username,
          review_status: Number(values.review_status),
          remarks: values.remarks,
        };
        this.setState({
          confirmLoading: true,
        });

        this.$api.verify
          .updateWithdrawCommission(commissionVerify.id, payload)
          .then(
            () => {
              this.$msg.success("佣金出金审批更新成功");
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
    const { form, commissionVerify, onCancel, } = this.props;
    const { confirmLoading, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title={"佣金出金审批编辑"}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Form className="editor-form">
          <FormItem label="姓名" {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator("username", {
              initialValue:
                (commissionVerify && commissionVerify.username) || "",
              rules: [{ required: true, message: "姓名不能为空", }],
            })(<Input placeholder="请输入姓名" disabled />)}
          </FormItem>
          {commissionVerify && (
            <FormItem label="审核状态" {...getFormItemLayout(5, 13)} required>
              {getFieldDecorator("review_status", {
                initialValue: (commissionVerify && [
                  String(commissionVerify.review_status)
                ]) || ["0"],
                rules: [{ required: true, message: "状态不能为空值", }],
              })(
                <Cascader
                  options={[
                    {
                      value: "0",
                      label: "待审核",
                    },
                    {
                      value: "1",
                      label: "审核通过",
                    },
                    {
                      value: "2",
                      label: "审核失败",
                    }
                  ]}
                />
              )}
            </FormItem>
          )}
          <FormItem label="备注" {...getFormItemLayout(5, 13)}>
            {getFieldDecorator("remarks", {
              initialValue: (commissionVerify && commissionVerify.remarks) || "",
              // rules: [{ required: true, message: "备注不能为空", }],
            })(<Input placeholder="请输入备注" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
