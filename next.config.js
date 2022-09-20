/** @type {import('next').NextConfig} */

const withPlugins = require('next-compose-plugins')

const pwa = require('next-pwa')
const nextTranslate = require('next-translate')



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
				'webstore.b-cdn.net',
				'imagedelivery.net'
			],
		},
		i18n: {
			locales: ['en', 'ru'],
			defaultLocale: 'ru',
		},
	},
])