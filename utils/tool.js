import { Api } from '@/api/ApiConfig.js';

function pickApi(api = '', data = {}) {
  let fields = api.split('.');
  let apiGroupName = fields[0]; // 获取api组名
  // 获取到对应的url
  let url = fields.reduce((target, key) => {
    if (target && typeof target !== 'string') {
      target = target[key];
    }
    return target;
  }, Api);

  //绝对路径直接返回
  if (/^http/.test(url)) {
    return url;
  }
  // 服务模块地址
  let SERVICE_PATH = getApp().globalData.baseUrl;
  url = (url && url.startsWith('/') ? '' : '/') + url;
  url = buildUrl(url, data);
  url = SERVICE_PATH + url;
  return url;
}

function buildUrl(baseUrl, params) {
  return baseUrl.replace(/:\w+/g, (match) => {
    const key = match.slice(1); // 去掉冒号，获取键名
    return params[key] || ''; // 从 params 对象中获取对应的值
  });
}

function formatDate(date, format = 'yyyy-MM-dd HH:mm:ss week numWeek') {
  if (!date) return '';
  date = new Date(date);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // 获取星期
  const daysOfWeek = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];

  // 获取星期数字
  const daysOfNumWeek = [7, 1, 2, 3, 4, 5, 6];
  const dayOfNumWeek = daysOfNumWeek[date.getDay()];

  let apHours = date.getHours();
  // 处理 12 小时制
  let ampm = 'am';
  if (apHours >= 12) {
    ampm = 'pm';
    if (apHours > 12) {
      apHours -= 12;
    }
  }

  // 格式化小时数
  const formattedHours = format.includes('HH')
    ? String(hours).padStart(2, '0')
    : String(hours).padStart(2, '0');

  const formattedApHours = format.includes('HH')
    ? String(apHours).padStart(2, '0')
    : String(apHours).padStart(2, '0');

  return format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', formattedHours)
    .replace('hh', formattedApHours)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('week', dayOfWeek)
    .replace('am', ampm)
    .replace('pm', ampm)
    .replace('numWeek', dayOfNumWeek);
}
let countdownTimer = null;

function startCountdown(targetDate) {
  const targetTime = targetDate.getTime(); // 获取目标时间的毫秒值
  let currentTime = new Date().getTime(); // 获取当前时间的毫秒值
  let remainingTime = targetTime - currentTime; // 计算剩余时间

  const countdownElement = document.getElementById('countdown');
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    currentTime = new Date().getTime();
    remainingTime = targetTime - currentTime;

    if (remainingTime <= 0) {
      clearInterval(countdownTimer);
      countdownElement.textContent = '倒计时结束！';
      return;
    }

    const minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    countdownElement.textContent = `剩余时间: ${minutes} 分 ${seconds} 秒`;
  }, 1000); // 每隔 1 秒执行一次
}

function setGlobalData(key, value) {
  getApp().globalData[key] = value;
}

function getWeaterIconFont(weaterTxt) {
  switch (weaterTxt) {
    case '晴':
    case '晴天':
      return 'icon-qingtian';
    case '多云':
      return 'icon-duoyun';
    case '阴':
    case '阴天':
      return 'icon-yintian';
    case '晴转多云':
      return 'icon-qingzhuanduoyun';
      break;
    case '雨':
      break;
    case '小雨':
      return 'icon-xiaoyu';
    case '中雨':
      return 'icon-zhongyu';
    case '阵雨':
      return 'icon-zhenyu';
      break;
    case '雷阵雨':
      return 'icon-leizhenyu';
    case '暴雨':
    case '大雨':
      return 'icon-baoyu';
      break;
    case '雾':
      return 'icon-wu';
      break;
    case '雨夹雪':
      return 'icon-yuxue';
      break;
    case '小雪':
    case '雪':
      return 'icon-xiaoxue';
      break;
    case '中雪':
      return 'icon-zhongxue';
      break;
    case '阵雪':
      return 'icon-zhenxue';
      break;
    case '大雪':
    case '暴雪':
    case '暴风雪':
      return 'icon-baoxue';
      break;
    case '冰雹':
      return 'icon-bingbao';
      break;
    default:
      return '';
  }
}

function getWeaterIcon(weaterTxt) {
  switch (weaterTxt) {
    case '晴':
    case '晴天':
      return 'i-qingtian';
    case '多云':
      return 'i-duoyun';
    case '阴':
    case '阴天':
      return 'i-yintian';
    case '晴转多云':
      return 'i-qingzhuanduoyun';
      break;
    case '雨':
    case '小雨':
      return 'i-xiaoyu';
    case '中雨':
      return 'i-zhongyu';
    case '阵雨':
    case '雷阵雨':
      return 'i-leizhenyu';
    case '暴雨':
    case '大雨':
      return 'i-baoyu';
      break;
    case '雾':
      return 'i-wu';
      break;
    case '雨夹雪':
      return 'i-yujiaxue';
      break;
    case '小雪':
    case '雪':
      return 'i-xiaoxue';
      break;
    case '中雪':
      return 'i-zhongxue';
      break;
    case '阵雪':
      return 'icon-zhenxue';
      break;
    case '大雪':
      return 'i-daxue';
      break;
    case '暴雪':
    case '暴风雪':
      return 'i-baoxue';
      break;
    case '冰雹':
      return 'i-bingbao';
      break;
    default:
      return '';
  }
}

function setStorageSync(key, value) {
  try {
    uni.setStorageSync(key, JSON.stringify(value));
  } catch (e) {
    // error
  }
}

function getStorageSync(key) {
  try {
    const value = uni.getStorageSync(key);
    if (value) {
      return JSON.parse(value);
    }
  } catch (e) {
    // error
  }
}

function handleResource(fileList) {
  fileList.forEach((item) => {
    let oriFileName = item.split('/').pop().split('.').shift();
    let oriFileExtension = '.' + item.split('.').pop();

    uni.downloadFile({
      url: item,
      success: (downloadRes) => {
        // console.log('文件下载成功', item, downloadRes.tempFilePath);
        uni.getSavedFileList({
          success: function (getSaveFile) {
            if (getSaveFile.fileList.length) {
              // console.log('存在本地资源', getSaveFile.fileList);
              let forFlag = false;
              getSaveFile.fileList.forEach((file) => {
                if (file.filePath.includes(oriFileName)) {
                  forFlag = true;
                  handleExistingFile(
                    downloadRes.tempFilePath,
                    file.filePath,
                    oriFileName,
                    oriFileExtension
                  );
                }
              });
              if (!forFlag) {
                handleNewFile(
                  downloadRes.tempFilePath,
                  oriFileName,
                  oriFileExtension
                );
              }
            } else {
              handleNewFile(
                downloadRes.tempFilePath,
                oriFileName,
                oriFileExtension
              );
            }
          },
        });
      },
      fail: (err) => {
        console.log('下载资源失败:', err);
      },
      complete: (res) => {},
    });
  });
}

function handleExistingFile(
  tempFilePath,
  oldFilePath,
  oriFileName,
  oriFileExtension
) {
  uni.removeSavedFile({
    filePath: oldFilePath,
    complete: function (removeRes) {
      // console.log('移除文件 001', removeRes);
      handleNewFile(tempFilePath, oriFileName, oriFileExtension);
    },
  });
}

function handleNewFile(tempFilePath, oriFileName, oriFileExtension) {
  uni.saveFile({
    tempFilePath: tempFilePath,
    success: function (saveRes) {
      // console.log(
      // 	'保存文件 成功',
      // 	saveRes.savedFilePath,
      // 	oriFileName
      // );
      let oldSavedFilePath = saveRes.savedFilePath;
      renameFile(oldSavedFilePath, oriFileName, oriFileExtension);
    },
  });
}

function renameFile(oldFilePath, oriFileName, oriFileExtension) {
  plus.io.resolveLocalFileSystemURL(oldFilePath, (entry) => {
    entry.getParent((_oldFile) => {
      entry.moveTo(
        _oldFile,
        '/' + oriFileName + oriFileExtension,
        (newFilePath) => {
          console.log('重命名文件名', newFilePath.fullPath);
          openFile();
        }
      );
    });
  });
}
function openFile() {
  console.log('开始打开文件');
  uni.getSavedFileList({
    success: function (getSaveFile) {
      if (getSaveFile.fileList.length) {
        console.log('存在本地资源', getSaveFile.fileList);
        getSaveFile.fileList.forEach((file) => {
          // uni.openDocument({
          //   filePath: file.filePath,
          //   success: function (res) {
          //     // console.log('打开文档成功');
          //   },
          // });
        });
      }
    },
  });
}
function restartApp() {
  // #ifdef H5
  return;
  // #endif
  uni.getSystemInfo({
    success: (res) => {
      let appVersion = res.appVersion || null;
      let appWgtVersion = res.appWgtVersion || null;
      uni.showModal({
        title: '温馨提示',
        content:
          '当前版本号' +
          appWgtVersion +
          ',apk版本号' +
          appVersion +
          ',是否重启应用？',
        success: (res) => {
          if (res.confirm) {
            plus.runtime.restart();
          }
        },
        fail: (res) => {},
      });
    },
  });
}

export {
  pickApi,
  formatDate,
  startCountdown,
  setGlobalData,
  getWeaterIcon,
  setStorageSync,
  getStorageSync,
  restartApp,
  handleResource,
};
