import s from '../styles/Home.module.scss'
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fastTransition } from './anims';
import { IoSettings } from 'react-icons/io5';
import { setTheme, warn } from './../utils/apputils';
import { Modal } from 'antd';
import { useUserStore } from 'utils/store';
import { updateUser } from './../utils/fire';
import { Checkbox } from 'antd';
import { Cascader } from 'antd';
import { Select } from 'antd';
const { Option } = Select;
export const SettingsPanel = () => {

    const {
        // setTaskGroupIndex,
        // taskGroupIndex,
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
    return (
        <motion.div
            layout
            {...fastTransition}
            className={` ${s.settings} `}

        >

            <button
                // onClick={() => warn(t('messages.not_implemented_yet'))}
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
                onOk={() => {
                    // try {


                    //     await do_user({
                    //         ...user.data,
                    //         field: 'value2'
                    //     })


                    setModalOpen(false)
                    // } catch (error) {
                    //     warn(JSON.stringify(error))
                    // }

                }}
                onCancel={() => setModalOpen(false)}

            >
                {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
                <section>
                    <p>{t('settings.theme')}</p>
                    <Select
                        defaultValue={user?.data?.theme || 'light'}
                        // options={[{
                        //     value: 'light',
                        //     label: t('settings.color.light')
                        // },
                        // {
                        //     value: 'black',
                        //     label: t('settings.color.black')
                        // }
                        // ]
                        // }
                        placeholder={t('settings.theme')}
                        onChange={(e) => {
                            do_user({ ...user, data: { theme: e } })
                            setTheme(e)
                            // console.log("%c 🙎‍♂️: e ", "font-size:16px;background-color:#a726e5;color:white;", e)
                        }}
                    >
                        <Option value="black">{t('settings.color.black')}</Option>
                        <Option value="light">{t('settings.color.light')}</Option>

                    </Select>
                </section>

                {/* <p>Some settings</p>
                <p>Some settings</p>
                <p>Some settings</p>
                <p>Some settings</p> */}
            </Modal>
            {/* SettingsPanel */}
        </motion.div>
    )
}
