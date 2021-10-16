import s from '../styles/Home.module.scss'
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fastTransition } from './anims';
import { IoSettings } from 'react-icons/io5';
import { setTheme, notif } from './../utils/apputils';
import { Modal } from 'antd';
import { useUserStore } from 'utils/store';
import { deleteUser, updateUser } from './../utils/fire';
import { Checkbox } from 'antd';
import { Cascader } from 'antd';
import { Select } from 'antd';
import { Button } from 'antd';
import { signOut } from 'next-auth/react';

const { Option } = Select;
export const SettingsPanel = () => {

    const {
        reset,
        setUser,
        user,
    } = useUserStore(state => state)
    // updateUser
    const do_user = async (data: any) => {
        setUser({ ...data })
        updateUser(user.id, data)
    }

    const { t } = useTranslation('common')
    const [modalOpen, setModalOpen] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    return (
        <motion.div
            layout
            {...fastTransition}
            className={` ${s.settings} `}

        >

            <button
                onClick={() => setModalOpen(true)}
            >            <IoSettings size={30} />
                <p>{t('settings.title')}</p>
            </button>

            <Modal
                wrapClassName={` ${s.settings_modal} `}
                okText={t('messages.ok')}
                cancelText={t('messages.cancel')}
                title={t('settings.title')}
                centered
                visible={modalOpen}
                onOk={() => { setModalOpen(false) }}
                onCancel={() => setModalOpen(false)}

            >
                <section>
                    <p>{t('settings.theme')}</p>
                    <Select
                        defaultValue={user?.data?.theme || 'light'}
                        placeholder={t('settings.theme')}
                        onChange={(e) => {
                            do_user({ ...user, data: { theme: e } })
                            setTheme(e)
                        }}
                    >
                        <Option value="black">{t('settings.color.black')}</Option>
                        <Option value="light">{t('settings.color.light')}</Option>
                    </Select>
                    <Button danger
                        onClick={() => setDeleteModal(true)}
                    >{t('settings.delete_modal.button')}

                    </Button>

                </section>


            </Modal>
            <Modal
                closable={false}
                okText={t('settings.delete_modal.ok')}
                cancelText={t('settings.delete_modal.cancel')}
                title={t('settings.delete_modal.title')}
                centered
                visible={deleteModal}
                onOk={() => {
                    deleteUser(user.id).then(res => {
                        reset()
                        signOut()
                    })
                }}
                onCancel={() => setDeleteModal(false)}
                okButtonProps={{ danger: true }}

            >
                <p>{t('settings.delete_modal.message')}</p>
            </Modal>

        </motion.div>
    )
}
