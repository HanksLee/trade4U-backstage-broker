import * as React from "react";
import utils from "utils";
import { BaseReact } from "components/BaseReact";
import { Form, Input, Modal, Cascader } from "antd";
import { inject, observer } from "mobx-react";
import Editor from "components/Editor";
// import { stringify } from "querystring";
// import Password from "antd/lib/input/Password";

const FormItem = Form.Item;
const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset },
  wrapperCol: { span: wrapper }
});

interface IEditMessageTypeModalProps {
  messageType: any;
  onOk: () => void;
  onCancel: () => void;
  brokerId: number;
}

interface IEditMessageTypeModalState {
  confirmLoading: boolean;
  editorContent: string;
  typeTitle: any[];
}

// @ts-ignore
@Form.create()
@inject("common")
@observer
export default class EditMessageTypeModal extends BaseReact<
  IEditMessageTypeModalProps,
  IEditMessageTypeModalState
> {
  state = {
    confirmLoading: false,
    editorContent: "",
    typeTitle: []
  };

  componentDidMount() {
    this.getTypeTitle();
  }

  getTypeTitle = async () => {
    const tempArray = [];
    const res = await this.$api.message.getMessageTypeList();
    if (res.status == 200) {
      res.data.results.forEach(function(item, index, array) {
        if (tempArray.indexOf(item.title) < 0) {
          tempArray.push(item.title);
        }
      });
    }
    this.setState({
      typeTitle: tempArray
    });
  };

  getEditorContent = val => {
    this.setState({ editorContent: val });
  };

  handleSubmit = async evt => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { messageType, onOk, brokerId } = this.props;
        const { editorContent, typeTitle } = this.state;

        let payload: any = {
          broker: brokerId,
          key: values.key
        };

        if (typeTitle.indexOf(values.title.join()) > -1) {
          this.$msg.error("分类已存在");
          return false;
        } else {
          payload.title = values.title.join();
        }

        if (!utils.isEmpty(editorContent)) {
          payload.description = editorContent;
        }

        this.setState({
          confirmLoading: true
        });

        if (!messageType) {
          this.$api.message.addMessageType(payload).then(
            () => {
              this.$msg.success("分类创建成功");
              onOk();
            },
            () => {
              this.setState({
                confirmLoading: false
              });
            }
          );
        } else {
          this.$api.message.updateMessageType(messageType.id, payload).then(
            () => {
              this.$msg.success("分类更新成功");
              onOk();
            },
            () => {
              this.setState({
                confirmLoading: false
              });
            }
          );
        }
      }
    });
  };

  render() {
    const { form, messageType, onCancel } = this.props;
    const { confirmLoading } = this.state;
    const getFieldDecorator = form.getFieldDecorator;
    // const { TextArea } = Input;

    return (
      <Modal
        visible={true}
        title={!messageType ? "新增分类" : "更新分类"}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
        width="70%"
      >
        <Form className="editor-form">
          <FormItem label="所属key" {...getFormItemLayout(3, 8)} required>
            {getFieldDecorator("key", {
              initialValue: (messageType && messageType.key) || "",
              rules: [{ required: true, message: "所属key不能為空" }]
            })(<Input placeholder="请输入所属key" />)}
          </FormItem>
          <FormItem label="名称" {...getFormItemLayout(3, 8)} required>
            {getFieldDecorator("title", {
              initialValue: (messageType && messageType.title) || "",
              rules: [{ required: true, message: "名称不能為空" }]
            })(<Input placeholder="请输入名称" />)}
          </FormItem>
          <FormItem label="描述" {...getFormItemLayout(3, 19)}>
            {getFieldDecorator("description", {
              initialValue: (messageType && messageType.description) || ""
              // rules: [{ required: true, message: "分類名稱不能為空" }]
            })(
              <Editor
                getEditorContent={this.getEditorContent}
                setEditorContent={
                  (messageType && messageType.description) || ""
                }
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
