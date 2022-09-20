import { Button, Checkbox, Divider, Modal, Select } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import React, { useState } from 'react';
import { IoSettings } from 'react-icons/io5';
import { useUserStore } from 'utils/store';
import s from '../styles/Home.module.scss';
import { setTheme } from './../utils/apputils';
import { deleteUser, updateUser } from './../utils/fire';
import { fastTransition } from './anims';

const { Option } = Select;



function onChange(checkedValue: CheckboxValueType[]) {
}

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

    const options = [
        { label: t('settings.actions.Urgency'), value: 'Urgency' },
        { label: t('settings.actions.Delete'), value: 'Delete' },
        { label: t('settings.actions.Archive'), value: 'Archive' },
        { label: t('settings.actions.Notification'), value: 'Notification' },
        { label: t('settings.actions.Description'), value: 'Description' },
    ];

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
            ><IoSettings size={30} />
                <p>{t('settings.title')}</p>
            </button>
            <Modal
                wrapClassName={`${s.settings_modal}`}
                okText={t('messages.ok')}
                cancelText={t('messages.cancel')}
                title={t('settings.title')}
                centered
                visible={modalOpen}
                onOk={() => setModalOpen(false)}
                onCancel={() => setModalOpen(false)}
            ><>
                <section>
                        <div>
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
                        </div>

                        <Divider plain orientation="left">{t('settings.task_actions_section')}</Divider>
                        <div>
                            <Checkbox.Group
                                options={options}
                                defaultValue={['Apple']}
                                onChange={onChange}
                            />
                        </div>
                        <Divider plain orientation="left">{t('settings.danger_section')}</Divider>
                        <div>

                            <Button danger className={` ${s.control} `}

                                onClick={() => setDeleteModal(true)}
                            >{t('settings.delete_modal.button')}

                            </Button>
                        </div>
                </section>
                </>
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
