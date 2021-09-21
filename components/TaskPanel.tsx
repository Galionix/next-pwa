import { AuthButton } from './AuthButton';
import Image from 'next/image';
import { useUserStore } from './../utils/store';
import s from '../styles/Home.module.scss'



export const TaskPanel = () => {
    // const { user } =
    //     useUserStore(state => state)
    return (
        <header
            className={` ${s.taskPanel} `}

        >
            {/* <pre>{JSON.stringify(user.picture, null, 2)}</pre> */}
            TaskPanel
            {/* <Image
                width={50}
                height={50}
                src={user.picture} />
            {
                user.name &&
                <AuthButton />
            } */}
        </header>
    )
}
