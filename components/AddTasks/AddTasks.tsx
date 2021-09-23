import s from '../../styles/Home.module.scss'
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fastTransition } from './../anims';




export const AddTasks = () => {
    const { t } = useTranslation('common')
    // const width = window.innerWidth;
    // const [kitty, setKitty] = useState({
    //     id: '',
    //     height: 0, width: 0, url: ''

    // })
    // useEffect(() => {
    //     fetch('https://api.thecatapi.com/v1/images/search')
    //         .then(res => res.json())
    //         .then(
    //             res2 => {
    //                 console.log("%c 😼: AddTasks -> res2 ", "font-size:16px;background-color:#2cb79f;color:white;", res2)

    //                 setKitty(res2[0])
    //             }
    //         )
    // }, [])
    return (
        <div
            className={` ${s.notasks} `}

        >{<motion.div layout {...fastTransition}>
            <Image
                draggable="false"
                // "fill", "fixed", "intrinsic", "responsive"
                    // layout="intrinsic"
                    // objectFit="fill"
                    // height={kitty.height}
                    // width={kitty.width}
                    // src={kitty.url}
                    height={300}
                    width={300}
                    src={`http://placekitten.com/300/300`}
            />
            </motion.div>}
            <motion.p layout {...fastTransition}>

            {t('messages.add_tasks')}
            </motion.p>
        </div>
    )
}
