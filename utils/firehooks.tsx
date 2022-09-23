import { getUserData } from '@/utils/fire';
import { IUserData } from 'components/GroupBar/UserPicker';
import { useState, useEffect } from 'react';
import { IUser } from 'types/fireTypes';

// hook that fetches user data with getUserData function
export const useUser = (userId: string | undefined) => {
    const [user, setUser] = useState<IUser | null>(null);


    useEffect(() => {
        if (userId) {
            getUserData(userId).then(setUser);
        }
    }, [userId]);

    if (!userId) {
        return { user:null };
    }

    return {user};
    }
