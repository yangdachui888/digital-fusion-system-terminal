<template>
	<!-- 
    使用一个div包裹web-view，并应用borderRadius。
    注意：这只能对视图层(VUE)的容器做裁剪，无法裁剪原生组件web-view本身。
    在安卓低版本上可能效果不佳，但在新版本上配合overflow:hidden通常能实现裁剪效果。
  -->
	<div class="webview-container" :style="containerStyle">
		<web-view v-if="viewerUrl" :src="viewerUrl"></web-view>
	</div>
</template>

<script setup>
import { ref, watch, defineProps, onMounted, computed } from 'vue';

const props = defineProps({
	attributes: {
		type: Object,
		default: () => ({})
	},
});

const viewerUrl = ref('');

// 计算容器样式，用于实现borderRadius
const containerStyle = computed(() => {
	const radius = props.attributes?.borderRadius || 0;
	return `border-radius: ${radius}px;`;
});

// 定义一个函数来根据属性更新URL
const updateViewerUrl = (attrs) => {
	if (!attrs || !attrs.documentUrl || !Array.isArray(attrs.documentUrl) || attrs.documentUrl.length === 0) {
		viewerUrl.value = '';
		console.warn('documentTpl: attributes.documentUrl is missing, not an array, or empty.');
		return;
	}

	// 1. 获取PDF文件地址
	const file = attrs.documentUrl[0];

	// 2. 获取自动播放间隔。为了复现您之前的2秒翻页功能，我们这里写死2000ms。
	// 如果需要动态控制，可以从attrs中读取，例如：const interval = attrs.autoPlayInterval || 0;
	const interval = 2000; // 复现2秒翻页功能

	// 3. 将objectFit映射为渲染比例scale
	let scale = 1.5; // 默认值
	if (attrs.objectFit === 'contain') {
		scale = 1.0;
	} else if (attrs.objectFit === 'cover') {
		scale = 2.0;
	} // 可以根据需要添加更多映射

	// 4. 拼接最终的URL，并对文件路径进行编码
	const baseUrl = '/static/pdf-viewer/viewer.html';
	const finalUrl = `${baseUrl}?file=${encodeURIComponent(file)}&interval=${interval}&scale=${scale}`;

	console.log('WebView URL:', finalUrl);
	viewerUrl.value = finalUrl;
};

// 在组件挂载和属性更新时调用函数
onMounted(() => {
	updateViewerUrl(props.attributes);
});

watch(
	() => props.attributes,
	(newValue) => {
		updateViewerUrl(newValue);
	},
	{ deep: true } // 使用深度监听，确保内部属性变化也能被捕获
);
</script>

<style scoped>
.webview-container {
	width: 100%;
	height: 100%;
	overflow: hidden; /* 关键：配合border-radius实现对内部内容的裁剪 */
}
</style>