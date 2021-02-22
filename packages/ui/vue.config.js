/* eslint-env node */
module.exports = {
	assetsDir: 'static',
	transpileDependencies: ['vuetify'],
	devServer: {
		proxy: {
			'^/static/uploads': {
				target: 'http://localhost:5000',
				changeOrigin: true,
				pathRewrite: {
					'^/static/uploads': ''
				}
			}
		}
	}
};
