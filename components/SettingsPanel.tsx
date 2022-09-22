import { Badge, Button, Checkbox, Divider, Modal, Select } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import {
  AiOutlineArrowRight,
  AiOutlineUserAdd,
  AiOutlineUserSwitch,
} from 'react-icons/ai';
import { IoSettings } from 'react-icons/io5';
import { IPendingShareInvite, Itask, IUser } from 'types/fireTypes';
import { useUserStore } from 'utils/store';
import { Button as EButton } from '../components/Button/Button';
import s from '../styles/Home.module.scss';
import { getTasks, setTheme } from './../utils/apputils';
import {
  acceptShareInvite,
  deleteUser,
  getSentShareInvites,
  getTaskGroup,
  getUsersListWithIds,
  updateUser,
} from './../utils/fire';
import { fastTransition } from './anims';

import { BiUserCheck } from 'react-icons/bi';

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
  const toUser = usersList?.find(user => user.id === invite.toUserId);

  const [taskGroup, setTaskGroup] = useState<{ title: string } | undefined>(
    undefined,
  );

  const [tasks, setTasks] = useState<Itask[] | undefined>(undefined);

  const sentDate = new Date(invite.sendAt ? invite.sendAt.seconds * 1000 : 0);
  const acceptedDate = new Date(
    invite.acceptedAt ? invite.acceptedAt.seconds * 1000 : 0,
  );

  const acceptedDateString = `${acceptedDate.toLocaleDateString()} ${acceptedDate.toLocaleTimeString()}`;

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
        <div className={s.pendingInvite__info__date}>
          <span>{`${t('settings.actions.sentAt')}: ${dateString}`}</span>
          <span>{`${t(
            'settings.actions.acceptedAt',
          )}: ${acceptedDateString}`}</span>
        </div>

        <div className={s.pendingInvite__fromUser}>
          <span>{t('invites.fromUser')}</span>
          <span>{fromUser?.name}</span>
          <img
            src={fromUser?.imageUrl}
            alt='user'
            referrerPolicy='no-referrer'
          />
        </div>
        <AiOutlineArrowRight size={25} />
        <div className={s.pendingInvite__toUser}>
          <span>{t('invites.toUser')}</span>
          <span>{toUser?.name}</span>
          <img src={toUser?.imageUrl} alt='user' referrerPolicy='no-referrer' />
        </div>
      </div>
      <div className={s.pendingInvite__actions}>
        <Button
          loading={acceptLoading}
          type='primary'
          onClick={async () => {
            setAcceptLoading(true);
            await acceptShareInvite({
              toUserId: localUser.id,
              invite,
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
      wrapClassName={`${s.invites_modal}`}
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
        <div className={s.pendingInvites__list}>
          {pendingShareInvites?.map((invite, index) => {
            return (
              <InviteRenderer
                invite={invite}
                usersList={usersList}
                key={invite.id}
              />
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

interface IAcceptedProps {
  visible: boolean;
  acceptedShareInvites: IPendingShareInvite[] | undefined;
  setVisible: (visible: boolean) => void;
}

const AcceptedInvites = ({
  acceptedShareInvites,
  visible,
  setVisible,
}: IAcceptedProps) => {
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
      wrapClassName={`${s.invites_modal}`}
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
    >
      <div className={s.pendingInvites}>
        <h3>{t('settings.actions.AcceptedInvites')}</h3>
        <Divider />
        {!acceptedShareInvites?.length && (
          <p>{t('settings.actions.NoAcceptedInvites')}</p>
        )}
        <div className={s.pendingInvites__list}>
          {acceptedShareInvites?.map((invite, index) => {
            return (
              <InviteRenderer
                invite={invite}
                usersList={usersList}
                key={invite.id}
              />
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

interface ISentShareInvitesProps {
  visible: boolean;
  sentShareInvites: IPendingShareInvite[] | undefined;
  setVisible: (visible: boolean) => void;
}

const SentInvites = ({
  sentShareInvites,
  visible,
  setVisible,
}: ISentShareInvitesProps) => {
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
      wrapClassName={`${s.invites_modal}`}
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
    >
      <div className={s.pendingInvites}>
        <h3>{t('settings.actions.SentInvites')}</h3>
        <Divider />
        {!sentShareInvites?.length && (
          <p>{t('settings.actions.NoAcceptedInvites')}</p>
        )}
        <div className={s.pendingInvites__list}>
          {sentShareInvites?.map((invite, index) => {
            return (
              <InviteRenderer
                invite={invite}
                usersList={usersList}
                key={invite.id}
              />
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export const SettingsPanel = ({
  pendingShareInvites,
  folded,
}: ISettingsPanelProps) => {
  const { reset, setUser, user } = useUserStore(state => state);

  const [sentShareInvites, setSentShareInvites] = useState<
    IPendingShareInvite[]
  >([]);
  useEffect(() => {
    if (user && user.id) {
      getSentShareInvites(user.id).then(data => {
        setSentShareInvites(data);
      });
    }
  }, [user]);

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
  const [showAcceptedInvitesModal, setShowAcceptedInvitesModal] =
    useState(false);
  const [sentInvitesOpen, setSentInvitesOpen] = useState(false);

  const pendingExist = pendingShareInvites
    ? pendingShareInvites.filter(invite => !invite.acceptedAt)
    : [];

  const acceptedExist = pendingShareInvites
    ? pendingShareInvites.filter(invite => invite.acceptedAt)
    : [];

  return (
    <motion.div layout {...fastTransition} className={` ${s.settings} `}>
      <button onClick={() => setModalOpen(true)} className={s.settingsGear}>
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
      <AcceptedInvites
        visible={showAcceptedInvitesModal}
        acceptedShareInvites={acceptedExist}
        setVisible={setShowAcceptedInvitesModal}
      />
      <SentInvites
        visible={sentInvitesOpen}
        sentShareInvites={sentShareInvites}
        setVisible={setSentInvitesOpen}
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
          <section className={s.settings_modal__invites}>
            <h3>{t('settings.actions.Invites')}</h3>

            {pendingExist?.length > 0 && (
              <div className={s.pendingInvites}>
                <EButton
                  type='warning'
                  title={`${t('settings.actions.PendingInvites')} + ${
                    pendingExist?.length
                  }`}
                  icon={<AiOutlineUserAdd size={25} />}
                  onClick={() => setShowInvitesModal(true)}
                />
              </div>
            )}

            {acceptedExist?.length > 0 && (
              <div className={s.pendingInvites}>
                <EButton
                  type='success'
                  title={`${t('settings.actions.AcceptedInvites')} : ${
                    acceptedExist?.length
                  }`}
                  icon={<BiUserCheck size={25} />}
                  onClick={() => setShowAcceptedInvitesModal(true)}
                />
              </div>
            )}
            {sentShareInvites?.length > 0 && (
              <div className={s.pendingInvites}>
                <EButton
                  type='info'
                  title={`${t('settings.actions.SentInvites')} : ${
                    sentShareInvites?.length
                  }`}
                  icon={<AiOutlineUserSwitch size={25} />}
                  onClick={() => setSentInvitesOpen(true)}
                />
              </div>
            )}
          </section>
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
