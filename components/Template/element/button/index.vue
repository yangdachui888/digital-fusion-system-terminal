<template>
  <div class="whi100">
    <div
      class="whi100"
      v-if="state.attr?.word || state.attr?.btnWidth || state.attr?.btnHeight"
      :style="`font-size:${state.attr?.fontSize}px;color:${state.attr?.color};background-color:${state.attr?.btnBgColor};border:${state.attr?.borderSize}px solid ${state.attr?.borderColor};border-radius:${state.attr?.borderRadius}px`"
      :class="state.attr?.textAlign"
    >
      {{ state.attr?.word }}
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
  });

  watch(
    () => props.attributes,
    (newValue) => {
      state.attr = newValue;
    }
  );
  onMounted(() => {
    state.attr = props.attributes;
  });
</script>
<style scoped lang="scss">
  .sty-left {
    text-align: left;
  }
  .sty-right {
    text-align: right;
  }
  .sty-xCenter {
    display: flex;
    justify-content: center;
  }
  .sty-yCenter {
    display: flex;
    align-items: center;
  }
  .sty-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
