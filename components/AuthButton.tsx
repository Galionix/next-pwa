import { signIn, signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation'
import { useUserStore } from 'utils/store';

export const AuthButton = () => {
    const session = useSession()
    const { reset } =
        useUserStore(state => state)
    const { t } = useTranslation('common');
    return (<>{
        session.status !== 'authenticated' ?
            <button
                onClick={e => {
                    e.preventDefault()

                    signIn('google').then(msg => {
                        // console.log("%c 🔛: AuthButton -> msg ", "font-size:16px;background-color:#84693e;color:white;", msg)

                    })
                }}
            >
                {t('buttons.auth')}
            </button> :
            <button
                onClick={e => {
                    e.preventDefault()
                    signOut()
                    reset()
                }}
            >
                {t('buttons.sign_out')}
            </button>}
    </>
    )
}
