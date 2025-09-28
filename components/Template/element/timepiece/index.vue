<template>
  <div class="whi100">
    <div
      v-if="state.attr?.targetTime"
      :style="`font-size:${state?.attr?.fontSize}px;color:${state.attr?.color};line-height:${state.attr?.lineHeight};font-family:${state.attr?.fontFamily};font-weight:${state.attr?.fontWeight}`"
    >
      <span>
        {{ state.time }}
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
    time: 0,
    intervalTimer: null,
  });
  watch(
    () => props.attributes,
    (newValue) => {
      if (newValue) {
        state.attr = newValue;
        clearTimer();
        state.intervalTimer = setInterval(() => {
          startTimer();
        }, 1000);
      }
    }
  );

  function startTimer() {
    state.time = calTime();
  }

  function isTimeFormatValid(timeStr) {
    const date = new Date(timeStr);
    return !isNaN(date.getTime());
  }

  // 倒计时
  function calTime() {
    const isValid = isTimeFormatValid(state.attr.targetTime);
    if (!isValid) {
      return 0;
    }
    let remainingTime = new Date(state.attr.targetTime) - Date.now();
    if (state.attr.timeFormatted === 'elapsed') {
      remainingTime = Date.now() - new Date(state.attr.targetTime);
    }

    if (remainingTime <= 0) {
      return '0';
    }
    if (state.attr.timeFormat === 'days') {
      const days = remainingTime / (1000 * 60 * 60 * 24);
      return days.toFixed(2);
    } else if (state.attr.timeFormat === 'hours') {
      const hours = (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
      return hours.toFixed(2);
    } else if (state.attr.timeFormat === 'minutes') {
      const minutes = (remainingTime % (1000 * 60 * 60)) / (1000 * 60);
      return minutes.toFixed(0);
    } else if (state.attr.timeFormat === 'seconds') {
      const seconds = Math.floor(remainingTime / 1000);
      return seconds.toFixed(0);
    }
    return 0;
  }

  function clearTimer() {
    clearInterval(state.intervalTimer);
    state.intervalTimer = null;
  }
  onUnmounted(() => {
    clearTimer();
  });

  //   onBeforeRouteLeave((to, from) => {
  //     // 处理路由离开前的逻辑
  //     clearTimer();
  //   });

  onMounted(() => {
    if (props.attributes) {
      state.attr = props.attributes;
      clearTimer();
      state.intervalTimer = setInterval(() => {
        startTimer();
      }, 1000);
    }
  });
</script>
