<template>
  <div class="page-wrap">
    <div class="header flex-sb y-center">
      <div class="restart-wrap" @dblclick.native="restartApp()"></div>
      <div class="y-center" :style="`color: #fff; padding: ${size.px30}px`">
        <div :style="`font-size: ${size.px48}px; margin-right: ${size.px20}px`">
          {{ timeInfo?.time }}
        </div>
        <div :style="`font-size: ${size.px24}px`">
          <div>{{ timeInfo?.week }}</div>
          <div>{{ timeInfo?.date }}</div>
        </div>
      </div>
    </div>
    <scroll-view class="main" scroll-y="true">
      <div style="height: 100%" class="center">
        <div class="m-pd bg-c br18 t-m">
          <div
            class="flex t-left br18 column center bg-lg"
            :style="`width: 100%;overflow: hidden;`"
          >
            <div class="flex center" style="padding: 30px 60px 80px">
              <div class="center column">
                <div
                  class="bg-img"
                  :style="
                    'width: 333px;height: 270px;background-image: url(/static/' +
                    weaterInfo?.weaterIcon +
                    '.png);'
                  "
                ></div>
                <div style="color: #004fc4; font-size: 50px; margin-top: 30px">
                  {{ weaterInfo?.type }}
                </div>
              </div>
              <div class="center column" style="margin-left: 100px">
                <div style="font-size: 50px; color: #004fc4; margin-top: 20px">
                  {{ weaterInfo?.city }}
                  <span
                    style="
                      font-size: 50px;
                      color: #0d0d0d;
                      margin-top: 20px;
                      margin-left: 20px;
                    "
                  >
                    {{ weaterInfo.low }}~{{ weaterInfo.high }}℃
                  </span>
                </div>
                <div style="font-size: 40px; color: #000; margin-top: 30px">
                  {{ timeInfo?.mdDate }}
                </div>
                <div style="font-size: 40px; color: #000000; margin-top: 20px">
                  {{ timeInfo?.week }}
                </div>

                <div
                  class="center time-wrap"
                  style="margin-top: 50px"
                  v-if="timeInfo?.timeHH || timeInfo?.timemm"
                >
                  <div class="item center">{{ timeInfo?.timeHH }}</div>
                  <div style="font-size: 40px; margin: 0 30px">:</div>
                  <div class="item center">{{ timeInfo?.timemm }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
  import $http from '@/api/http.js';
  import {
    setGlobalData,
    formatDate,
    getWeaterIcon,
    getStorageSync,
    restartApp,
  } from '@/utils/tool';
  import { listenWebSocketEvents, initWebSocket } from '@/utils/socket.js';

  export default {
    data() {
      return {
        dpr: getStorageSync('dpr') || 1, // 默认值为 1
        ratio: 1,
        nowTime: null,
        intervalId: null,
        timeInfo: {
          time: '',
          week: '',
          date: '',
        },
        weaterInfo: {
          wendu: '',
          type: '',
          weaterIcon: '',
        },
      };
    },
    computed: {
      size() {
        return {
          px20: Number(20 / this.ratio),
          px24: Number(24 / this.ratio),
          px30: Number(30 / this.ratio),
          px48: Number(48 / this.ratio),
          px100: Number(100 / this.ratio),
        };
      },
    },
    mounted() {
      uni.$on('pageRedirected', () => {
        clearInterval(this.intervalId);
      });
    },
    async onShow() {
      // #ifdef APP || APP-PLUS
      const { devicePixelRatio } = uni.getDeviceInfo();
      this.ratio = devicePixelRatio || 1;

      this.getNowTime();
      this.getWeater();

      await initWebSocket();
      listenWebSocketEvents(this);
    },

    onLoad() {},
    onUnload() {
      clearInterval(this.intervalId);
    },
    onHide() {
      clearInterval(this.intervalId);
    },
    beforeDestroy() {
      clearInterval(this.intervalId);
    },
    methods: {
      restartApp() {
        restartApp();
      },
      // 获取系统时间
      async getNowTime() {
        let nowTime = null;
        try {
          //   let { data } = await $http.fetch('commonApi.getNowTime', {}, {});
          let data = new Date();
          nowTime = data;
        } catch (e) {
          //TODO handle the exception
          console.log('获取时间失败');
        }
        this.nowTime = new Date(nowTime);
        setGlobalData('nowTime', nowTime);
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.updateCurrentTime, 1000);
      },
      updateCurrentTime() {
        let lastUpdateTime = Date.now();
        const elapsed = new Date(this.nowTime).getTime() - lastUpdateTime;
        this.nowTime = new Date(lastUpdateTime + 1000 + elapsed);
        this.timeInfo = {
          time: formatDate(this.nowTime, 'HH:mm'),
          week: formatDate(this.nowTime, 'week'),
          date: formatDate(this.nowTime, 'yyyy/MM/dd'),
          mdDate: formatDate(this.nowTime, 'MM/dd'),
          timeHH: formatDate(this.nowTime, 'HH'),
          timemm: formatDate(this.nowTime, 'mm'),
        };
      },
      extractNumber(temperatureStr) {
        const match = temperatureStr.match(/(\d+)/);
        if (match) {
          return match[1];
        } else {
          return temperatureStr;
        }
      },
      //获取天气
      async getWeater() {
        // let { data } = await $http.fetch('commonApi.getWeather', {}, {});
        let data = {
          wendu: '14',
          type: '晴',
          low: '9',
          high: '15',
          city: '南京',
        };
        if (data) {
          data.low = this.extractNumber(data.low);
          data.high = this.extractNumber(data.high);
          data.weaterIcon = getWeaterIcon(data.type);
          console.log(data, 7);
          this.weaterInfo = data;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .page-wrap {
    background: url(~@/static/s/v-bg.png);
    background-size: cover;

    .t-m {
      display: flex;

      .t-left {
        .time-wrap {
          .item {
            width: 92px;
            height: 92px;
            border-radius: 8px;
            overflow: hidden;
            font-size: 46px;
            font-weight: bold;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
            background-color: rgba(255, 255, 255, 1);
          }
        }
      }
    }
  }
</style>
