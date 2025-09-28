<template>
  <div style="position: relative">
    <div class="restart-wrap" @dblclick.prevent="restartApp()"></div>
    <preview-page
      :previewSize="previewData.size"
      :previewModules="previewData.data"
    ></preview-page>
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
  import { listenWebSocketEvents } from '@/utils/socket.js';
  import previewPage from '@/components/Template/previewPage.vue';
  export default {
    data() {
      return {
        previewData: {
          size: {},
          data: [],
        },
      };
    },
    components: {
      previewPage,
    },
    onShow() {
      this.getPageInfo();
      listenWebSocketEvents(this);
    },
    onUnload() {},
    onHide() {},
    beforeDestroy() {},
    onLoad() {},
    methods: {
      getSizeByResolution(resolution, screenType = 0) {
        const regex = /x|\*/;
        const parts = resolution.split(regex);
        if (parts.length !== 2) {
          return {
            screenType,
            width: 100,
            height: 100,
          };
        }
        const [firstPart, secondPart] = parts;
        const orderedParts =
          screenType === 0 ? [firstPart, secondPart] : [secondPart, firstPart];
        const width = Number(orderedParts[0]);
        const height = Number(orderedParts[1]);
        return {
          screenType,
          width,
          height,
        };
      },

      getPageInfo() {
        try {
          let ratio = 1;
          // #ifdef APP || APP-PLUS
          const { devicePixelRatio } = uni.getDeviceInfo();
          ratio = devicePixelRatio || 1;
          // #endif
          let infoData = getStorageSync('programInfo');
          const {
            program: { resolution, modules, screenType },
          } = infoData;
          let { width, height } = this.getSizeByResolution(
            resolution,
            screenType
          );
          width = width / ratio;
          height = height / ratio;
          if (modules && modules.length) {
            modules.forEach((item, index1) => {
              item.position = {
                x: Number(item.x) / ratio,
                y: Number(item.y) / ratio,
                w: Number(item.w) / ratio,
                h: Number(item.h) / ratio,
              };
              if (item.elements && item.elements.length) {
                item.elements.forEach((ele, index2) => {
                  ele.active = false;
                  ele.draggableVal = false;
                  ele.position = {
                    x: Number(ele.x) / ratio,
                    y: Number(ele.y) / ratio,
                    w: Number(ele.w) / ratio,
                    h: Number(ele.h) / ratio,
                  };
                  if (ele.attributes && ele.attributes.length) {
                    ele.attr = {};
                    ele.attributes.forEach((attr, index3) => {
                      let numAttr = ['fontSize', 'lineHeight', 'borderRadius'];
                      if (numAttr.includes(attr.attKey)) {
                        let calAttrArr = attr.attValue.match(/(\d+)(px)?/);

                        if (
                          calAttrArr &&
                          calAttrArr.length &&
                          calAttrArr.length > 1
                        ) {
                          let calAttValue = Number(calAttrArr[1]) / ratio;
                          if (calAttrArr[2]) {
                            calAttValue += calAttrArr[2];
                          }
                          attr.attValue = JSON.stringify(calAttValue);
                        }
                      }
                      ele.attr[attr.attKey] = JSON.parse(attr.attValue);
                    });
                  }
                });
              }
            });
          }
          this.previewData = {
            size: {
              width,
              height,
            },
            data: modules,
          };
        } catch (e) {
          //TODO handle the exception
        }
      },
      restartApp() {
        restartApp();
      },
    },
  };
</script>

<style lang="scss" scoped></style>
