import * as React from "react";
import utils from "utils";
import { BaseReact } from "components/BaseReact";
import { Form, Input, Modal, Cascader, Checkbox } from "antd";
import { inject, observer } from "mobx-react";
import Editor from "components/Editor";
// import { stringify } from "querystring";
// import Password from "antd/lib/input/Password";

const FormItem = Form.Item;
const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

interface IEditMessageContentModalProps {
  brokerId: number;
  messageContent: any;
  onOk: () => void;
  onCancel: () => void;
}

interface IEditMessageContentModalState {
  confirmLoading: boolean;
  brokerId: number;
  typeList: any[];
  defaultType: any[];
  editorContent: string;
}

// @ts-ignore
@Form.create()
@inject("common")
@observer
export default class EditMessageContentModal extends BaseReact<
IEditMessageContentModalProps,
IEditMessageContentModalState
> {
  state = {
    confirmLoading: false,
    brokerId: null,
    typeList: [],
    defaultType: [],
    editorContent: "",
  };

  componentDidMount() {
    this.getTypeList();
  }

  getTypeList = async () => {
    const rolesTempArray = [];
    const res = await this.$api.message.getMessageTypeList();
    for await (let obj of res.data.results) {
      rolesTempArray.push({ value: String(obj.id), label: obj.title, });
    }
    this.setState({
      typeList: rolesTempArray,
      defaultType: [String(rolesTempArray[0].value)],
    });
  };

  getEditorContent = val => {
    this.setState({ editorContent: val, });
  };

  handleSubmit = async evt => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { messageContent, onOk, brokerId, } = this.props;
        const { editorContent, typeList, } = this.state;

        let message_type_title = typeList.find(function(item, index, array) {
          return item.value == values.message_type.join();
        });

        let payload: any = {
          broker: brokerId,
          title: values.title,
          message_type: values.message_type.join(),
          message_type_title: message_type_title.label,
        };

        if (!utils.isEmpty(editorContent)) {
          payload.content = editorContent;
        }

        if (!messageContent) {
          const is_display = values.is_display ? 1 : 0;
          payload.is_display = is_display;
        }

        this.setState({
          confirmLoading: true,
        });

        if (!messageContent) {
          this.$api.message.addMessageContent(payload).then(
            () => {
              this.$msg.success("內容创建成功");
              onOk();
            },
            () => {
              this.setState({
                confirmLoading: false,
              });
            }
          );
        } else {
          this.$api.message
            .updateMessageContent(messageContent.id, payload)
            .then(
              () => {
                this.$msg.success("內容更新成功");
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
    const { form, messageContent, onCancel, } = this.props;
    const { confirmLoading, defaultType, typeList, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title={!messageContent ? "新增列表" : "更新列表"}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Form className="editor-form">
          <FormItem label="内容标题" {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator("title", {
              initialValue: (messageContent && messageContent.title) || "",
              rules: [{ required: true, message: "内容标题不能為空", }],
            })(<Input placeholder="请输入内容标题" />)}
          </FormItem>
          <FormItem label="内容分类" {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator("message_type", {
              initialValue:
                (messageContent && [String(messageContent.message_type)]) ||
                defaultType,
              rules: [{ required: true, message: "内容分类不能为空值", }],
            })(<Cascader options={typeList} />)}
          </FormItem>
          {!messageContent && (
            <FormItem label="是否显示" {...getFormItemLayout(5, 13)}>
              {getFieldDecorator("is_display", {
                initialValue: false,
                valuePropName: "checked",
              })(<Checkbox />)}
            </FormItem>
          )}
          <FormItem label="內容描述" {...getFormItemLayout(5, 13)}>
            {getFieldDecorator("content", {
              initialValue: (messageContent && messageContent.content) || "",
              // rules: [{ required: true, message: "內容描述不能为空值" }]
            })(
              <Editor
                getEditorContent={this.getEditorContent}
                setEditorContent={
                  (messageContent && messageContent.content) || ""
                }
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
