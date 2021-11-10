// import { db, app } from '@/utils/fire';
import {
  extractCapitals,
  getTaskGroups,
  getTasks, refreshTaskData, requestNotificationPermission,
  setTheme
} from '@/utils/apputils'
import { initUser } from '@/utils/fire'
import { Tabs } from 'antd'
import 'antd/dist/antd.css' // or 'antd/dist/antd.less'
import classNames from 'classnames/bind'
import {

  getDoc
} from 'firebase/firestore'
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { AnimatePresence, motion } from 'framer-motion'
import type { NextPage } from 'next'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import { wrap } from 'popmotion'
import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { IoAddCircleOutline, IoArchiveOutline, IoArchiveSharp } from 'react-icons/io5'
import { RiInboxUnarchiveLine } from "react-icons/ri"
import { useSwipeable } from 'react-swipeable'
import { useLongPress, useWindowSize } from 'react-use'
import s from '../styles/Home.module.scss'
import { AddTasks } from './../components/AddTasks/AddTasks'
import { fastTransition } from './../components/anims'
import { InputPanel } from './../components/InputPanel'
import { Loader } from './../components/Loader/Loader'
import { NotLogged } from './../components/NotLogged'
import { SettingsPanel } from './../components/SettingsPanel'
import { UserPanel } from './../components/UserPanel'
import { isValidText } from './../utils/apputils'
import { deleteTaskGroup, f_updateTask, f_updateTaskGroupTitle, newTaskGroup } from './../utils/fire'
import { useUserStore } from './../utils/store'
import { Button } from './../components/Button/Button';
import { Tooltip } from 'antd';
import Image from 'next/image';


const cn = classNames.bind(s);
// const db = getFirestore(app)

const { TabPane } = Tabs;



const Home: NextPage = () => {
  const { t } = useTranslation('common')
  const [folded, setFolded] = useState(false)
  const [paneIndex, setPaneIndex] = useState(0)
  const [editingTaskTitle, setEditingTaskTitle] =
    useState(false)

  const [currentDaySelected, setCurrentDaySelected] = useState(false)

  const [
    settingNewTaskGroup,
    setSettingNewTaskGroup,
  ] = useState(false)

  const [
    newTaskGroupTitle,
    setNewTaskGroupTitle,
  ] = useState(`Task group 1`)
  const [
    updateTaskGroupTitle,
    setUpdateTaskGroupTitle,
  ] = useState('')
  const [newTaskText, setNewTaskText] =
    useState('')
  const [settingNewTask, setSettingNewTask] =
    useState(false)
  const [editingTaskIndex, setEditingTaskIndex] =
    useState('')
  const [editingTaskText, setEditingTaskText] =
    useState('')

  // const [tasks, setTasks] = useState<
  //   { id: string; data: any }[]
  // >([])
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
    setGroupsLoading
  } = useUserStore(state => state)

  type session_type = {
    data: Session | null;
    status: "authenticated" | "unauthenticated" | "loading";
  }
  const session = useSession()

  const onLongPress = () => {
    console.log('calls callback after long pressing 300ms');
  };

  const longPressOptions = {
    isPreventDefault: false,
    delay: 200,
  };
  const longPressEvent = useLongPress(onLongPress, longPressOptions);

  const swipeHandlers = useSwipeable({
    // onSwiped: (eventData) => console.log("User Swiped!", eventData),
    onSwipedLeft: (eventData) => {
      if (wrap(0, 3, paneIndex + 1) === 0)
        setFolded(false)
      else
        setFolded(true)
      setPaneIndex(wrap(0, 3, paneIndex + 1))

      // console.log("%c 🧞‍♀️: Home:onSwipedLeft -> paneIndex ",
      //   "font-size:16px;background-color:#a5b942;color:white;",
      //   wrap(0, 3, paneIndex + 1))
      // console.log("User onSwipedLeft!", eventData)
    },
    onSwipedUp: (eventData) => {

    },
    onSwipedDown: (eventData) => {

    },
    onSwipedRight: (eventData) => {
      if (wrap(0, 3, paneIndex - 1) === 0)
        setFolded(false)
      else
        setFolded(true)

      setPaneIndex(wrap(0, 3, paneIndex - 1))

      // console.log("%c 🧞‍♀️: Home:onSwipedRight -> paneIndex ",
      //   "font-size:16px;background-color:#a5b942;color:white;",
      //   wrap(0, 3, paneIndex - 1))
      // console.log("User onSwipedRight!", eventData)
    },
    delta: 10,                            // min distance(px) before a swipe starts. *See Notes*
    // preventDefaultTouchmoveEvent: false,  // call e.preventDefault *See Details*
    trackTouch: true,                     // track touch input
    trackMouse: false,                    // track mouse input
    // rotationAngle: 0,                     // set a rotation angle

  });

  useEffect(() => {
    if (
      session.status === 'authenticated' &&
      session.data.token != undefined
    ) {
			//@ts-ignore
      const { name, email, picture } =
        session.data?.token

      initUser(name, email, picture).then(async (userDoc) => {
        const { id } = userDoc
        const user_document = await getDoc(userDoc)
        //@ts-ignore
        const { data } = user_document.data()

        if (data?.theme !== '' && data?.theme !== undefined)
          setTheme(data.theme)
        setUser({ name, email, picture, id, data })
        requestNotificationPermission()
        refreshTaskData({
          userid: id,
          taskGroupIndex,
          setTaskGroups,
          setTasks,
          setGroupsLoading
        })
        // getTaskGroups(id).then(res => {
        //   setTaskGroups(res)
        //   setNewTaskGroupTitle(
        //     `Task group ${res.length + 1}`
        //   )
        //   if (res.length > 0 && taskGroupIndex > -1) {
        //     getTasks(
        //       id,
        //       res[taskGroupIndex].id
        //     ).then(res => {
        //       setTasks(res)
        //     })
        //   }
        // })
      })
    }
  }, [session])

  // const size = useWindowSize()
  // useEffect(() => {
  //   if (size.width < 800) setFolded(true)
  //   else setFolded(false)
  // })
  useEffect(() => {
    if (taskGroups.length > 0 && taskGroupIndex > -1) {
      getTasks(
        user.id,
        taskGroups[taskGroupIndex].id
      ).then(res => {
        setTasks(res)
      })
    }
  }, [taskGroupIndex])

  const updateTask = ({
    id,
    data,
  }: {
    id: string
    data: any
  }) => {
    f_updateTask(
      user.id,
      taskGroups[taskGroupIndex].id,
      id,
      data
    ).then(() => {
      // getTasks(
      //   user.id,
      //   taskGroups[taskGroupIndex].id
      // ).then(res => {
      //   setTasks(res)
      // })
      refreshTaskData({
        userid: user.id,
        taskGroupIndex,
        setTaskGroups,
        setTasks,
        setGroupsLoading
      })
    })
		// setTasks(tasks.map((task, i) => task.id === id ? { id, data } : task))
  }
  const onArchive = (id: string, value: boolean) => {
    const task = tasks.find((item) => item.id === id)
    // console.log("%c 👶: onArchive -> task ",
    //   "font-size:16px;background-color:#328181;color:white;",
    //   task)
    updateTask({
      id,
      data: {
        ...task!.data,
        archived: value
      }
    }
    )
    refreshTaskData({
      userid: user.id,
      taskGroupIndex,
      setTaskGroups,
      setTasks,
      setGroupsLoading
    })
  }


  const allowArchive = () => {

    const isZeroTab = wrap(0, 3, paneIndex - 1) === 0
    // console.log("tab", wrap(0, 3, paneIndex - 1))
    const tasksExist = tasks.filter(task =>
      task.data.checkable
      &&
      task.data.checked
      &&
      !task.data.archived
    ).length > 1

    const res = tasksExist && isZeroTab
    // || tasksExist && (window.innerHeight > 800) && isZeroTab
    // (folded && isZeroTab && (window.innerWidth < 800)) || !folded

    return res
  }



  const archiveChecked = () => {

    const tasksToArchive = tasks.filter((task) =>
      task.data.checkable
      &&
      task.data.checked
      &&
      !task.data.archived)


    tasksToArchive && tasksToArchive.forEach(task => updateTask({
      id: task.id, data: {
        ...task.data,
        archived: true
      }
    }))
  }

  const currentDayClick = () => {

    // getTasks(user)

  }

  return (
    <>
      <Head>
        <title>Dimas planner</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AnimatePresence>
      <main
        className={`${s.main} ${folded ? s.folded : ''
          }`}
          {...swipeHandlers}
        >
          {allowArchive() && <div
            className={s.floatingButton}
            onClick={() => archiveChecked()}
          >
            <Button
              icon={<IoArchiveSharp size={30} />}
              hint={"Archive all"}
            />
          </div>
          }
        {session.status === 'authenticated' && (
          <UserPanel />
        )}

          {(session.status === 'authenticated') && (
            <div className={s.sidebar}>
            <div className={`${s.sidebarControls}`}>
              {settingNewTaskGroup ? (<li
                className={` ${s.control} `}
              >
                <input
                  autoFocus
                  type='text'
                  value={newTaskGroupTitle}
                  onChange={e =>
                    setNewTaskGroupTitle(
                      e.target.value
                    )
                  }
                  onBlur={e => {
                    if (
                      isValidText(newTaskGroupTitle)
                    )
                      newTaskGroup(
                        user.id,
                        newTaskGroupTitle
                      ).then(() => {
                        setTasks([])
                        getTaskGroups(user.id).then(
                          res => {
                            setTaskGroups(res)
                            setNewTaskGroupTitle(
                              `Task group ${taskGroups.length +
                              1
                              }`
                            )
                            setSettingNewTaskGroup(
                              false
                            )
                            setTaskGroupIndex(0)
                          }
                        )
                      })
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      if (
                        isValidText(
                          newTaskGroupTitle
                        )
                      )
                        newTaskGroup(
                          user.id,
                          newTaskGroupTitle
                        ).then(() => {
                          setTasks([])
                          getTaskGroups(
                            user.id
                          ).then(res => {
                            setTaskGroups(res)
                            setNewTaskGroupTitle(
                              `Task group ${taskGroups.length +
                              1
                              }`
                            )
                            setSettingNewTaskGroup(
                              false
                            )
                            setTaskGroupIndex(0)
                          })
                        })
                    }
                  }}
                />
              </li>
              ) : (
                <li
                  className={` ${s.control} `}
                  onClick={() => {
                    setSettingNewTaskGroup(true)
                    if (window.innerWidth < 800)
                      setFolded(false)
                  }}
                  >
                    <Button
                      title={!folded ? t('buttons.add_task_group') : ""}
                      icon={<IoAddCircleOutline size={20} />}
                      hint={'Добавьте группу чтобы сгруппировать ваши задачи'}
                      hintPosition={'right'}
                    />
                </li>
              )}
                <Tooltip
                  title={"Список на сегодня"}
                  placement="right"
                >
                  <button
                    className={currentDaySelected ? s.currentDaySelected : s.currentDay}
                    onClick={(e) => {
                      currentDayClick()
                      setCurrentDaySelected(true)
                      setTaskGroupIndex(-1)
                    }}
                  >
                    {!currentDaySelected
                      ? <AiOutlineStar size={20} />
                      : <AiFillStar size={20} />}
                    {!folded && <span>{t("buttons.current_day")}</span>
                    }
                  </button>
                </Tooltip>
            </div>
            <motion.ul layout
              {...fastTransition}
              className={` ${s.taskGroups} `}>
                {taskGroups.map((group, index) => (
                <li
                  key={group.id}
                  className={
                    taskGroupIndex === index
                      ? s.selected
                      : ''
                  }
                  onClick={() => {
                    setUpdateTaskGroupTitle(
                      group.data.title
                    )
                    setCurrentDaySelected(false)
                    setTaskGroupIndex(index)
                  }}
                  onDoubleClick={() => {
                    setEditingTaskTitle(true)
                  }}
                >
                  {index === taskGroupIndex &&
                    editingTaskTitle ? (
                    <input
                      autoFocus
                      onBlur={() => {
                        if (
                          !isValidText(
                            updateTaskGroupTitle
                          )
                        )
                          return
                        f_updateTaskGroupTitle(
                          user.id,
                          taskGroups[taskGroupIndex]
                            .id,
                          updateTaskGroupTitle
                        ).then(() => {
                          getTaskGroups(
                            user.id
                          ).then(res => {
                            setNewTaskGroupTitle(
                              `Task group ${res.length + 1
                              }`
                            )
                            setTaskGroups(res)
                            setEditingTaskTitle(
                              false
                            )
                          })
                        })
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (
                            !isValidText(
                              updateTaskGroupTitle
                            )
                          )
                            return
                          f_updateTaskGroupTitle(
                            user.id,
                            taskGroups[
                              taskGroupIndex
                            ].id,
                            updateTaskGroupTitle
                          ).then(() => {
                            getTaskGroups(
                              user.id
                            ).then(res => {
                              setNewTaskGroupTitle(
                                `Task group ${res.length + 1
                                }`
                              )
                              setTaskGroups(res)
                              setEditingTaskTitle(
                                false
                              )
                            })
                          })
                        }
                      }}
                      type='text'
                      placeholder={t(
                        'messages.task_group_title_placeholder'
                      )}
                      value={updateTaskGroupTitle}
                      onChange={e => {
                        setUpdateTaskGroupTitle(
                          e.target.value
                        )
                      }}
                    />
                  ) : (
                    <>
                        <p>
                          {group.activeTasks !== 0 && <span
                            className={cn({
                              activeTasks: true,
                              urgent: group.urgentTasks > 0,
                              warning: group.warningTasks > 0,
                            })}
                          >
                            {group.activeTasks}
                          </span>
                          }
                        {' '}
                        {`${folded
                          ? extractCapitals(
                            group.data.title
                          )
                          : group.data.title
                          }`}
                      </p>
                      {!folded && (
                        <AiFillDelete
                          onClick={e => {
                                e.stopPropagation()
                            deleteTaskGroup(
                              user.id,
                              taskGroups[index].id
                            ).then(() => {
                              if (
                                index <=
                                taskGroupIndex
                              ) {
                                if (
                                  taskGroupIndex > 0
                                )
                                  setTaskGroupIndex(
                                    taskGroupIndex -
                                    1
                                  )
                                else
                                  setTaskGroupIndex(
                                    0
                                  )
                              }
                              getTaskGroups(
                                user.id
                              ).then(res => {
                                setTaskGroups(res)
                                setNewTaskGroupTitle(
                                  `Task group ${res.length + 1}`
                                )
                                getTasks(
                                  user.id,
                                  res[taskGroupIndex].id
                                ).then(res => {
                                  setTasks(res)
                                })
                              })
                            })
                          }}
                        />
                      )}
                    </>
                  )}
                </li>
                ))
                }
                {
                  groupsLoading && <aside
                    className={` ${s.taskGroupsOverlay} `}

                  >
                    <Image
                      src="/image/loadingHeart.gif"
                      width={64}
                      height={64}
                    />

                  </aside>
                }
            </motion.ul>
          </div>
        )}
        {session.status === 'authenticated' ? (


            <Tabs
              centered
              size="small"
              onTabClick={e => {
                setPaneIndex(parseInt(e))
                if (window.innerWidth < 800)
                  setFolded(true)
              }}
              defaultActiveKey="1"
              activeKey={
                (wrap(0, 3, paneIndex) > 0 ? wrap(0, 3, paneIndex) : 1).toString()
              }
              className={` ${s.tasks} `}
              style={{ overflowY: 'scroll', padding: '10px' }}
              animated={
                { inkBar: true }
              }
            // onChange={callback}

            >
              <TabPane
                tab={t('buttons.active_tasks')}
                key={'1'}
              // activeKey={
              //   wrap(0, 3, paneIndex) > 0 ? wrap(0, 3, paneIndex) : 1
              // }
              >
                <motion.ul layout
                  {...fastTransition}
                  // onClick={() => {
                  //   if (window.innerWidth < 800)
                  //     // setFolded(true)
                  // }}
                  className={` ${s.tasks} `}
                >
                  {!settingNewTaskGroup &&
                    tasks.map(task => {
                      if (!task.data.archived)
                        return (

                          <li
                            className={cn({
                              checked: task.data.checked,
                              normal: task.data.urgency === 'normal',
                              urgent: task.data.urgency === 'urgent',
                              warning: task.data.urgency === 'warning',
                            })}

                            key={task.id}
                            onDoubleClick={e => {
                              e.stopPropagation()
                              setEditingTaskIndex(task.id)
                              setEditingTaskText(
                                task.data.text
                              )
                              setSettingNewTask(true)
                            }}
                            onClick={() => {
                              updateTask({
                                id: task.id,
                                data: {
                                  ...task.data,
                                  checked:
                                    !task.data.checked,
                                },
                              })
                            }}
                          >
                            {settingNewTask &&
                              editingTaskIndex === task.id ? (
                              <input
                                type='text'
                                autoFocus
                                onBlur={() => {
                                  if (
                                    !isValidText(
                                      editingTaskText
                                    )
                                  )
                                    return
                                  setSettingNewTask(false)
                                  updateTask({
                                    id: task.id,
                                    data: {
                                      ...task.data,
                                      text: editingTaskText,
                                    },
                                  })
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    if (
                                      !isValidText(
                                        editingTaskText
                                      )
                                    )
                                      return
                                    setSettingNewTask(false)
                                    updateTask({
                                      id: task.id,
                                      data: {
                                        ...task.data,
                                        text: editingTaskText,
                                      },
                                    })
                                  }
                                }}
                                placeholder=''
                                value={editingTaskText}
                                onChange={e => {
                                  setEditingTaskText(
                                    e.target.value
                                  )
                                }}
                              />
                            ) : (
                              <>
                                <p>{task.data.text}</p>
                                  {task.data.checked && <IoArchiveOutline
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onArchive(task.id, true)

                                    }}
                                    size={25} />}
                                  {/* <Checkbox
                                checked={task.data.checked}
                              /> */}
                                  {/* <input
                          type='checkbox'
                          readOnly
                        name=''
                        id=''
                        checked={
                          task.data.checked
                        }
                      /> */}
                              </>
                            )}
                          </li>
                        )
                    })}
                  {tasks.length === 0 && <AddTasks />}
                </motion.ul>
              </TabPane>
              <TabPane tab={t('buttons.archived_tasks')} key="2">
                <motion.ul layout
                  {...fastTransition}
                  // onClick={() => {
                  //   if (window.innerWidth < 800)
                  //     // setFolded(true)
                  // }}
                  className={` ${s.tasks}  ${s.archived_tasks} `}
                >
                  {!settingNewTaskGroup &&
                    tasks.map(task => {
                      if (task.data.archived)
                        return (

                          <li
                            className={cn({
                              normal: task.data.urgency === 'normal',
                              urgent: task.data.urgency === 'urgent',
                              warning: task.data.urgency === 'warning',
                            })}

                            key={task.id}
                          // onDoubleClick={e => {
                          //   e.stopPropagation()
                          //   setEditingTaskIndex(task.id)
                          //   setEditingTaskText(
                          //     task.data.text
                          //   )
                          //   setSettingNewTask(true)
                          // }}
                          // onClick={() => {
                          //   updateTask({
                          //     id: task.id,
                          //     data: {
                          //       ...task.data,
                          //       checked:
                          //         !task.data.checked,
                          //     },
                          //   })
                          // }}
                          >
                            <p>{task.data.text}</p>
                            <RiInboxUnarchiveLine
                              onClick={(e) => {
                                e.stopPropagation();
                                onArchive(task.id, false)

                              }}
                              size={25} />
                          </li>
                        )
                    })}
                  {tasks.length === 0 && <AddTasks />}
                </motion.ul>
              </TabPane>

            </Tabs>

        ) : session.status !== 'loading' && <NotLogged />
        }
        <Loader
          loading={session.status === 'loading'}
        />
          {session.status === 'authenticated' && (<>

            <div className={` ${s.newTask} `}>
              <InputPanel
                // setTaskGroups={setTaskGroups}
                setNewTaskGroupTitle={setNewTaskGroupTitle}
                // taskGroups={taskGroups}
                // setTasks={setTasks}
              />
            </div>
            <SettingsPanel />
          </>
        )}
        </main>
      </AnimatePresence>
    </>
  )
}

export default Home
