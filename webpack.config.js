const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins,
		new BrowserSyncPlugin(
			{
				proxy: "http://fictional-university.local/", // Replace with your local dev URL
				files: ["**/*.php"],
				notify: false,
				open: false,
			},
			{ reload: false }
		),
	],
};
