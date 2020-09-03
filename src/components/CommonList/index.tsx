import * as React from "react";
// import { BaseReact } from 'components/BaseReact';
import "./index.scss";
import {
  Button,
  Select,
  Input,
  Table,
  DatePicker,
  Checkbox,
  Icon,
  Pagination,
  Spin,
  Tag
} from "antd";
import utils from "utils";
import moment from "moment";

const Option = Select.Option;
const InputGroup = Input.Group;
const RangePicker = DatePicker.RangePicker;
const CheckableTag = Tag.CheckableTag;

const widgetMap = {
  SelectInput: config => {
    const {
      selectValue,
      inputValue,
      placeholder,
      options,
      onSelectChange,
      onInputChange,
      onPressEnter,
      // style,
      selectStyle,
    } = config;

    return (
      <InputGroup compact>
        <Select
          style={selectStyle ? { width: 110, ...selectStyle, } : { width: 110, }}
          value={selectValue}
          onChange={onSelectChange}
        >
          {options &&
            options.map((opt, index) => (
              <Option key={index} value={opt.value}>
                {opt.title}
              </Option>
            ))}
        </Select>
        <Input
          style={{ width: 238, }}
          value={inputValue}
          // @todo
          onChange={onInputChange}
          placeholder={placeholder}
          onPressEnter={onPressEnter}
        />
      </InputGroup>
    );
  },
  Select: config => {
    const {
      option,
      label,
      labelWidth,
      mode,
      onSearch,
      onSelect,
      onBlur,
      onFocus,
      value,
      placeholder,
      showSearch,
      width,
      filterOption,
      onChange,
      allowClear,
      onPopupScroll,
    } = config;
    return (
      <>
        {label && <span className="common-list-label" style={{ width: labelWidth || 70,  }}>{`${label}：`}</span>}
        <span className="common-list-control">
          <Select
            allowClear={allowClear}
            value={value}
            mode={mode || false}
            style={{ minWidth: width || 258, width, }}
            showSearch={showSearch}
            placeholder={placeholder}
            filterOption={filterOption}
            onSearch={onSearch}
            onSelect={onSelect}
            onChange={onChange}
            onBlur={onBlur}
            onPopupScroll={onPopupScroll}
            onFocus={onFocus}
          >
            {option.data.map(item => (
              // @ts-ignore
              <Option
                key={item[option.key] || item.id}
                value={item[option.value] || item.id}
                $data={item}
              >
                {item[option.title]}
              </Option>
            ))}
          </Select>
        </span>
      </>
    );
  },
  DatePicker: config => {
    const {
      label,
      labelWidth,
      placeholder,
      onChange,
      value,
      style,
      format,
      showTime,
    } = config;

    return (
      <>
        {label && <span className="common-list-label" style={{ width: labelWidth || 70,  }}>{`${label}：`}</span>}
        <span className="common-list-control">
          <DatePicker
            format={format || false}
            style={style}
            showTime={showTime}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        </span>
      </>
    );
  },
  RangePicker: config => {
    const {
      label,
      labelWidth,
      alias,
      placeholder,
      onChange,
      value,
      showTime,
      format,
      disabledDate,
      disabledTime,
    } = config;
    return (
      <>
        {label && <span className="common-list-label" style={{ width: labelWidth || 70, }}>{`${label}：`}</span>}
        <span className="common-list-control">
          <RangePicker
            style={{ width: 400, }}
            showTime={showTime}
            format={format}
            placeholder={placeholder}
            value={value}
            onCalendarChange={onChange}
            disabledDate={disabledDate}
            disabledTime={disabledTime || undefined}
          />
          <span className="common-list-control-date-alias">
            {!utils.isEmpty(alias) &&
              alias.map((item, index) => (
                <Button
                  key={index}
                  onClick={() =>
                    onChange([
                      moment(Date.now() - 1000 * 60 * 60 * 24 * item).startOf(
                        "day"
                      ),
                      moment()
                    ])
                  }
                >
                  {item} 天内
                </Button>
              ))}
          </span>
        </span>
      </>
    );
  },
  Input: config => {
    const { label, labelWidth, value, placeholder, onChange, width, onPressEnter, } = config;

    return (
      <>
        {label && <span className="common-list-label" style={{ width: labelWidth || 70, }}>{`${label}：`}</span>}
        <span className="common-list-control">
          <Input
            style={{ minWidth: width || 258, }}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onPressEnter={onPressEnter}
          />
        </span>
      </>
    );
  },
  Checkbox: config => {
    const { label, value, onChange, } = config;
    return (
      <Checkbox checked={value} onChange={onChange}>
        {label}
      </Checkbox>
    );
  },
  CheckableTag: config => {
    const { label, labelWidth, option, value, onChange, } = config;

    return (
      <>
        {label && <span className="common-list-label" style={{ width: labelWidth || 70, }}>{`${label}：`}</span>}
        <span className="common-list-control">
          {!utils.isEmpty(option) &&
            option.map(item => (
              <CheckableTag
                key={item.value}
                checked={item.value === value}
                onChange={() => {
                  onChange(item);
                }}
              >
                {item.title}
              </CheckableTag>
            ))}
        </span>
      </>
    );
  },
  Label: (config, children) => {
    const { label, labelWidth, } = config;

    return (
      <>
        {label && <span className="common-list-label" style={{ width: labelWidth || 70,  }}>{`${label}：`}</span>}
        <span className="common-list-control">{children}</span>
      </>
    );
  },
  Custom: config => {
    return <div>{this.props.children}</div>;
  },
};

/**
 * @param props.config 表单渲染配置
 */
export default class CommonList extends React.Component<any, any> {
  state = {
    collapse: true,
  };

  toggleCollapse = (bool?) => {
    this.setState({
      collapse: !this.state.collapse,
    });
  };
  // * 渲染查询组接口
  renderSearcher = () => {
    const { searcher, table, } = this.props.config;
    const { collapse, } = this.state;
    const TableHeader = table && table.tableHeader;

    return (
      searcher && (
        <section className="common-list-search">
          {this.renderWidgets(searcher.widgets)}
          {TableHeader && <TableHeader />}
          <div className="common-list-search-right">
            {!searcher.hideSearcher && (
              <>
                <Button
                  type="primary"
                  disabled={searcher.searchDisabled}
                  onClick={searcher.onSearch}
                >
                  查询
                </Button>
                <Button onClick={searcher.onReset}>重置</Button>
                {searcher.onBackClick && (
                  <Button onClick={searcher.onBackClick}>返回</Button>
                )}
              </>
            )}
            {searcher.collapseControl && searcher.collapseControl.showMoreBtn && (
              <span className="common-list-serach-more">
                <a onClick={this.toggleCollapse}>
                  {collapse ? "更多" : "收起"}{" "}
                  <Icon type={collapse ? "down" : "up"} />
                </a>
              </span>
            )}
          </div>
        </section>
      )
    );
  };

  renderWidgets = widgets => {
    const { collapse, } = this.state;
    const { searcher, } = this.props.config;
    return (
      widgets && (
        <div className="common-list-search-left">
          {widgets.map((widget, index) => {
            if (Array.isArray(widget)) {
              return (
                <div
                  key={index}
                  className={`common-list-search-row`}
                  style={{
                    display:
                      searcher.collapseControl &&
                        searcher.collapseControl.showMoreBtn
                        ? collapse && index > 0
                          ? "none"
                          : "flex"
                        : "flex",
                  }}
                >
                  {widget.map((item: any) => {
                    return (
                      <div
                        key={item.label}
                        className="common-list-search-col"
                        style={{
                          ...item.style,
                        }}
                      >
                        {widgetMap[item.type] &&
                          widgetMap[item.type](
                            item,
                            item.children
                              ? this.renderWidgets(item.children)
                              : null
                          )}
                      </div>
                    );
                  })}
                </div>
              );
            }

            return (
              <div
                key={widget.label}
                className={`common-list-search-row ${widget.className}`}
              >
                {widgetMap[widget.type] &&
                  widgetMap[widget.type](
                    widget,
                    widget.children ? this.renderWidgets(widget.children) : null
                  )}
              </div>
            );
          })}
        </div>
      )
    );
  };
  // * 渲染新增按钮接口
  renderAddBtn = () => {
    const { addBtn, searcher, } = this.props.config;
    const AddBtnTitle = addBtn && addBtn.title;

    return (
      addBtn && (
        <section className="common-list-addbtn" style={addBtn.style}>
          {typeof addBtn.title === "function" ? <AddBtnTitle /> : addBtn.title}
          <div className="common-list-search-batch">
            {searcher.batchControl.showBatchControl && (
              <Select
                placeholder={searcher.batchControl.placeholder}
                style={{ minWidth: 120, }}
                defaultValue={undefined}
                onChange={searcher.batchControl.onBatch}
              >
                {/* <Option value={undefined}>无</Option> */}
                {searcher.batchControl.options.map(opt => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.title}
                  </Option>
                ))}
              </Select>
            )}
          </div>
        </section>
      )
    );
  };

  renderExportExcelBtn = () => {
    const { exportExcelBtn, } = this.props.config;
    const ExportExcelTitle = exportExcelBtn && exportExcelBtn.title;

    return (
      exportExcelBtn && (
        <section
          className="common-list-exportExcelBtn"
          style={exportExcelBtn.style}
        >
          {typeof exportExcelBtn.title === "function"
            ? exportExcelBtn.showExportExcelBtn && <ExportExcelTitle />
            : exportExcelBtn.showExportExcelBtn && exportExcelBtn.title}
        </section>
      )
    );
  };

  // * 渲染表格接口
  renderTableHeader = () => {
    const { tableHeader, } = this.props.config;
    const TableHeader = tableHeader;

    return (
      <section className="common-list-table-header">
        {tableHeader && <TableHeader />}
      </section>
    );
  };

  // * 渲染表格接口
  renderTable = () => {
    const {
      rowKey,
      ref,
      rowSelection,
      columns,
      dataSource,
      pagination,
      onChange,
      loading,
      locale,
      title,
      bordered,
      scroll,
    } = this.props.config.table;
    // console.log('config.table :>> ', this.props.config.table);
    /**
     * [antd v3. Table API] https://3x.ant.design/components/table-cn/#Table
     * [antd v3. Column API] https://3x.ant.design/components/table-cn/#Column
     */
    return (
      <section className="common-list-table">
        <Table
          ref={ref || ""}
          title={title || ""}
          locale={locale}
          bordered={bordered}
          rowKey={rowKey || "id"}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          onChange={onChange}
          scroll={scroll || { x: true, }}
        />
      </section>
    );
  };

  renderCards = () => {
    const {
      dataSource,
      loading,
      pagination,
      renderCard,
      addBtn,
    } = this.props.config.cards;

    return (
      <div className="common-list-cards-wrapper">
        <ul className="common-list-cards">
          {loading ? (
            <div className="common-list-cards-loading">
              <Spin />
            </div>
          ) : (
              <>
                <li className="common-list-card add-btn">
                  <div
                    className="common-list-card-item"
                    onClick={addBtn.onAddBtnClick}
                  >
                    {addBtn.icon ? (
                      <img src={addBtn.icon} alt="" />
                    ) : (
                      <Icon type="plus-circle" />
                    )}
                    <p>{addBtn.title}</p>
                  </div>
                </li>
                {dataSource.map(item => {
                  return (
                    <li className="common-list-card">
                      <div className="common-list-card-item">
                        {renderCard(item)}
                      </div>
                    </li>
                  );
                })}
              </>
          )}
        </ul>
        <section className="common-list-cards-pagination">
          <Pagination {...pagination} />
        </section>
      </div>
    );
  };

  render() {
    const { config, } = this.props;
    return (
      <div className="common-list">
        {this.renderSearcher()}
        {this.renderAddBtn()}
        {this.renderExportExcelBtn()}
        {this.renderTableHeader()}
        {config.table && this.renderTable()}
        {config.cards && this.renderCards()}
      </div>
    );
  }
}
