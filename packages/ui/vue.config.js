/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/order */
const path = require('path');
const webpack = require('webpack');

module.exports = {
	assetsDir: 'static',
	transpileDependencies: ['vuetify'],
	lintOnSave: process.env.CI !== 'true',
	pwa: {
		name: 'Bokari',
		themeColor: '#795548',
		msTileColor: '#795548',
		iconPaths: {
			faviconSVG: 'favicon.svg',
			favicon16: 'favicon.ico',
			favicon32: null,
			appleTouchIcon: null,
			maskIcon: null,
			msTileImage: null
		}
	},
	configureWebpack: {
		plugins: [
			new webpack.NormalModuleReplacementPlugin(
				/^typeorm/,
				path.join(__dirname, 'src/polyfills/typeorm.ts')
			)
		]
	}
};
