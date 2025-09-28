<template>
  <div
    class="whi100 relative"
    :style="state.attr?.hiddenEle ? 'visibility:hidden' : ' '"
  >
    <!-- #ifdef APP-PLUS -->
    <div v-if="state.attr?.audioUrl" class="audio-player">
      <audio
        ref="audioRef"
        :autoplay="true"
        :loop="state.attr.loop"
        :src="state.attr.audioUrl"
      />
    </div>
    <!-- #endif -->
  </div>
</template>

<script setup>
  import {
    ref,
    reactive,
    toRefs,
    watch,
    defineProps,
    onMounted,
    nextTick,
  } from 'vue';

  const props = defineProps({
    attributes: Object,
  });
  const state = reactive({
    attr: {
      hiddenEle: false,
      audioUrl: null,
    },
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
  .audio-player {
    display: flex;
    align-items: center;
  }

  .controls {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background: rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    .controls-btn {
      width: 20%;
      height: 100%;
      min-width: 30px;

      .btn-icon {
        color: #ccc;
      }
    }
  }
</style>
