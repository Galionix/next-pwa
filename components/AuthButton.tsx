import { signIn, signOut } from 'next-auth/client'

export const AuthButton = () => {
    return (
        <button
            onClick={e => {

                e.preventDefault()
                signIn('google').then(msg => {
                    console.log(
                        'signed'
                    )
                })
            }}
        >
            {`Auth `}
        </button>
    )
}
