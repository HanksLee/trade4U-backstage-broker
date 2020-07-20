import gt from "utils/gettext";
import locales from "locales";
import isEmpty from "lodash/isEmpty";
import PromiseFileReader from "promise-file-reader";
import commonAPI from "services/common";
import NProgress from "nprogress";
import { message } from "antd";

function setRootFontSizeFromClient() {
  let dpr, rem;
  const htmlEl = document.getElementsByTagName("html")[0],
    docEl = document.documentElement,
    metaEl = document.querySelector('meta[name="viewport"]');

  dpr = (window as any).devicePixelRatio || 1;
  rem = docEl.clientWidth;
  metaEl.setAttribute(
    "content",
    `width=${
      docEl.clientWidth
    },initial-scale=${1},maximum-scale=${1}, minimum-scale=${1},use-scalable=no`
  );

  docEl.setAttribute("data-dpr", dpr);
  htmlEl.style.fontSize = `${rem}px`;

  (window as any).dpr = dpr;
  (window as any).rem = rem;
  (window as any).r = function(value: number | string): string {
    value = Number(value);
    // @ts-ignore
    return `${value / process.env.designWidth}rem`;
  };

  window.onresize = function() {
    htmlEl.style.fontSize = `${document.documentElement.clientWidth}px`;
  };
}

function ellipsis(value: string, len = 10) {
  if (!value) return "";

  value = value.toString();
  return value.length > len ? value.slice(0, len) + "..." : value;
}

function initI18n(lang: string) {
  gt.init(locales);
}

function getPageBreadcrumb(pathList, url) {
  const breadcrumbs = [];

  function getBreadcrumb(pathList) {
    const matched = pathList.find(item => url.indexOf(item.path) > -1);
    breadcrumbs.push(matched);

    if (!isEmpty(matched && matched.children)) {
      getBreadcrumb(matched.children);
    }
  }

  getBreadcrumb(pathList);

  return breadcrumbs;
}

function _isEmpty(value) {
  if (
    typeof value === "undefined" ||
    typeof value === "number" ||
    typeof value === "string" ||
    typeof value === "boolean" ||
    value instanceof Date
  ) {
    return !Boolean(value);
  } else {
    return isEmpty(value);
  }
}

function setLStorage(key, value) {
  if (!_isEmpty(value)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function getLStorage(key) {
  const ret = JSON.parse(localStorage.getItem(key));
  return ret;
}

function rmLStorage(key) {
  localStorage.removeItem(key);
}

async function readAsDataURL(file) {
  return await PromiseFileReader.readAsDataURL(file);
}

async function uploadFile(payload) {
  const fd = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    // @ts-ignore
    fd.append(key, value);
  }
  NProgress.start();

  try {
    const res = await commonAPI.uploadFile(fd);
    if (res.data.ret == 0) {
      NProgress.done();
      return res.data.data.file;
    } else {
      NProgress.done();
      return Promise.reject(res.data.msg);
    }
  } catch (err) {
    message.error(err);
  }
}

function getFormData(payload) {
  const fd = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    // @ts-ignore
    fd.append(key, value);
  }

  return fd;
}

function parseEmoji(text) {
  text = text || "";
  let ret = text.replace(/\[(.+?)\]/g, m => {
    // @ts-ignore
    return String.fromCharCode(`0x${m.substr(5, 4)}`, `0x${m.substr(9, 4)}`);
  });
  const ret2 = (window as any).twemoji.parse(ret);

  return ret2;
}

function moveArrayPosition(oldIndex, newIndex, arr) {
  if (newIndex >= arr.length) {
    var k = newIndex - arr.length;
    while (k-- + 1) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);

  return arr;
}

function getFileInfo(file, callback?) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function(evt) {
    const url = evt.currentTarget.result;
    const img = new Image();
    img.src = url;
    img.onload = function(evt) {
      callback && callback(img);
    };
  };
}

function removeSpareLF(str: string) {
  return str.replace(/\n{2,}/g, "\n");
}

function parsePrice(str) {
  return (str / 100).toFixed(2);
}

function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    default:
      return 0;
  }
}

function resetFilter(filter) {
  const resetedFilter = Object.assign({}, filter);
  Object.keys(filter).forEach((name: string) => {
    resetedFilter[name] = undefined;
  });
  return resetedFilter;
}
function calcColumnMaxWidth(list: any, defaultWidth: number, column: string): string {
  const fontSize = 14;
  const paddingSize = 16;
  if(list.length === 0) {
    return `${defaultWidth}`;
  }
  let maxLength = 0;
  list.forEach((item, i)=>{
    const colLength = item[column].length;

    if(maxLength < colLength) {
      maxLength = colLength;
    }
  });

  const maxWidth = fontSize * maxLength + paddingSize * 2;
  const ret = maxWidth < defaultWidth ? defaultWidth : maxWidth;
  return `${ret}px`;
}

function getRangeNumberList(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function checkDateLimited(start, end, max) {
  return end.diff(start, 'm') <= max;
}

export default {
  setRootFontSizeFromClient,
  initI18n,
  isEmpty: _isEmpty,
  getPageBreadcrumb,
  setLStorage,
  getLStorage,
  rmLStorage,
  ellipsis,
  readAsDataURL,
  uploadFile,
  parseEmoji,
  getFormData,
  moveArrayPosition,
  getFileInfo,
  removeSpareLF,
  parsePrice,
  randomNum,
  resetFilter,
  calcColumnMaxWidth,
  getRangeNumberList,
  checkDateLimited,
};
