import Auth from 'pages/Auth';
import ErrorBoundary from 'components/ErrorBoundary';
import HTML5Backend from "react-dnd-html5-backend";
import Index from "pages/Index";
import Login from "pages/Login";
import store from "store";
import utils from 'utils';
import zhCN from 'antd/es/locale/zh_CN';
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import {
  BrowserRouter,
  HashRouter,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { ConfigProvider } from 'antd';
import { DndProvider } from "react-dnd";
import { hot } from "react-hot-loader/root";
import { Provider } from "mobx-react";
import "./app.scss";

const isProd = process.env.NODE_ENV === "production";
(window as any).$origin = `${window.location.origin}${isProd ? "" : "/#"}`;

const Router: any = !isProd ? HashRouter : BrowserRouter;

class App extends BaseReact {
  state = {
    token: undefined,
  }

  async componentDidMount() {
    this.init();
  }

  private init = async (): Promise<any> => {
    // @todo 一进入页面调起获取用户信息接口
    const token = utils.getLStorage('MOON_ADMIN_MAIN_TOKEN');
    this.setState({ token, });
  };

  render() {
    const { token, } = this.state;

    return (
      <ErrorBoundary>
        <Provider {...store}>
          {/* <Router basename={basename}> */}
          <ConfigProvider locale={zhCN}>
            <DndProvider backend={HTML5Backend}>
              <Router>
                <Switch>
                  <Route exact path="/auth">
                    <Auth />
                  </Route>
                  {/* 这里在 io 拦截器进行拦截一进入首页就进行路由跳转 */}
                  <Route exact path="/">
                    {!!token ? (
                      <Redirect to="/dashboard" />
                    ) : (
                      <Redirect to="/login" />
                    )}
                  </Route>
                  <Route path="/dashboard">
                    <Index />
                  </Route>
                  <Route exact path="/login">
                    <Login />
                  </Route>
                  <Route path="*">
                    <div>404</div>
                  </Route>
                </Switch>
              </Router>
            </DndProvider>
          </ConfigProvider>
        </Provider>
      </ErrorBoundary>
    );
  }
}

export default hot(App);
