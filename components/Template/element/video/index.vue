<template>
	<div class="whi100 relative">
		<div class="whi100 relative" v-if="state.attr?.videoUrl">
			<video :autoplay="true"  :loop="true" :src="state.attr.videoUrl" class="video-player whi100"
				:style="`object-fit:${state.attr?.objectFit}`" :controls="false" :enable-progress-gesture="false" :show-progress="false" >
				你的app暂时不支持视频播放。
			</video>
		</div>
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
		default: {},
	});
	const state = reactive({
		attr: {
			videoUrl: null,
			objectFit: null,
		},
	});
	const videoRef = ref(null);

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
	/* 样式优化 */
	.video-player {
		width: 100%;
		height: 100%;
		/* 调整高度以适应卡片容器 */
	}

	video {
		width: 100%;
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