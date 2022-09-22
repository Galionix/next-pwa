import { notif } from '@/utils/apputils';
import { addPendingShareInvite } from '@/utils/fire';
import { useUserStore } from '@/utils/store';
import { Modal } from 'antd';
import { Button } from 'components/Button/Button';
import { IUserData, UserPicker } from 'components/GroupBar/UserPicker';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { ITaskGroup } from 'types/fireTypes';
import s from './groupBar.module.scss';

interface IGroupBarProps {
  taskgroup: ITaskGroup;
  folded: boolean;
  menuChildren: JSX.Element;
  tabIndex: number;
}

const UserPickerModal = ({
  taskGroup,
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  taskGroup: ITaskGroup;
}) => {
  const { t } = useTranslation('common');
  const { user: localUser } = useUserStore();

  const [selectedUsers, setSelectedUsers] = useState<IUserData[]>([]);

  const handleOk = async () => {
    setVisible(false);

    selectedUsers.forEach(async user => {

      const res = await addPendingShareInvite(user.id, localUser.id, {
        fromUser: localUser.id,
        taskGroup: taskGroup.id,
      });
      notif({
        type: 'info',
        message: `${t('invites.sent')} ${user.name}`,
      })

    });
  };

  return (
    <Modal
      wrapClassName={s.shareModal}
      title={`${t("invites.share")} "${taskGroup ? taskGroup.data.title : ''}"`}
      visible={visible}
      okText='Share'
      closable={false}
      onOk={handleOk}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <UserPicker
        onUserSelect={setSelectedUsers}
        selectedUsers={selectedUsers}
      />

      {selectedUsers.length === 0 && <p>{ t("invites.noUserSelected")}</p>}
      {selectedUsers.length > 0 && (
        <>
          <span>
            <h2>{taskGroup.data.title}</h2> {t('invites.willBeSharedWith')}:
          </span>
          <ul>
            {selectedUsers.map(user => (
              <li key={user.id}>
                <span key={user.id}>{user.name}</span>
              </li>
            ))}
          </ul>
          <span>{t('invites.inviteTerms')}</span>
        </>
      )}
    </Modal>
  );
};

export const GroupBar = ({
  taskgroup,
  folded,
  menuChildren,
  tabIndex,
}: IGroupBarProps) => {
  const [shareModalVisible, setShareModalVisible] = useState(false);

  return (
    <section className={s.groupBar}>
      {taskgroup && <h1>{taskgroup.data.title}</h1>}
      <div className={s.groupBar__actions}>
        <Button
          icon={<AiOutlineShareAlt size={25} />}
          hint='Share'
          onClick={() => {
            setShareModalVisible(true);
          }}
        />

        {menuChildren}
      </div>
      <UserPickerModal
        taskGroup={taskgroup}
        visible={shareModalVisible}
        setVisible={setShareModalVisible}
      />
    </section>
  );
};
