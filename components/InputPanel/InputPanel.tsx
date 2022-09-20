import { Badge, Tag } from 'antd';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import { Dispatch, ForwardedRef, SetStateAction, useState } from 'react';
import { IoAttach, IoSend } from 'react-icons/io5';
import { useLongPress } from 'react-use';
import { useUserStore } from 'utils/store';
import s from '../../styles/Home.module.scss';
import x from './inputPanel.module.scss';
import {
  getTaskGroups,
  isValidText,
  notif,
  refreshTaskData,
} from '../../utils/apputils';
import { addTask, newTaskGroup } from '../../utils/fire';
import { fastTransition } from '../anims';
import { UrgencyPopover } from '../taskActions/UrgencyPopover';
import { AiOutlineCamera } from 'react-icons/ai';
import { Images } from 'components/InputPanel/components/Images';
import { UploadFile } from 'antd/lib/upload/interface';
import { stripImagesData } from '@/utils/cloudflare';


export const areAllFilesUploaded = (fileList:UploadFile[]) => {
  if(fileList.length === 0) return false;
  return fileList.every(file => {
    return file.status === 'done';
  });
};


const { CheckableTag } = Tag;

const cn = classNames.bind(s);
type Props = {
  props: {
    // taskGroups: { id: string; data: any }[]
    // setTasks: Dispatch<
    //     SetStateAction<
    //         {
    //             id: string
    //             data: any
    //         }[]
    //     >
    // >
    // setTaskGroups: Dispatch<SetStateAction<{
    //     id: string;
    //     data: any;
    // }[]>>
    setNewTaskGroupTitle: Dispatch<SetStateAction<string>>;
  };
  ref: ForwardedRef<any>;
};

export const InputPanel = (props: Props['props']) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { setNewTaskGroupTitle } = props;

  const onLongPress = () => {

  };

  const longPressOptions = {
    isPreventDefault: false,
    delay: 200,
  };
  const longPressEvent = useLongPress(onLongPress, longPressOptions);

  const {
    setTaskGroupIndex,
    taskGroupIndex,
    setUser,
    user,
    taskGroups,
    setTaskGroups,
    setTasks,
    groupsLoading,
    setGroupsLoading,
  } = useUserStore(state => state);

  const urgencies = ['normal', 'urgent', 'warning'];
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [urgency, setUrgency] = useState(0);
  const [photosShow, setPhotosShow] = useState(false);
  const togglePhotos = () => setPhotosShow(!photosShow);

  const { t } = useTranslation('common');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const performAddTask = async () => {
    if (isValidText(newTaskTitle)) {
      if (taskGroups.length === 0) {
        await newTaskGroup(user.id, t('messages.my_first_group'));
        await setTaskGroupIndex(0);
        await getTaskGroups(user.id).then(res => {
          setTaskGroups(res);

          setNewTaskGroupTitle(`Task group ${res.length + 1}`);
          addTask(user.id, res[0].id, {
            text: newTaskTitle,
            images: stripImagesData(fileList),
            checkable: true,
            urgency: urgencies[urgency],
          }).then(() => {
            refreshTaskData({
              userid: user.id,
              taskGroupIndex,
              setTaskGroups,
              setTasks,
              setGroupsLoading,
            });
            setNewTaskTitle('');
            setFileList([]);
          });
        });
      } else {
        addTask(user.id, taskGroups[taskGroupIndex].id, {
          text: newTaskTitle,
          images:stripImagesData(fileList),
          checkable: true,
          urgency: urgencies[urgency],
        }).then(() => {
          refreshTaskData({
            userid: user.id,
            taskGroupIndex,
            setTaskGroups,
            setTasks,
            setGroupsLoading,
          });
          setNewTaskTitle('');
          setFileList([]);
          // getTasks(
          //     user.id,
          //     taskGroups[taskGroupIndex].id
          // ).then(res => {
          //     setTasks(res)
          //     setNewTaskTitle('')
          // })
        });
      }
    }
  };



  return (
    <>
      <Images
        visible={photosShow}
        fileList={fileList}
        setFileList={setFileList}
      />
      <div className={s.inputWrapper}>
        <motion.input
          {...fastTransition}
          // autoFocus
          layout
          type='text'
          placeholder={t('buttons.new_task')}
          value={newTaskTitle}
          onChange={e => {
            setNewTaskTitle(e.target.value);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              performAddTask();
            }
          }}
        />
        <UrgencyPopover urgency={urgency} setUrgency={setUrgency} />

        {/* {newTaskTitle === '' && (
        <button
          onClick={() =>
            notif({
              type: 'warning',
              message: t('messages.not_implemented_yet'),
            })
          }
        >
          <IoAttach />{' '}
        </button>
      )} */}
        <Badge

          size='small'
          count={fileList.length}>

          <button className={x.addPhoto} onClick={togglePhotos}>
            <AiOutlineCamera />
          </button>
        </Badge>

        {(newTaskTitle !== '' || areAllFilesUploaded(fileList)) && (
          <button onClick={() => performAddTask()}>
            <IoSend />
          </button>
        )}
      </div>
    </>
  );
};
