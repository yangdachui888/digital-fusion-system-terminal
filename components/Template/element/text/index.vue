<template>
  <div class="whi100">
    <textarea
      class="whi100 text-item"
      v-model="state.attr.word"
      tabindex="0"
      autocomplete="off"
      placeholder="我是文本"
      :readOnly="true"
      resize="none"
      :style="`font-size:${state?.attr?.fontSize}px;color:${state.attr?.color};line-height:${state.attr?.lineHeight};text-align:${state.attr?.textAlign};font-family:${state.attr?.fontFamily};font-weight:${state.attr?.fontWeight};text-decoration:${state.attr?.textDecoration};`"
    ></textarea>
  </div>
</template>

<script setup>
  import { reactive, toRefs, watch, defineProps, onMounted } from 'vue';
  const props = defineProps({
    attributes: Object,
  });
  const state = reactive({
    attr: {
      word: null,
    },
  });

  watch(
    () => props.attributes,
    (newValue) => {
      if (newValue) {
        state.attr = newValue;
        setFontSize(state.attr?.fontSize);
      }
    }
  );
  function setFontSize(val) {
    let ratio = 1;
    // #ifdef APP || APP-PLUS
    const { devicePixelRatio } = uni.getDeviceInfo();
    ratio = devicePixelRatio || 1;
    // #endif
    state.attr.fontSize = val / ratio;
  }

  onMounted(() => {
    if (props.attributes) {
      state.attr = props.attributes;
      setFontSize(state.attr?.fontSize);
    }
  });
</script>
<style lang="scss" scoped>
  .text-item {
    background: transparent;
    border: none;
    /* 重置可能影响角标的样式 */
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    resize: none;
  }
  textarea::-webkit-scrollbar {
    /* 滚动条宽度 */
    width: 0;
  }

  textarea::-webkit-scrollbar-track {
    /* 滚动条轨道背景色 */
    background-color: transparent;
  }

  textarea::-webkit-scrollbar-thumb {
    /* 滚动条滑块颜色 */
    background-color: transparent;
    /* 滑块圆角 */
    border-radius: 4px;
  }

  textarea::-webkit-scrollbar-thumb:hover {
    /* 鼠标悬浮在滑块上时的颜色 */
    background-color: transparent;
  }
</style>
