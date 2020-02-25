import * as React from "react";
import { Breadcrumb } from "antd";
import utils from "utils";
import { inject, observer } from 'mobx-react';
import "./index.scss";

interface CommonHeaderProps {
  title?: string;
  location: any;
  history: any;
  links?: any[];
  tabs?: any[];
  onTabClick?(index): void;
  currentTab: any;
}

@inject('common')
@observer
export default class CommonHeader extends React.Component<CommonHeaderProps> {
  breadcrumbs = utils.getPageBreadcrumb(this.props.common.sidebar, this.props.location.pathname);

  render() {
    const { title, links, tabs, currentTab, history, onTabClick, } = this.props;
    return (
      <div className="common-header">
        <section className="common-header-breadcrumb">
          {this.breadcrumbs && (
            <Breadcrumb>
              {this.breadcrumbs.map((item, index) => (
                <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>
              ))}
            </Breadcrumb>
          )}
        </section>
        <section className="common-header-title">
          <h2>{title}</h2>
          <div className="common-header-links">
            {links &&
              links.map((link, index) => (
                <a
                  key={index}
                  onClick={() => { history.push(link.path); }}
                >
                  {link.title}
                </a>
              ))}
          </div>
        </section>
        <section className="common-header-tabs">
          {tabs &&
            tabs.map((tab, index) => (
              <a
                onClick={() => { onTabClick(tab.id); }}
                className={`${currentTab === tab.id ? "tab-active" : ""} `}
              >
                <span>{tab.title}</span>
                {tab.tipComponent && tab.tipComponent()}
              </a>
            ))}
        </section>
      </div>
    );
  }
}
