<template>
  <div class="canvas-region-wrap">
    <div
      class="canvas"
      ref="canvasRef"
      :style="{
        width: `${size.width}px`,
        height: `${size.height}px`,
      }"
    >
      <div
        v-for="(module, index) in modules"
        :key="index"
        style="width: 100%; height: 100%"
      >
        <div
          :style="`position:absolute;backgroundColor: ${module.backgroundColor}; width: ${module.position.w}px; height: ${module.position.h}px;top: ${module.position.y}px;left: ${module.position.x}px;background-color: ${module.backgroundColor};`"
        >
          <div
            class="img-inner"
            v-if="module.backgroundImage"
            style="position: absolute; left: 0; right: 0; top: 0; bottom: 0"
          >
            <!-- <div
              class="bg-img"
              style="
                flex: 0 0 100%;
                width: 100%;
                height: 100%;
                background-image: url(module.backgroundImage);
              "
            ></div> -->
            <image
              style="width: 100%; height: 100%"
              :src="module.backgroundImage"
            />
          </div>

          <div
            v-for="(ele, eIndex) in module.elements"
            :key="eIndex"
            :style="`position:absolute; width: ${ele.position.w}px; height: ${ele.position.h}px;top: ${ele.position.y}px;left: ${ele.position.x}px`"
          >
            <component
              :key="`ecom_${ele.id}`"
              :attributes="ele.attr"
              :is="getComponent(ele.type)"
            ></component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { onMounted, ref, watch, defineProps } from 'vue';
  // 元素组件
  import imageTpl from '@/components/Template/element/image/index.vue';
  import textTpl from '@/components/Template/element/text/index.vue';
  import videoTpl from '@/components/Template/element/video/index.vue';
  import audioTpl from '@/components/Template/element/audio/index.vue';

  import timeTpl from '@/components/Template/element/time/index.vue';
  import timepieceTpl from '@/components/Template/element/timepiece/index.vue';
  import documentTpl from '@/components/Template/element/document/index.vue';
  import htmlTpl from '@/components/Template/element/html/index.vue';
  import weatherTpl from '@/components/Template/element/weather/index.vue';
  import buttonTpl from '@/components/Template/element/button/index.vue';

  const props = defineProps({
    previewSize: {
      type: Object,
      required: false,
    },
    previewModules: {
      type: Array,
      required: false,
    },
  });
  const size = ref(props.previewSize);
  watch(
    () => props.previewSize,
    (newValue) => {
      size.value = newValue;
    }
  );
  const modules = ref(props.previewModules);
  watch(
    () => props.previewModules,
    (newValue) => {
      modules.value = newValue;
    }
  );
  const getComponent = (type) => {
    switch (type) {
      case 'image':
        return imageTpl;
      case 'video':
        return videoTpl;
      case 'audio':
        return audioTpl;
      case 'text':
        return textTpl;

      case 'time':
        return timeTpl;
      case 'timepiece':
        return timepieceTpl;
      case 'document':
        return documentTpl;
      case 'html':
        return htmlTpl;
      case 'weather':
        return weatherTpl;
      case 'button':
        return buttonTpl;

      default:
        return null; // 或者返回一个默认组件
    }
  };
  onMounted(() => {});
</script>

<style lang="scss" scope>
  .canvas-region-wrap {
    position: relative;
    width: 100%;
    height: 100%;

    // overflow: auto;
    .canvas {
      position: relative;
      left: 0;
      top: 0;
      user-select: none;
    }
  }
</style>
