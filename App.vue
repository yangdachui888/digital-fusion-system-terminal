<style lang="scss"></style>

<script>
	import {
		nextTick
	} from 'vue';
	import $http from '@/api/http.js';
	import {
		initWebSocket,
		listenWebSocketEvents
	} from '@/utils/socket.js';
	import {
		setGlobalData,
		setStorageSync
	} from '@/utils/tool';
	export default {
		data() {
			return {};
		},
		globalData: {
			code: null, // 设备的code  后期根据真实设备获取
			socketUrl: null,
			baseUrl: 'http://192.168.90.14:9101',
			// baseUrl: 'http://192.168.0.192:9101',
			// baseUrl: 'http://qyrn.hivacdisplay.cn:9101',
			wsUrl: 'ws://192.168.90.14:9105',
			// wsUrl: 'ws://192.168.0.192:9105',
			// wsUrl: 'ws://qyrn.hivacdisplay.cn:9105',
			nowTime: null,
			programContent: {},
			runtimeLook: false,
		},
		onLaunch: function(options) {
			nextTick(() => {
				initWebSocket();
			});
		},
		onShow: function() {
			this.getDeviceInfo();
			this.hideTabBar();
			  let mac2 = 'F0-20-FF-B1-A0-5C';
			  setGlobalData('socketUrl', getApp().globalData.wsUrl + '/play/' + mac2);
			  setGlobalData('code', mac2);
			this.initData();
			// #ifdef APP || APP-PLUS
			// this.getNewVersion();
			// #endif
		},
		onHide: function() {
			this.hideTabBar();
		},
		methods: {
			getDeviceInfo() {
				const {
					devicePixelRatio
				} = uni.getDeviceInfo();
				setStorageSync('dpr', devicePixelRatio || 1);
				setGlobalData('dpr', devicePixelRatio || 1);
			},
			compareVersions(version1, version2) {
				// 将版本号字符串按点号分割成数组
				const v1Parts = version1.split('.');
				const v2Parts = version2.split('.');

				// 取两个版本号数组长度的最大值，确保后续循环能完整比较
				const maxLength = Math.max(v1Parts.length, v2Parts.length);

				for (let i = 0; i < maxLength; i++) {
					// 获取当前位置的版本号数字部分，如果超出原版本号长度则默认为0
					const v1Num = parseInt(v1Parts[i] || 0, 10);
					const v2Num = parseInt(v2Parts[i] || 0, 10);

					if (v1Num < v2Num) {
						return -1;
					} else if (v1Num > v2Num) {
						return 1;
					}
				}
				// 如果所有位置的数字都相等，说明两个版本号相等
				return 0;
			},

			getNewVersion() {
				// #ifdef APP ||APP-PLUS
				if (this.runtimeLook) {
					return;
				}
				this.runtimeLook = true;
				$http
					.fetch('commonApi.getNewVersion', {}, {})
					.then((res) => {
						let versionCode = res?.data?.versionCode || null;
						let versionUrl = res?.data?.versionUrl || null;
						uni.getSystemInfo({
							success: (res) => {
								if (
									res.appVersion != versionCode &&
									res.appWgtVersion != versionCode &&
									versionUrl
								) {
									if (
										this.compareVersions(res.appVersion, versionCode) === -1
									) {
										uni.downloadFile({
											url: versionUrl,
											success: (res) => {
												if (res.statusCode == 200) {
													// 下载好直接安装，下次启动生效
													plus.runtime.install(
														res.tempFilePath, {},
														function() {
															plus.runtime.restart();
														},
														function(e) {}
													);
													this.runtimeLook = false;
												}
											},
											fail: () => {
												this.runtimeLook = false;
											},
										});
									}
								} else {
									this.runtimeLook = false;
								}
							},
						});
					})
					.catch(() => {
						this.runtimeLook = false;
					});
				// #endif
			},
			initData() {
				// #ifdef APP || APP-PLUS
				// 导入Java类。Networklnterface类表示一个由名称和分配给此接口的IP地址列表组成的网络接口
				const net = plus.android.importClass('java.net.NetworkInterface');
				// 搜索具有指定名称的网络接口
				const wlan0 = net.getByName('eth0');
				// 获得网卡的硬件地址
				try {
					const macByte = wlan0.getHardwareAddress();
					let mac = '';
					//转换MAC地址的思路来自网上(https://blog.csdn.net/zhangzhen53377562/article/details/109183891)
					macByte.forEach((item) => {
						// .toString(16)数字以十六进制值显示
						let temp = '';
						if (item < 0) temp = (256 + item).toString(16);
						else temp = item.toString(16);
						if (temp.length == 1) temp = `0${temp}`;
						mac += temp;
					});
					let mac2 = mac;
					for (let i = 2; i < mac2.length; i += 3)
						mac2 = mac2.slice(0, i) + ':' + mac2.slice(i);
					setGlobalData(
						'socketUrl',
						getApp().globalData.wsUrl + '/play/' + mac2
					);
					setGlobalData('code', mac2);
				} catch (error) {}
				// #endif
			},
			hideTabBar() {
				// #ifdef APP-PLUS
				uni.hideTabBar({
					success: (res) => {},
					fail: (err) => {},
				});
				plus.navigator.setFullscreen(true);
				plus.navigator.hideSystemNavigation();
				// #endif
			},
		},
	};
</script>

<style>
	/*每个页面公共css */
	page {
		/* 		display: flex;
        flex-direction: column; */
		height: 100%;
	}
</style>