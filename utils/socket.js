import {
  setGlobalData,
  setStorageSync,
  getStorageSync,
  handleResource,
} from '@/utils/tool';
import $http from '@/api/http.js';
import { nextTick } from 'vue';

let socketTask = null;
let timer = null;
let reConnectTime = 20 * 1000;
let delayedTime = 60 * 1000;
let isSocket = false; //是否正在连接
let socketFalseTimer = null;
let initWebSocketTimer = null;
let restartTimer = null;
let infoTimer = null;

// 检查是否满足连接条件
function checkConnectConditions() {
  return getApp().globalData.socketUrl && getApp().globalData.code;
}

// 设置连接状态为 false
function setSocketFalse() {
  return new Promise((resolve) => {
    clearTimeout(socketFalseTimer);
    socketFalseTimer = setTimeout(() => {
      isSocket = false;
      resolve();
    }, 2000);
  });
}

async function initWebSocket() {
  await nextTick();
  if (!checkConnectConditions()) {
    return;
  }
  if (isSocket) {
    return;
  }
  isSocket = true;
  // 先关闭再打开，防止多次执行 connectSocket 占线设备没响应
  await closeWebSocket();
  socketTask = null;
  socketTask = uni.connectSocket({
    url: getApp().globalData.socketUrl,
    success: async (res) => {
      console.log('WebSocket连接成功', res);
      listenWebSocketEvents();
      reConnect();
      await setSocketFalse();
    },
    fail: async (err) => {
      isSocket = false;
      console.error('WebSocket连接失败', err);
      clearTimeout(initWebSocketTimer);
      initWebSocketTimer = setTimeout(initWebSocket, reConnectTime); // 延迟重试
    },
    complete: async (err) => {
      console.log('WebSocket连接', getApp().globalData.socketUrl, err);
      await setSocketFalse();
    },
  });
}

function reConnect() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (!isSocketConnected()) {
      //   console.log('Socket未连接');
      initWebSocket();
    } else {
      clearInterval(timer);
      // 此处可根据实际情况添加对连接状态的进一步验证等操作
      // 例如：检查连接的稳定性，重新发送心跳包等
      // 如果连接不稳定，可以考虑重新连接或采取其他措施
    }
  }, delayedTime);
}

function isSocketConnected() {
  return socketTask && socketTask.readyState === 1;
}

async function listenWebSocketEvents(_this) {
  //   let testData = {
  //     type: 1,
  //     resourceList: [
  //       'http://192.168.0.253:9001/statics/2024/11/28/学校_20241128171740A003.png',
  //       // 	"http://192.168.0.253:9001/statics/2024/11/28/2声音视频_20241128171726A002.mp4",
  //       // 	"http://192.168.0.253:9001/statics/2024/11/28/3青春不重播（国语版_20241128172941A004.mp3",
  //       // 	"http://192.168.0.253:9001/statics/2024/11/28/0梦想的征程_20241128173152A005.pdf"
  //     ],
  //   };
  //   let test = {
  //     data: JSON.stringify(testData),
  //   };
  //   handleInfo(test, _this);
  //   return;
  await nextTick();
  if (!checkConnectConditions()) {
    return;
  }
  // uni.onSocketOpen((res) => {
  // 	console.log('连接已打开', res)
  // });

  uni.onSocketMessage((res) => {
    // 处理接收到的消息
    console.log('WebSocket收到消息：', res);
    handleInfo(res, _this);
  });
  uni.onSocketError((err) => {
    console.error('WebSocket发生错误：', err);
    clearTimeout(restartTimer);
    restartTimer = setTimeout(() => {
      // #ifdef APP || APP-PLUS
      plus.runtime.restart();
      // #endif
    }, delayedTime);
  });

  uni.onSocketClose((res) => {
    // console.log('WebSocket已关闭：', res)
    clearTimeout(restartTimer);
    restartTimer = setTimeout(() => {
      // #ifdef APP || APP-PLUS
      plus.runtime.restart();
      // #endif
      // 清除相关定时器
      if (timer) {
        clearInterval(timer);
      }
    }, delayedTime);
  });
}
let timeoutId;

let firstMessage = false;
// 两秒内收到多条消息，只执行最后一条，首次快速响应
function handleInfo(res, _this) {
  if (!firstMessage) {
    getInfo(res, _this);
    firstMessage = true;
    clearTimeout(infoTimer);
    infoTimer = setTimeout(() => {
      firstMessage = false;
    }, 3000);
  }
  // 清除之前的定时器
  clearTimeout(timeoutId);
  // 设置新的定时器
  timeoutId = setTimeout(() => {
    getInfo(res, _this);
  }, 2000);
}

function getQueryString(params) {
  if (params) {
    try {
      // 将对象转换为查询字符串
      return Object.keys(params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join('&');
    } catch (e) {
      return null;
    }
  }
}
let isFirst = false;
function getInfo(res, _this) {
  // 处理接收到的消息
  let data = res.data;
  try {
    data = JSON.parse(data);
    console.log('处理连接收到的消息_____________', data);
    let { type } = data || {};
    /*
	 * 
	 * play:  正常播放

		null： 默认页面

		UpGrade：升级

		StopPlay：停止

		startPlay:  开始播放

		deliver  下发资源
     */
    setStorageSync('programInfo', data);
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const queryParams = currentPage?.$page?.options;
    switch (type) {
      case 'startPlay':
        setStorageSync('playFlag', data.playFlag);
        let infoData = getStorageSync('programInfo');
        try {
          const {
            program: { resolution, modules, screenType },
          } = infoData;
          if (modules.length) {
            uni.$emit('pageRedirected');
            if (!currentPage || currentPage.route !== 'pages/custom/custom') {
              uni.redirectTo({
                url: `/pages/custom/custom?${getQueryString(queryParams)}`,
              });
            }
          }
        } catch (error) {}

        break;
      case 'stopPlay':
        setStorageSync('playFlag', data.playFlag);
        uni.$emit('pageRedirected');
        if (!currentPage || currentPage.route !== 'pages/index/index') {
          uni.redirectTo({
            url: '/pages/index/index',
          });
        }
        break;
      case 'play':
        if (!currentPage || currentPage.route !== 'pages/custom/custom') {
          let playFlag = getStorageSync('playFlag');
          uni.$emit('pageRedirected');
          if (!playFlag) {
            //   console.log('跳转到自定义节目模板页面');
            uni.redirectTo({
              url: `/pages/custom/custom?${getQueryString(queryParams)}`,
            });
          }
        }
        break;
      case 1:
        let resourceList = data?.resourceList;
        if (resourceList?.length) {
          handleResource(resourceList);
        }
        break;
      case 'null':
        setStorageSync('programInfo', null);
        uni.$emit('pageRedirected');
        if (!currentPage || currentPage.route !== 'pages/index/index') {
          uni.redirectTo({
            url: '/pages/index/index',
          });
        }
        break;
      case 'upGrade':
        try {
          $http.fetch('commonApi.getNewVersion', {}, {}).then((res) => {
            let versionUrl = res.data.wgtUrl;
            if (isFirst) {
              return;
            }
            isFirst = true;
            uni.downloadFile({
              url: versionUrl,
              success: (res) => {
                isFirst = false;
                if (res.statusCode === 200) {
                  // 下载好直接安装，下次启动生效
                  // #ifdef APP || APP-PLUS
                  plus.runtime.install(
                    res.tempFilePath,
                    {},
                    function () {
                      plus.runtime.restart();
                    },
                    function (e) {
                      //   console.error('安装失败', e);
                    }
                  );
                  // #endif
                }
              },
              complete: function (res) {
                isFirst = false;
              },
            });
          });
        } catch (e) {
          isFirst = false;
          //   console.error('处理系统升级失败', e);
        }
        break;
      default:
        setStorageSync('programInfo', null);
        uni.$emit('pageRedirected');
        if (!currentPage || currentPage.route !== 'pages/index/index') {
          uni.redirectTo({
            url: '/pages/index/index',
          });
        }
        break;
    }

    //刷新当前页面  避免重复冲定向导致页面闪动
    if (_this) {
      callMethod(_this, 'getPageInfo', res);
    }
  } catch (e) {
    console.error('处理消息失败', e);
  }
}

function callMethod(obj, methodName, ...args) {
  if (typeof obj[methodName] === 'function') {
    obj[methodName].apply(obj, args);
  }
}

function sendMessage(data) {
  if (socketTask) {
    uni.sendSocketMessage({
      data: JSON.stringify(data),
      success: (res) => {
        // console.log('WebSocket发送成功', res)
      },
      fail: (err) => {
        // console.error('WebSocket发送失败', err)
      },
    });
  } else {
    // console.warn('WebSocket未初始化，无法发送消息')
  }
}

async function closeWebSocket() {
  if (socketTask) {
    await uni.closeSocket({
      success: (res) => {
        console.log('WebSocket关闭成功001', res);
      },
      fail: (err) => {
        console.error('WebSocket关闭失败', err);
      },
    });
    // 清除相关定时器
    if (timer) {
      clearInterval(timer);
    }
  } else {
    console.warn('WebSocket未初始化，无法关闭');
    await uni.closeSocket({
      success: (res) => {
        console.log('WebSocket关闭成功114', res);
      },
      fail: (err) => {
        console.error('WebSocket关闭失败', err);
      },
    });
    // 清除相关定时器
    if (timer) {
      clearInterval(timer);
    }
  }
}
export { initWebSocket, listenWebSocketEvents, sendMessage, closeWebSocket };
