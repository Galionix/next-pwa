import { AuthButton } from './AuthButton';
import Image from 'next/image';
import { useUserStore } from './../utils/store';
import s from '../styles/Home.module.scss'
import { motion } from 'framer-motion';



export const UserPanel = () => {
    const { user } =
        useUserStore(state => state)
    return (
        <div
            className={` ${s.userPanel} `}

        >
            {/* <pre>{JSON.stringify(user.picture, null, 2)}</pre> */}
            <motion.div
                layout
            >

                <Image

                width={50}
                height={50}
                src={user?.picture || '/image/user.png'} />
            </motion.div>
            {
                user.name &&
                <AuthButton />
            }
        </div>
    )
}
