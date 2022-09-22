import { Badge, Button, Checkbox, Divider, Modal, Select } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import React, { useEffect, useState } from 'react';
import { AiOutlineUserSwitch } from 'react-icons/ai';
import { IoSettings } from 'react-icons/io5';
import { IPendingShareInvite, Itask, ITaskGroup, IUser } from 'types/fireTypes';
import { useUserStore } from 'utils/store';
import s from '../styles/Home.module.scss';
import { getTasks, setTheme } from './../utils/apputils';
import {
  acceptShareInvite,
  deleteUser,
  getTaskGroup,
  getUsersListWithIds,
  updateUser,
} from './../utils/fire';
import { fastTransition } from './anims';
import { Button as EButton } from '../components/Button/Button';
import { useRouter } from 'next/dist/client/router';

const { Option } = Select;

function onChange(checkedValue: CheckboxValueType[]) {}

interface ISettingsPanelProps {
  pendingShareInvites: IPendingShareInvite[] | undefined;
  folded: boolean;
}
interface IPendingProps {
  visible: boolean;
  pendingShareInvites: IPendingShareInvite[] | undefined;
  setVisible: (visible: boolean) => void;
}

const renderDate = (date: Date) => {
  const dateString = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  return <span className={s.date}>{dateString}</span>;
};

const InviteRenderer = ({
  usersList,
  invite,
}: {
  usersList: IUser[];
  invite: IPendingShareInvite;
}) => {
  const { user: localUser } = useUserStore();
  const { t } = useTranslation('common');

  const fromUser = usersList?.find(user => user.id === invite.fromUser);

  const [taskGroup, setTaskGroup] = useState<{ title: string } | undefined>(
    undefined,
  );

  const [tasks, setTasks] = useState<Itask[] | undefined>(undefined);

  const sentDate = new Date(invite.sendAt ? invite.sendAt.seconds * 1000 : 0);

  const dateString = `${sentDate.toLocaleDateString()} ${sentDate.toLocaleTimeString()}`;

  const [acceptLoading, setAcceptLoading] = useState(false);
  useEffect(() => {
    if (fromUser) {
      getTaskGroup(fromUser.id, invite.taskGroup).then(taskGroup => {

        setTaskGroup(taskGroup as any);
      });

      getTasks(fromUser.id, invite.taskGroup).then(tasks => {

        setTasks(tasks);
      });
    }
  }, [fromUser, invite.taskGroup]);


  if (!fromUser || !taskGroup || !tasks) return null;

  return (
    <div className={s.pendingInvite} key={invite.id}>
      <div className={s.pendingInvite__info}>
        <h2>{taskGroup?.title}</h2>
        <span>{`${t('tasks')}: ${tasks.length}`}</span>
        <span>{`${t('settings.actions.sentAt')}: ${dateString}`}</span>
        <span>{fromUser?.name}</span>
        <img src={fromUser?.imageUrl} alt='user' />
      </div>
      <div className={s.pendingInvite__actions}>
        <Button
          loading={acceptLoading}
          type='primary'
          onClick={async () => {
            setAcceptLoading(true);
            await acceptShareInvite({
              toUserId: localUser.id,
              invite
            });
            setAcceptLoading(false);
          }}
        >
          {t('accept')}
        </Button>
        <Button type='primary' danger onClick={() => {}}>
          {t('decline')}
        </Button>
      </div>
    </div>
  );
};

export const PendingInvites = ({
  pendingShareInvites,
  visible,
  setVisible,
}: IPendingProps) => {

  const { t } = useTranslation('common');
  const [usersList, setUsersList] = useState<IUser[]>();

  const { user } = useUserStore();

  useEffect(() => {
    getUsersListWithIds().then(data => {
      setUsersList(data);
      // setOptions
    });
  }, []);

  if (!usersList) return <p>{t('loading')}</p>;

  return (
    <Modal
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
    >
      <div className={s.pendingInvites}>
        <h3>{t('settings.actions.PendingInvites')}</h3>
        <Divider />
        {!pendingShareInvites?.length && (
          <p>{t('settings.actions.NoPendingInvites')}</p>
        )}
        {pendingShareInvites?.map((invite, index) => {
          return (
            <InviteRenderer
              invite={invite}
              usersList={usersList}
              key={`${index} ${invite.fromUser} ${invite.taskGroup}`}
            />
          );
        })}
      </div>
    </Modal>
  );
};

export const SettingsPanel = ({
  pendingShareInvites,
  folded,
}: ISettingsPanelProps) => {
  const { reset, setUser, user } = useUserStore(state => state);

  const [showInvitesModal, setShowInvitesModal] = useState(false);
  const do_user = async (data: any) => {
    setUser({ ...data });
    updateUser(user.id, data);
  };

  const { t } = useTranslation('common');

  const options = [
    { label: t('settings.actions.Urgency'), value: 'Urgency' },
    { label: t('settings.actions.Delete'), value: 'Delete' },
    { label: t('settings.actions.Archive'), value: 'Archive' },
    { label: t('settings.actions.Notification'), value: 'Notification' },
    { label: t('settings.actions.Description'), value: 'Description' },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const pendingExist = pendingShareInvites ? pendingShareInvites.filter(
    invite => !invite.acceptedAt
    ) : []
    console.log('pendingShareInvites: ', pendingShareInvites);

  return (
    <motion.div layout {...fastTransition} className={` ${s.settings} `}>
      <button onClick={() => setModalOpen(true)}>
        <Badge count={pendingExist?.length} offset={[0, 0]}>
          <IoSettings size={30} />
        </Badge>

        <p>{t('settings.title')}</p>
      </button>
      <PendingInvites
        visible={showInvitesModal}
        pendingShareInvites={pendingExist}
        setVisible={setShowInvitesModal}
      />
      <Modal
        wrapClassName={`${s.settings_modal}`}
        okText={t('messages.ok')}
        cancelText={t('messages.cancel')}
        title={t('settings.title')}
        centered
        visible={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        <>
          {pendingExist?.length > 0 && (
            <div className={s.pendingInvites}>
              <EButton
                type='warning'
                title={`${t('settings.actions.PendingInvites')} + ${
                  pendingShareInvites?.length
                }`}
                icon={<AiOutlineUserSwitch size={25} />}
                onClick={() => setShowInvitesModal(true)}
              />
            </div>
          )}
          <section>
            <div>
              <p>{t('settings.theme')}</p>
              <Select
                defaultValue={user?.data?.theme || 'light'}
                placeholder={t('settings.theme')}
                onChange={e => {
                  do_user({ ...user, data: { theme: e } });
                  setTheme(e);
                }}
              >
                <Option value='black'>{t('settings.color.black')}</Option>
                <Option value='light'>{t('settings.color.light')}</Option>
              </Select>
            </div>

            <Divider plain orientation='left'>
              {t('settings.task_actions_section')}
            </Divider>
            <div>
              <Checkbox.Group
                options={options}
                defaultValue={['Apple']}
                onChange={onChange}
              />
            </div>
            <Divider plain orientation='left'>
              {t('settings.danger_section')}
            </Divider>
            <div>
              <Button
                danger
                className={` ${s.control} `}
                onClick={() => setDeleteModal(true)}
              >
                {t('settings.delete_modal.button')}
              </Button>
            </div>
          </section>
        </>
      </Modal>
      <Modal
        closable={false}
        okText={t('settings.delete_modal.ok')}
        cancelText={t('settings.delete_modal.cancel')}
        title={t('settings.delete_modal.title')}
        centered
        visible={deleteModal}
        onOk={() => {
          deleteUser(user.id).then(res => {
            reset();
            signOut();
          });
        }}
        onCancel={() => setDeleteModal(false)}
        okButtonProps={{ danger: true }}
      >
        <p>{t('settings.delete_modal.message')}</p>
      </Modal>
    </motion.div>
  );
};
