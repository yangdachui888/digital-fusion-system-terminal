<template>
  <div class="whi100">
    <div
      class="whi100 weather-wrap"
      v-if="state.weather.city"
      :style="weatherStyle"
    >
      <span v-if="state.attr.showCity" :style="{ marginRight: state.attr.space + 'px' }">
        {{ state.weather.city }}
      </span>
      <span v-if="state.attr.showType" :style="{ marginRight: state.attr.space + 'px' }">
        {{ state.weather.type }}
      </span>
      <span v-if="state.attr.showWendu" :style="{ marginRight: state.attr.space + 'px' }">
        {{ state.weather.wendu }}℃
      </span>
      <span v-if="state.attr.showHighLow" :style="{ marginRight: state.attr.space + 'px' }">
        {{ state.weather.high }} / {{ state.weather.low }}
      </span>
      <span v-if="state.attr.showFx" :style="{ marginRight: state.attr.space + 'px' }">
        {{ state.weather.fx }} {{ state.weather.fl }}
      </span>
      <span v-if="state.attr.showAqi" :style="{ marginRight: state.attr.space + 'px' }">
        当前AQI为{{ state.weather.aqi }}
      </span>
      <span v-if="state.attr.showYmd">{{ state.weather.ymd }}</span>
      <span v-if="state.attr.showNotice" :style="{ marginTop: state.attr.space + 'px', display: 'block' }">
        {{ state.weather.notice }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, defineProps, onMounted } from 'vue';
import $http from '@/api/http.js'; // 确保这个路径是正确的，并且$http已经配置好

const props = defineProps({
  attributes: {
    type: Object,
    required: true
  }
});

const state = reactive({
  attr: { ...props.attributes, showHighLow: true }, // 默认显示高低温
  weather: {}
});

// 计算属性用于动态样式
const weatherStyle = computed(() => ({
  fontSize: state.attr.fontSize + 'px',
  color: state.attr.color,
  lineHeight: state.attr.lineHeight,
  fontFamily: state.attr.fontFamily,
  fontWeight: state.attr.fontWeight,
}));

watch(
  () => props.attributes,
  (newValue) => {
    state.attr = { ...newValue, showHighLow: true }; // 保持showHighLow的默认值
    if (newValue.cityCode) {
      getWeather(newValue.cityCode);
    }
  },
  { immediate: true, deep: true }
);

async function getWeather(cityCode) {
  try {
    const { data } = await $http.fetch('commonApi.getWeather', { cityCode });
    state.weather = data; // 根据您的接口响应，data.data是天气数据对象
  } catch (error) {
    console.error('获取天气数据失败:', error);
    // 可以在这里处理错误，比如设置错误状态或显示错误消息
  }
}

// 组件挂载时，如果已有cityCode则获取天气
onMounted(() => {
  if (state.attr.cityCode) {
    getWeather(state.attr.cityCode);
  }
});
</script>
