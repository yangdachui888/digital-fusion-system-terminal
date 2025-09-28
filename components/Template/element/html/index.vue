<template>
  <div class="whi100">
    <iframe
      class="whi100"
      v-if="state.attr?.htmlUrl"
      :src="state.attr?.htmlUrl"
    ></iframe>
  </div>
</template>

<script setup>
  import { reactive, toRefs, watch, defineProps, onMounted } from 'vue';

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
      console.log(state.attr, 222);
    }
  );
  onMounted(() => {
    state.attr = props.attributes;
    console.log(state.attr, 111);
  });
</script>
