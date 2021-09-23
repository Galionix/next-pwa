/** @type {import('next').NextConfig} */
// module.exports = {
// 	reactStrictMode: true,
// }
const withPlugins = require('next-compose-plugins')

const pwa = require('next-pwa')
const nextTranslate = require('next-translate')

// module.exports = withPWA({
// 	reactStrictMode: true,
// 	// other next config
// 	i18n: {
// 		locales: ['en', 'ru'],
// 		defaultLocale: 'ru',
// 	},
// 	pwa: {
// 		dest: 'public',
// 		// disable: process.env.NODE_ENV === 'development',
// 		register: true,
// 		// scope: '/app',
// 		// sw: 'service-worker.js',
// 	},
// })

module.exports = withPlugins([
	// add a plugin with specific configuration
	// [
	// 	i18n,
	// 	{
	// 		locales: ['en', 'ru'],
	// 		defaultLocale: 'ru',
	// 	},
	// ],
	// another plugin with a configuration
	[
		pwa,
		{
			dest: 'public',
			// disable: process.env.NODE_ENV === 'development',
			register: true,
		},
	],
	[nextTranslate],
	{
		images: {
			domains: [
				'thecatapi.com',
				'placekitten.com',
				'cdn2.thecatapi.com',
				'lh3.googleusercontent.com',
				'googleusercontent.com',
			],
		},
		i18n: {
			locales: ['en', 'ru'],
			defaultLocale: 'ru',
		},
	},
])