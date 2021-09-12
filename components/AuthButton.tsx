import { signIn, signOut } from 'next-auth/react'

export const AuthButton = () => {
    return (<>

        <button
            onClick={e => {
                e.preventDefault()

                signIn('google').then(msg => {
                    console.log("%c 🔛: AuthButton -> msg ", "font-size:16px;background-color:#84693e;color:white;", msg)

                })
            }}
        >
            {`Auth `}
        </button>
        <button
            onClick={e => {
                e.preventDefault()
                signOut()
            }}
        >
            {`Sign out `}
        </button>
    </>
    )
}
