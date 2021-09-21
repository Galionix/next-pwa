import { AuthButton } from './AuthButton';
import Image from 'next/image';
import { useUserStore } from './../utils/store';



export const UserPanel = () => {
    const { user } =
        useUserStore(state => state)
    return (
        <div>
            {/* <pre>{JSON.stringify(user.picture, null, 2)}</pre> */}

            <Image
                width={50}
                height={50}
                src={user.picture} />
            {
                user.name &&
                <AuthButton />
            }
        </div>
    )
}
