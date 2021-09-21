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

                    signIn('google')
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
