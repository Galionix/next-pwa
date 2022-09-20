import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import '../styles/ant_replacements.css';
import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
// import { getSession } from 'next-auth/client'
import { useUserStore } from 'utils/store'
// import { SessionProvider } from "next-auth/react"
// import {
//   Provider,
//   getSession,
// } from 'next-auth/client'

import { useSession, signIn, signOut, SessionProvider }
  from "next-auth/react"
// import { appWithTranslation } from 'next-i18next'



function MyApp({ Component,
  pageProps: { session, ...pageProps }, }: AppProps) {

  return <SessionProvider

    session={session}>
    <Component {...pageProps} />
  </SessionProvider>
}
export default MyApp
