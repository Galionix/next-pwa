import { useUser } from '@/utils/firehooks';
import { Spin } from 'antd';
import { IUserData } from 'components/GroupBar/UserPicker';
import s from './Avatar.module.scss';

export const Avatar = ({
  className = '',
  userId,
  type,
}: {
  className?: string;
  userId: string | undefined;
  type?: 'small' | 'large' | 'compact';
}) => {
  const { user } = useUser(userId);

  if (!user) {
    return null;
  }
  return (
    <Spin spinning={!!(userId && !user)} wrapperClassName={className}>
      <div className={`${s.avatar} ${type ? s[type] : s.compact}`}>
        <img src={user.imageUrl} alt={user.name} referrerPolicy='no-referrer' />
        <span>{user.name}</span>
      </div>
    </Spin>
  );
};
