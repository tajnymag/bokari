/* eslint-env node */
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
	}
};
