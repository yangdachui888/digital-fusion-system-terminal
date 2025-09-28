<template>
  <div
    class="whi100"
    :style="`border-radius:${state.attr?.borderRadius}px;overflow:hidden;`"
  >
    <template v-if="state.attr?.imgUrl && state.attr?.imgUrl.length > 0">
      <swiper
        class="whi100"
        :indicator-dots="true"
        :autoplay="true"
        :interval="3000"
        :duration="500"
      >
        <swiper-item v-for="(url, index) in state.attr.imgUrl" :key="index">
          <image
            :src="url"
            alt=""
            class="whi100"
            :style="`object-fit:${state.attr?.objectFit}`"
          />
        </swiper-item>
      </swiper>
    </template>
  </div>
</template>
<script setup>
import { reactive, watch, defineProps, onMounted } from 'vue';

const props = defineProps({
  attributes: Object,
});

const state = reactive({
  attr: {
    imgUrl: [],
    borderRadius: 0,
    objectFit: 'cover', // 默认值，可以根据需要调整
  },
});

watch(
  () => props.attributes,
  (newValue) => {
    console.log('image 001', newValue);
    state.attr = newValue;
  }
);

onMounted(() => {
  state.attr = props.attributes;
});
</script>

<style scoped>
.whi100 {
  width: 100%;
  height: 100%;
}

swiper {
  width: 100%;
  height: 100%;
}

swiper-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

image {
  width: 100%;
  height: 100%;
}
</style> 