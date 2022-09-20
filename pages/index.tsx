// import { db, app } from '@/utils/fire';
import {
  extractCapitals,
  getTaskGroups,
  getTasks,
  refreshTaskData,
  requestNotificationPermission,
  setTheme,
} from '@/utils/apputils';
import { initUser } from '@/utils/fire';
import { Badge, Tabs } from 'antd';

import classNames from 'classnames/bind';
import { getDoc, serverTimestamp } from 'firebase/firestore';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { AnimatePresence, motion } from 'framer-motion';
import type { NextPage } from 'next';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
// import { useRouter } from 'next/dist/client/router'
import Head from 'next/head';
import { wrap } from 'popmotion';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { AiFillDelete } from 'react-icons/ai';
import {
  IoAddCircleOutline,
  IoArchiveOutline,
  IoArchiveSharp,
  IoDocumentTextSharp,
} from 'react-icons/io5';
import { RiInboxUnarchiveLine } from 'react-icons/ri';
import { useSwipeable } from 'react-swipeable';
import {
  useClickAway,
  useDebounce,
  useLongPress,
  useWindowSize,
} from 'react-use';
import s from '../styles/Home.module.scss';
import { AddTasks } from './../components/AddTasks/AddTasks';
import { fastTransition } from './../components/anims';
import {
  areAllFilesUploaded,
  InputPanel,
} from '../components/InputPanel/InputPanel';
import { Loader } from './../components/Loader/Loader';
import { NotLogged } from './../components/NotLogged';
import { SettingsPanel } from './../components/SettingsPanel';
import { UserPanel } from './../components/UserPanel';
import { isValidText } from './../utils/apputils';
import {
  deleteTaskGroup,
  f_updateTask,
  f_updateTaskGroupTitle,
  newTaskGroup,
} from './../utils/fire';
import { useUserStore } from './../utils/store';
import { Button } from './../components/Button/Button';
import { Tooltip } from 'antd';
import Image from 'next/image';
import { GoNote } from 'react-icons/go';
import {
  urgencies,
  UrgencyPopover,
} from 'components/taskActions/UrgencyPopover';
import { TaskDetails } from 'components/TaskStats';
import { ArchivedTab } from 'components/tabPanes/Archived';
import { ActiveTab } from 'components/tabPanes/ActiveTab';
import { Itask } from 'types/fireTypes';
import { UploadFile } from 'antd/lib/upload/interface';
import { stripImagesData } from '@/utils/cloudflare';
// import { Itask } from 'types/fireTypes'

const cn = classNames.bind(s);
// const db = getFirestore(app)

const { TabPane } = Tabs;

const getUrgencyForUnarchivedTasks = (task: Itask[]) => {
  const unarchivedTasks = task.filter(t => !t.data.archived);
  const urgentTasks = unarchivedTasks.filter(t => t.data.urgency === 'urgent');
  const normalTasks = unarchivedTasks.filter(t => t.data.urgency === 'normal');
  const warningTasks = unarchivedTasks.filter(
    t => t.data.urgency === 'warning',
  );
  return {
    urgent: urgentTasks.length > 0,
    placehold: normalTasks.length > 0,
    warning: warningTasks.length > 0,
  };
};

const Home: NextPage = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { t } = useTranslation('common');
  const [folded, setFolded] = useState(false);
  const [paneIndex, setPaneIndex] = useState(0);
  const [editingTaskTitle, setEditingTaskTitle] = useState(false);

  const [currentDaySelected, setCurrentDaySelected] = useState(false);

  const getUrgencyIndex = (urgency: string) => urgencies.indexOf(urgency);
  const textAreaRef = useRef(null);
  const textAreaRef2 = useRef(null);

  // const isMobile = useWindowSize().width < 1024
  const [settingNewTaskGroup, setSettingNewTaskGroup] = useState(false);

  const [newTaskGroupTitle, setNewTaskGroupTitle] = useState(`Task group 1`);
  const [updateTaskGroupTitle, setUpdateTaskGroupTitle] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [settingNewTask, setSettingNewTask] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState('');
  const [editingTaskText, setEditingTaskText] = useState('');

  const [noteIndexEditing, setNoteIndexEditing] = useState('');

  const [textareaValue, setTextareaValue] = useState('');

  const [touchableDevice, setTouchableDevice] = useState(false);

  useEffect(() => {
    if (window.navigator.maxTouchPoints > 0) {
      setTouchableDevice(true);
    }
  }, []);

  useClickAway(textAreaRef, () => {
    const editingTask = tasks.find(task => task.id === noteIndexEditing);
    if (editingTask && typeof textareaValue !== 'undefined')
      updateTask({
        id: noteIndexEditing,
        data: {
          ...editingTask.data,
          description: textareaValue,
        },
      });
    setNoteIndexEditing('');
  });

  // useClickAway(textAreaRef2, (wtf) => {
  //
  //   const editingTask = tasks.find(task => task.id === noteIndexEditing)
  //   if (editingTask && typeof (textareaValue) !== "undefined")
  //     updateTask({
  //       id: noteIndexEditing,
  //       data: {
  //         ...editingTask.data,
  //         description: textareaValue,
  //       },
  //     })
  //   setNoteIndexEditing("")
  // });

  const {
    setTaskGroupIndex,
    taskGroupIndex,
    setUser,
    user,
    taskGroups,
    setTaskGroups,
    tasks,
    setTasks,
    groupsLoading,
    setGroupsLoading,
  } = useUserStore(state => state);

  type session_type = {
    data: Session | null;
    status: 'authenticated' | 'unauthenticated' | 'loading';
  };

  const session = useSession();

  const onLongPress = (e: any) => {

    // alert('long press');
  };

  const longPressOptions = {
    isPreventDefault: false,
    delay: 300,
  };

  const longPressEvent = useLongPress(onLongPress, longPressOptions);

  const swipeHandlers = useSwipeable({
    // onSwiped: (eventData) => ,
    onSwipedLeft: eventData => {
      if (wrap(0, 3, paneIndex + 1) === 0) setFolded(false);
      else setFolded(true);
      setPaneIndex(wrap(0, 3, paneIndex + 1));
      //   "font-size:16px;background-color:#a5b942;color:white;",
      //   wrap(0, 3, paneIndex + 1))
    },
    onSwipedUp: eventData => {},
    onSwipedDown: eventData => {},
    onSwipedRight: eventData => {
      if (wrap(0, 3, paneIndex - 1) === 0) setFolded(false);
      else setFolded(true);

      setPaneIndex(wrap(0, 3, paneIndex - 1));
    },
    delta: 10, // min distance(px) before a swipe starts. *See Notes*
    // preventDefaultTouchmoveEvent: false,  // call e.preventDefault *See Details*
    trackTouch: true, // track touch input
    trackMouse: false, // track mouse input
    // rotationAngle: 0,                     // set a rotation angle
  });

  useEffect(() => {
    if (session.status === 'authenticated' && session.data.token != undefined) {
      //@ts-ignore
      const { name, email, picture } = session.data?.token;

      initUser(name, email, picture).then(async userDoc => {
        const { id } = userDoc;
        const user_document = await getDoc(userDoc);
        //@ts-ignore
        const { data } = user_document.data();

        if (data?.theme !== '' && data?.theme !== undefined)
          setTheme(data.theme);
        setUser({ name, email, picture, id, data });
        requestNotificationPermission();
        refreshTaskData({
          userid: id,
          taskGroupIndex,
          setTaskGroups,
          setTasks,
          setGroupsLoading,
        });
      });
    }
  }, [
    session,
    setGroupsLoading,
    setTaskGroups,
    setTasks,
    setUser,
    taskGroupIndex,
  ]);

  useEffect(() => {
    if (taskGroups.length > 0 && taskGroupIndex > -1) {
      getTasks(user.id, taskGroups[taskGroupIndex].id).then(res => {
        setTasks(res);
      });
    }
  }, [setTasks, taskGroupIndex, taskGroups, user.id]);

  const updateTask =
  // useCallback(

    ({ id, data }: { id: string; data: any; }, callBack?:any) => {
      f_updateTask(user.id, taskGroups[taskGroupIndex].id, id, data).then(
        () => {
          callBack && callBack();
          refreshTaskData({
            userid: user.id,
            taskGroupIndex,
            setTaskGroups,
            setTasks,
            setGroupsLoading,
          });
        },
      );
    }
    // [
    //   setGroupsLoading,
    //   setTaskGroups,
    //   setTasks,
    //   taskGroupIndex,
    //   taskGroups,
    //   user.id,
    // ],
  // );

  useEffect(() => {
    const editingTask = tasks.find(task => task.id === noteIndexEditing);

    const strippedData = stripImagesData(fileList)
    if (editingTask && fileList.length > 0 && areAllFilesUploaded(fileList)) {
      {
        const images = editingTask.data.images ? [...editingTask.data.images,...strippedData] : [...strippedData]
        const args = {
          id: noteIndexEditing,
          data: {
            ...editingTask.data,
            images,
          },
        };

        updateTask(args,setFileList([]));

      }
    }
  }, [fileList, noteIndexEditing,tasks]);

  const onArchive = (id: string, value: boolean) => {
    const task = tasks.find(item => item.id === id);
    updateTask({
      id,
      data: {
        ...task!.data,
        archived: value,
        archivedAt: value ? serverTimestamp() : null,
      },
    });
    refreshTaskData({
      userid: user.id,
      taskGroupIndex,
      setTaskGroups,
      setTasks,
      setGroupsLoading,
    });
  };

  const allowArchive = () => {
    const isZeroTab = wrap(0, 3, paneIndex - 1) === 0;
    const tasksExist =
      tasks.filter(
        task =>
          task.data.checkable &&
          // &&
          // task.data.checked
          !task.data.archived,
      ).length > 1;

    const res = tasksExist && isZeroTab;
    // || tasksExist && (window.innerHeight > 800) && isZeroTab
    // (folded && isZeroTab && (window.innerWidth < 800)) || !folded

    return res;
  };

  const archiveChecked = () => {
    const tasksToArchive = tasks.filter(
      task =>
        task.data.checkable &&
        // &&
        // task.data.checked
        !task.data.archived,
    );

    tasksToArchive &&
      tasksToArchive.forEach(task =>
        updateTask({
          id: task.id,
          data: {
            ...task.data,
            archived: true,
          },
        }),
      );
  };

  const currentDayClick = () => {
    setCurrentDaySelected(true);

    const tgName = new Date(Date.now()).toLocaleDateString('ru-RU', {
      year: '2-digit',
      month: 'short',
      day: 'numeric',
    });

    const allowCreateNew = !taskGroups.some(
      taskgroup => taskgroup.data.title === tgName,
    );

    if (allowCreateNew) {
      newTaskGroup(user.id, tgName).then(() => {
        refreshTaskData({
          userid: user.id,
          taskGroupIndex,
          setTaskGroups,
          setTasks,
          setGroupsLoading,
        }).then(() => {
          setTaskGroupIndex(0);
        });
      });
    } else {
      setTaskGroupIndex(taskGroups.findIndex(tg => tg.data.title === tgName));
    }
  };

  const switchTextArea = (task: any) => {
    const taskId = task.id;



    if (noteIndexEditing !== taskId) {
      setNoteIndexEditing(taskId);
      setTextareaValue(task.data?.description);
    } else {
      setNoteIndexEditing('');
      setTextareaValue('');
    }
  };

  // const updateTextArea = (task: any, text: string) => {
  //   setTextareaValue(text)
  //   updateTask({
  //     id: task.id,
  //     data: {
  //       ...task.data,
  //       description: text,
  //     },
  //   })
  // }

  const [, cancel] = useDebounce(
    () => {
      const editingTask = tasks.find(task => task.id === noteIndexEditing);

      if (editingTask && typeof textareaValue !== 'undefined')
        updateTask({
          id: noteIndexEditing,
          data: {
            ...editingTask.data,
            description: textareaValue,
          },
        });
    },
    2000,
    [textareaValue],
  );
  const editingTask = tasks.find(task => task.id === noteIndexEditing);

  return (
    <>
      <Head>
        <title>Dimas planner</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AnimatePresence>
        <main
          className={`${s.main} ${folded ? s.folded : ''}`}
          {...swipeHandlers}
        >
          {allowArchive() && (
            <div className={s.floatingButton} onClick={() => archiveChecked()}>
              <Button
                icon={<IoArchiveSharp size={30} />}
                hint={'Archive all'}
              />
            </div>
          )}
          {session.status === 'authenticated' && <UserPanel />}

          {session.status === 'authenticated' && (
            <div className={s.sidebar}>
              <div className={`${s.sidebarControls}`}>
                {settingNewTaskGroup ? (
                  <li className={` ${s.control} `}>
                    <input
                      autoFocus
                      type='text'
                      value={newTaskGroupTitle}
                      onChange={e => setNewTaskGroupTitle(e.target.value)}
                      onBlur={e => {
                        if (isValidText(newTaskGroupTitle))
                          newTaskGroup(user.id, newTaskGroupTitle).then(() => {
                            setTasks([]);
                            getTaskGroups(user.id).then(res => {
                              setTaskGroups(res);
                              setNewTaskGroupTitle(
                                `Task group ${taskGroups.length + 1}`,
                              );
                              setSettingNewTaskGroup(false);
                              setTaskGroupIndex(0);
                            });
                            setCurrentDaySelected(false);
                          });
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (isValidText(newTaskGroupTitle))
                            newTaskGroup(user.id, newTaskGroupTitle).then(
                              () => {
                                setTasks([]);
                                getTaskGroups(user.id).then(res => {
                                  setTaskGroups(res);
                                  setNewTaskGroupTitle(
                                    `Task group ${taskGroups.length + 1}`,
                                  );
                                  setSettingNewTaskGroup(false);
                                  setTaskGroupIndex(0);
                                  setCurrentDaySelected(false);
                                });
                              },
                            );
                        }
                      }}
                    />
                  </li>
                ) : (
                  <li
                    className={` ${s.control} `}
                    onClick={() => {
                      setSettingNewTaskGroup(true);
                      if (window.innerWidth < 800) setFolded(false);
                    }}
                  >
                    <Button
                      title={!folded ? t('buttons.add_task_group') : ''}
                      icon={<IoAddCircleOutline size={20} />}
                      hint={'Добавьте группу чтобы сгруппировать ваши задачи'}
                      hintPosition={'right'}
                    />
                  </li>
                )}
                <Tooltip title={'Список на сегодня'} placement='right'>
                  <button
                    className={
                      currentDaySelected ? s.currentDaySelected : s.currentDay
                    }
                    onClick={e => {
                      currentDayClick();
                      // setTaskGroupIndex(-1)
                    }}
                  >
                    {!currentDaySelected ? (
                      <AiOutlineStar size={20} />
                    ) : (
                      <AiFillStar size={20} />
                    )}
                    {!folded && <span>{t('buttons.current_day')}</span>}
                  </button>
                </Tooltip>
              </div>
              <motion.ul
                layout
                {...fastTransition}
                className={` ${s.taskGroups} `}
              >
                {taskGroups.map((group, index) => (
                  <li
                    key={group.id}
                    className={taskGroupIndex === index ? s.selected : ''}
                    onClick={() => {
                      setPaneIndex(0);
                      setUpdateTaskGroupTitle(group.data.title);
                      setCurrentDaySelected(false);
                      setTaskGroupIndex(index);
                      setNoteIndexEditing('');
                    }}
                    onDoubleClick={() => {
                      setEditingTaskTitle(true);
                    }}
                  >
                    {index === taskGroupIndex && editingTaskTitle ? (
                      <input
                        autoFocus
                        onBlur={() => {
                          if (!isValidText(updateTaskGroupTitle)) return;
                          f_updateTaskGroupTitle(
                            user.id,
                            taskGroups[taskGroupIndex].id,
                            updateTaskGroupTitle,
                          ).then(() => {
                            getTaskGroups(user.id).then(res => {
                              setNewTaskGroupTitle(
                                `Task group ${res.length + 1}`,
                              );
                              setTaskGroups(res);
                              setEditingTaskTitle(false);
                            });
                          });
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            if (!isValidText(updateTaskGroupTitle)) return;
                            f_updateTaskGroupTitle(
                              user.id,
                              taskGroups[taskGroupIndex].id,
                              updateTaskGroupTitle,
                            ).then(() => {
                              getTaskGroups(user.id).then(res => {
                                setNewTaskGroupTitle(
                                  `Task group ${res.length + 1}`,
                                );
                                setTaskGroups(res);
                                setEditingTaskTitle(false);
                              });
                            });
                          }
                        }}
                        type='text'
                        placeholder={t('messages.task_group_title_placeholder')}
                        value={updateTaskGroupTitle}
                        onChange={e => {
                          setUpdateTaskGroupTitle(e.target.value);
                        }}
                      />
                    ) : (
                      <>
                        <p>
                          {/* {

                            } */}
                          {
                            <Badge
                              className={cn({
                                activeTasks: true,
                                urgent: getUrgencyForUnarchivedTasks(
                                  group.taskArray,
                                ).urgent,
                                warning: getUrgencyForUnarchivedTasks(
                                  group.taskArray,
                                ).warning,
                                placehold: group.activeTasks === 0,
                              })}
                              count={group.activeTasks}
                            />
                            // <span
                            //   className={cn({
                            //     activeTasks: true,
                            //     urgent: group.urgentTasks > 0,
                            //     warning: group.warningTasks > 0,
                            //     placehold: group.activeTasks === 0,
                            //   })}
                            // >
                            //   {group.activeTasks}
                            // </span>
                          }{' '}
                          {`${
                            folded
                              ? extractCapitals(group.data.title)
                              : group.data.title
                          }`}
                        </p>
                        {!folded && (
                          <AiFillDelete
                            onClick={e => {
                              e.stopPropagation();
                              deleteTaskGroup(
                                user.id,
                                taskGroups[index].id,
                              ).then(() => {
                                if (index <= taskGroupIndex) {
                                  if (taskGroupIndex > 0)
                                    setTaskGroupIndex(taskGroupIndex - 1);
                                  else setTaskGroupIndex(0);
                                }
                                //

                                refreshTaskData({
                                  userid: user.id,
                                  taskGroupIndex,
                                  setTaskGroups,
                                  setTasks,
                                  setGroupsLoading,
                                });

                                setNewTaskGroupTitle(
                                  `Task group ${taskGroups.length + 1}`,
                                );
                              });
                            }}
                          />
                        )}
                      </>
                    )}
                  </li>
                ))}
                {groupsLoading && (
                  <aside className={` ${s.taskGroupsOverlay} `}>
                    <Image
                      src='/image/loadingHeart.gif'
                      width={64}
                      height={64}
                      alt='loading'
                    />
                  </aside>
                )}
              </motion.ul>
            </div>
          )}
          {session.status === 'authenticated' ? (
            <section className={s.tasksWrapper}>
              <h1>{taskGroups[taskGroupIndex].data.title}</h1>
              <Tabs
                centered
                size='small'
                onTabClick={e => {
                  setNoteIndexEditing('');
                  setPaneIndex(parseInt(e));
                  if (window.innerWidth < 800) setFolded(true);
                }}
                defaultActiveKey='1'
                activeKey={(wrap(0, 3, paneIndex) > 0
                  ? wrap(0, 3, paneIndex)
                  : 1
                ).toString()}
                className={` ${s.tasks} `}
                style={{ overflowY: 'scroll', padding: '10px' }}
                animated={{ inkBar: true }}
              >
                <TabPane tab={t('buttons.active_tasks')} key={'1'}>
                  <ActiveTab
                    settingNewTaskGroup={settingNewTaskGroup}
                    tasks={tasks}
                    switchTextArea={switchTextArea}
                    onArchive={onArchive}
                    noteIndexEditing={noteIndexEditing}
                    textAreaRef2={textAreaRef2}
                    textareaValue={textareaValue}
                    setTextareaValue={setTextareaValue}
                    editingTask={editingTask}
                    longPressEvent={longPressEvent}
                    settingNewTask={settingNewTask}
                    editingTaskIndex={editingTaskIndex}
                    editingTaskText={editingTaskText}
                    setSettingNewTask={setSettingNewTask}
                    updateTask={updateTask}
                    setEditingTaskText={setEditingTaskText}
                    setEditingTaskIndex={setEditingTaskIndex}
                    paneIndex={paneIndex}
                    touchableDevice={touchableDevice}
                    getUrgencyIndex={getUrgencyIndex}
                    fileList={fileList}
                    setFileList={setFileList}
                  />
                </TabPane>
                <TabPane tab={t('buttons.archived_tasks')} key='2'>
                  <ArchivedTab
                    settingNewTaskGroup={settingNewTaskGroup}
                    tasks={tasks}
                    onArchive={onArchive}
                    switchTextArea={switchTextArea}
                    noteIndexEditing={noteIndexEditing}
                    editingTask={editingTask}
                    textareaValue={textareaValue}
                    setTextareaValue={setTextareaValue}
                    textAreaRef={textAreaRef}
                    fileList={fileList}
                    setFileList={setFileList}
                    longPressEvent={longPressEvent}
                  />
                </TabPane>
              </Tabs>
            </section>
          ) : (
            session.status !== 'loading' && <NotLogged />
          )}
          <Loader loading={session.status === 'loading'} />
          {session.status === 'authenticated' && (
            <>
              {(paneIndex === 1 || !touchableDevice) && (
                <div className={` ${s.newTask} `}>
                  <InputPanel setNewTaskGroupTitle={setNewTaskGroupTitle} />
                </div>
              )}
              <SettingsPanel />
            </>
          )}
        </main>
      </AnimatePresence>
    </>
  );
};

export default Home;
