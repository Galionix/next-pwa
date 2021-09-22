import { AuthButton } from './AuthButton';
import Image from 'next/image';
import { useUserStore } from './../utils/store';
import s from '../styles/Home.module.scss'



export const UserPanel = () => {
    const { user } =
        useUserStore(state => state)
    return (
        <div
            className={` ${s.userPanel} `}

        >
            {/* <pre>{JSON.stringify(user.picture, null, 2)}</pre> */}

            <Image
                width={50}
                height={50}
                src={user?.picture || '/image/user.png'} />
            {
                user.name &&
                <AuthButton />
            }
        </div>
    )
}
