<template>
  <div class="whi100">
    <div
      v-if="
        state.attr?.showDate || state.attr?.showTime || state.attr?.showWeek
      "
      :style="`font-size:${state?.attr?.fontSize}px;color:${state.attr?.color};line-height:${state.attr?.lineHeight};font-family:${state.attr?.fontFamily};font-weight:${state.attr?.fontWeight}`"
    >
      <span
        :style="`margin-right: ${state.attr?.timeSpace}px`"
        v-if="state.attr?.showDate"
      >
        {{ state.formatTime.date }}
      </span>
      <span
        :style="`margin-right: ${state.attr?.timeSpace}px`"
        v-if="state.attr?.showTime"
      >
        {{ state.formatTime.time }}
      </span>
      <span v-if="state.attr?.showWeek">
        {{ state.formatTime.week }}
      </span>
    </div>
  </div>
</template>

<script setup>
  import {
    reactive,
    toRefs,
    watch,
    defineProps,
    onMounted,
    onUnmounted,
  } from 'vue';

  const props = defineProps({
    attributes: Object,
  });

  const state = reactive({
    attr: {},
    formatTime: {
      date: null,
      week: null,
      time: null,
    },
    intervalTimer: null,
  });
  watch(
    () => props.attributes,
    (newValue) => {
      if (newValue) {
        state.attr = newValue;
        updateTime();
        clearTimer();
        state.intervalTimer = setInterval(updateTime, 1000);
      }
    }
  );

  function updateTime() {
    const now = new Date();
    state.attr.time = now.toLocaleString();
    if (state.attr.showDate) {
      state.formatTime.date = formatDate(
        state.attr.time,
        state.attr.dateFormat
      );
    }
    if (state.attr.showWeek) {
      state.formatTime.week = formatDate(
        state.attr.time,
        state.attr.weekFormat
      );
    }
    if (state.attr.showTime) {
      if (state.attr?.timeH === '12H') {
        state.attr.timeFormat = state.attr.timeFormat.replace('HH', 'hh');
        state.formatTime.time = formatDate(
          state.attr.time,
          state.attr.timeFormat
        );
      } else {
        state.attr.timeFormat.replace('hh', 'HH');
        state.formatTime.time = formatDate(
          state.attr.time,
          state.attr.timeFormat
        );
      }
    }
  }

  function getWeekNumber(a, b, c) {
    /*
		date1是当前日期
		date2是当年第一天
		d是当前日期是今年第多少天
		用d + 当前年的第一天的周差距的和在除以7就是本年第几周
		*/
    var date1 = new Date(a, parseInt(b) - 1, c),
      date2 = new Date(a, 0, 1),
      d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    return Math.ceil((d + (date2.getDay() + 1)) / 7);
  }

  // 定义时间格式化函数
  function formatDate(
    date,
    format = 'YYYY-MM-DD HH:mm:ss cnWeek cnShortWeek enWeek enShortWeek numWeek ww'
  ) {
    if (!date) return '';
    date = new Date(date);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const wwVal = String(getWeekNumber(year, month, day)).padStart(2, '0');

    // 获取星期
    const daysOfWeekCn = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ];
    const daysOfWeekCnShort = [
      '周日',
      '周一',
      '周二',
      '周三',
      '周四',
      '周五',
      '周六',
    ];
    const daysOfWeekEn = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const daysOfWeekEnShort = [
      'Sun.',
      'Mon.',
      'Tue.',
      'Wed.',
      'Thu.',
      'Fri.',
      'Sat.',
    ];
    const dayOfWeekCn = daysOfWeekCn[date.getDay()];
    const dayOfWeekCnShort = daysOfWeekCnShort[date.getDay()];
    const dayOfWeekEn = daysOfWeekEn[date.getDay()];
    const dayOfWeekEnShort = daysOfWeekEnShort[date.getDay()];

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
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', formattedHours)
      .replace('hh', formattedApHours)
      .replace('mm', minutes)
      .replace('ss', seconds)
      .replace('cnWeek', dayOfWeekCn)
      .replace('cnShortWeek', dayOfWeekCnShort)
      .replace('enWeek', dayOfWeekEn)
      .replace('enShortWeek', dayOfWeekEnShort)
      .replace('am', ampm)
      .replace('pm', ampm)
      .replace('numWeek', dayOfNumWeek)
      .replace('ww', wwVal);
  }
  onUnmounted(() => {
    clearTimer();
  });

  //   onBeforeRouteLeave((to, from) => {
  //     // 处理路由离开前的逻辑
  //     clearTimer();
  //   });
  function clearTimer() {
    clearInterval(state.intervalTimer);
    state.intervalTimer = null;
  }
  onMounted(() => {
    if (props.attributes) {
      state.attr = props.attributes;
      updateTime(); // 立即显示一次初始时间
      clearTimer();
      state.intervalTimer = setInterval(updateTime, 1000);
    }
  });
</script>
