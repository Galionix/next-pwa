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
  // const session = useSession()
  // const userStore = useUserStore(
  //   state => state.user
  // )
  // const setUser = useUserStore(
  //   state => state.setUser
  // )


  // useEffect(() => {
  //   ; (async () => {
  //     const session: any = await getSession()
  //     setUser(session)
  //     console.log("%c 🏒: MyApp -> session ",
  //       "font-size:16px;background-color:#6372a3;color:white;",
  //       session)

  //     // setUser(session?.user)
  //   })()
  // }, [])
  return <SessionProvider
    // options={{
    //   // Client Max Age controls how often the useSession in the client should
    //   // contact the server to sync the session state. Value in seconds.
    //   // e.g.
    //   // * 0  - Disabled (always use cache value)
    //   // * 60 - Sync session state with server if it's older than 60 seconds
    //   clientMaxAge: 0,
    //   // Keep Alive tells windows / tabs that are signed in to keep sending
    //   // a keep alive request (which extends the current session expiry) to
    //   // prevent sessions in open windows from expiring. Value in seconds.
    //   //
    //   // Note: If a session has expired when keep alive is triggered, all open
    //   // windows / tabs will be updated to reflect the user is signed out.
    //   keepAlive: 0,
    // }}
    session={session}>
    <Component {...pageProps} />
  </SessionProvider>
}
export default MyApp
