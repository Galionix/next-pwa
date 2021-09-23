import s from '../../styles/Home.module.scss'
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useState } from 'react';



export const AddTasks = () => {
    const { t } = useTranslation('common')
    const width = window.innerWidth;
    const [kitty, setKitty] = useState({
        id: '',
        height: 0, width: 0, url: ''

    })
    useEffect(() => {
        fetch('https://api.thecatapi.com/v1/images/search')
            .then(res => res.json())
            .then(
                res2 => {
                    console.log("%c 😼: AddTasks -> res2 ", "font-size:16px;background-color:#2cb79f;color:white;", res2)

                    setKitty(res2[0])
                }
            )
    }, [])
    return (
        <div
            className={` ${s.notasks} `}

        >{kitty.url !== '' && <div>
            <Image
                draggable="false"
                // "fill", "fixed", "intrinsic", "responsive"
                // layout="fixed"
                objectFit="fill"
                height={kitty.height}
                width={kitty.width}
                src={kitty.url}
            />
        </div>}{/*  */}
            <p>

            {t('messages.add_tasks')}
            </p>
        </div>
    )
}
