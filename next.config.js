/** @type {import('next').NextConfig} */
// module.exports = {
// 	reactStrictMode: true,
// }
const withPWA = require('next-pwa')

module.exports = withPWA({
	reactStrictMode: true,
	// other next config
	pwa: {
		dest: 'public',
		// disable: process.env.NODE_ENV === 'development',
		register: true,
		// scope: '/app',
		// sw: 'service-worker.js',
	},
})
