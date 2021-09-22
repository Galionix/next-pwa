import s from '../../styles/Home.module.scss'
import useTranslation from 'next-translate/useTranslation';



export const AddTasks = () => {
    const { t } = useTranslation('common')

    return (
        <div
            className={` ${s.notasks} `}

        >
            {t('messages.add_tasks')}
        </div>
    )
}
