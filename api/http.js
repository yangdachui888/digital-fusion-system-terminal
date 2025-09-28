import { pickApi } from '@/utils/tool.js';

const service = {};

service.fetch = (url, data, config) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: pickApi(url, data), //仅为示例，并非真实接口地址。
      data,
      method: config?.method ? config.method : 'get',
      headers: {
        'Content-Type': 'application/json',
      },
      success: (res) => {
        resolve(res.data);
      },
    });
  });
};
service.upload = (url, data, config) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: pickApi(url, data), //仅为示例，并非真实接口地址。
      filePath: data,
      name: 'file',
      formData: {},
      method: config?.method ? config.method : 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      success: (res) => {
        resolve(res.data);
      },
    });
  });
};

export default service;
