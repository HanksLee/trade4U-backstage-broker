import noAuthImage from "assets/img/noauth.png";
import * as React from "react";
import { Empty } from "antd";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import { RouteProps } from "react-router";

interface WithRouteProps extends RouteProps {
  permissionCode?: string;
}

export function withRoutePermissionGuard(
  path: string,
  option?: WithRouteProps
): any {
  return function(Component: new (...args: any[]) => React.Component<any>) {
    return inject("common")(
      observer(function({ common, }) {
        function renderComponent(props) {
          // 没有配置权限限制，或者有权限
          if (
            !option ||
            !option.permissionCode ||
            common.permissions.indexOf(option.permissionCode) !== -1
          ) {
            return <Component {...props} />;
          } else {
            return (
              <Empty
                className="absolute-center"
                image={noAuthImage}
                description={<span>无权限访问</span>}
              />
            );
          }
        }

        return (
          <Route
            path={path}
            {...{ exact: true, ...option, }}
            render={props => renderComponent(props)}
          />
        );
      })
    );
  };
}
