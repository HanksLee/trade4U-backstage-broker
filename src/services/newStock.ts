import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getNewStockList = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/newstock", config);

export default { getNewStockList, };
