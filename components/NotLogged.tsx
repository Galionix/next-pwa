
import useTranslation from 'next-translate/useTranslation'
import { AuthButton } from './AuthButton';
import s from '../styles/Home.module.scss'

export const NotLogged = () => {
    const { t } = useTranslation('common');
    return (
        <main
            className={` ${s.notLogged} `}

        >
            <h1>

                {t("messages.not_logged")}
            </h1>
            <AuthButton />
        </main>
    )
}
