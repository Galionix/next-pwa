import s from '../styles/Home.module.scss'
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fastTransition } from './anims';
import { IoSettings } from 'react-icons/io5';
import { warn } from './../utils/apputils';

export const SettingsPanel = () => {
    const { t } = useTranslation('common')

    return (
        <motion.div
            layout
            {...fastTransition}
            className={` ${s.settings} `}

        >

            <button
                onClick={() => warn(t('messages.not_implemented_yet'))}
            // onClick={() => ()}
            >            <IoSettings size={30} />
                <p>Настройки</p>
            </button>


            {/* SettingsPanel */}
        </motion.div>
    )
}
