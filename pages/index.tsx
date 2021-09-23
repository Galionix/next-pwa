// import { db, app } from '@/utils/fire';
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import {
  useEffect,
  useRef,
  useState,
} from 'react'
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import s from '../styles/Home.module.scss'
import { AuthButton } from './../components/AuthButton'
import { useUserStore } from './../utils/store'
import { AiFillDelete } from 'react-icons/ai'
import { IoAddCircleOutline, IoArchive, IoArchiveOutline } from 'react-icons/io5'
import { Checkbox, Divider, Tabs } from 'antd';


import {
  app,
  newTaskGroup,
  f_updateTaskGroupTitle,
} from './../utils/fire'
import {
  doc,
  setDoc,
  getFirestore,
} from 'firebase/firestore'
// import { getDatabase, ref, set } from "firebase/database";
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './../utils/fire'
import { initUser } from '@/utils/fire'
import {
  extractCapitals,
  getTaskGroups,
  getTasks,
  notification,
  requestNotificationPermission,
} from '@/utils/apputils'
import { addTask } from './../utils/fire'
import { useRouter } from 'next/dist/client/router'
import useTranslation from 'next-translate/useTranslation'
import { UserPanel } from './../components/UserPanel'
import { SettingsPanel } from './../components/SettingsPanel'
import { NotLogged } from './../components/NotLogged'
import { TaskPanel } from './../components/TaskPanel'
import { deleteTaskGroup } from './../utils/fire'
import { isValidText } from './../utils/apputils'
import { Loader } from './../components/Loader/Loader'
import { AddTasks } from './../components/AddTasks/AddTasks'
import { f_updateTask } from './../utils/fire'
import { Session } from 'next-auth'
import { useLongPress } from 'react-use';
import { useSwipeable } from 'react-swipeable'
import { AnimateSharedLayout } from 'framer-motion'
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { InputPanel } from './../components/InputPanel';
import { fastTransition } from './../components/anims';
import classNames from 'classnames/bind';

const cn = classNames.bind(s);
// const db = getFirestore(app)

const { TabPane } = Tabs;


const Home: NextPage = () => {
  const loading = true
  const router = useRouter()
  const { t } = useTranslation('common')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [folded, setFolded] = useState(false)

  const [editingTaskTitle, setEditingTaskTitle] =
    useState(false)
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
	// const [selectedTaskGroup, setSelectedTaskGroup] = useState(0)
  const [taskGroups, setTaskGroups] = useState<
    { id: string; data: any }[]
  >([])
  const [tasks, setTasks] = useState<
    { id: string; data: any }[]
  >([])
  const {
    setTaskGroupIndex,
    taskGroupIndex,
    setUser,
    user,
  } = useUserStore(state => state)

  type session_type = {
    data: Session | null;
    status: "authenticated" | "unauthenticated" | "loading";
  }
  const session = useSession()

  const onLongPress = () => {
    console.log('calls callback after long pressing 300ms');
  };

  const defaultOptions = {
    isPreventDefault: false,
    delay: 300,
  };
  const longPressEvent = useLongPress(onLongPress, defaultOptions);

  const swipeHandlers = useSwipeable({
    // onSwiped: (eventData) => console.log("User Swiped!", eventData),
    onSwipedLeft: (eventData) => {
      setFolded(true)
      // console.log("User onSwipedLeft!", eventData)
    },
    onSwipedDown: (eventData) => {
      console.log("%c ❔: Home:NextPage -> eventData ", "font-size:16px;background-color:#60f867;color:black;", eventData)

      // alert('hack')
      // console.log("User onSwipedRight!", eventData)
    },
    onSwipedRight: (eventData) => {
      setFolded(false)
      // console.log("User onSwipedRight!", eventData)
    },
    delta: 10,                            // min distance(px) before a swipe starts. *See Notes*
    preventDefaultTouchmoveEvent: false,  // call e.preventDefault *See Details*
    trackTouch: true,                     // track touch input
    trackMouse: false,                    // track mouse input
    rotationAngle: 0,                     // set a rotation angle

  });

  useEffect(() => {
    if (
      session.status === 'authenticated' &&
      session.data.token != undefined
    ) {
			//@ts-ignore
      const { name, email, picture } =
        session.data?.token

      initUser(name, email, picture).then(id => {
        setUser({ name, email, picture, id })
        setEmail(email)
        // console.log("%c 🇸🇮: Home:NextPage -> id ", "font-size:16px;background-color:#3b9399;color:white;", id)
        // setUser(id)
        requestNotificationPermission()
        getTaskGroups(id).then(res => {
          setTaskGroups(res)
          setNewTaskGroupTitle(
            `Task group ${res.length + 1}`
          )
          if (res.length > 0) {
						// console.log("%c 👜: Home:NextPage -> res ",
						//   "font-size:16px;background-color:#8dd53b;color:black;",
						//   taskGroupIndex)

            getTasks(
              id,
              res[taskGroupIndex].id
            ).then(res => {
              setTasks(res)
            })
          }
        })
      })
    }
  }, [session])

  useEffect(() => {
    if (taskGroups.length > 0) {
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
      getTasks(
        user.id,
        taskGroups[taskGroupIndex].id
      ).then(res => {
        setTasks(res)
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
      id, data: {
        ...task,
        archived: value
      }
    })
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
        {session.status === 'authenticated' && (
          <UserPanel />
        )}

        {(session.status === 'authenticated') && (
            <motion.ul layout
              {...fastTransition}
              className={` ${s.taskGroups} `}>
            {settingNewTaskGroup ? (
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
            ) : (
              <li
                className={` ${s.control} `}
                  onClick={() => {
                    setSettingNewTaskGroup(true)
                    if (window.innerWidth < 800)
                      setFolded(false)

                  }}
                >
                  <>
                    <p>
                      {t('buttons.add_task_group')}
                    </p>
                    <IoAddCircleOutline />
                </>
              </li>
            )}

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
                  setTaskGroupIndex(index)
                  // setFolded(false)
                }}
                onDoubleClick={() => {
                  setEditingTaskTitle(true)
                  // console.log(taskGroups[taskGroupIndex].id)
                }}
                {...longPressEvent}
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
												// console.log('updated')

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
													// console.log({ index, taskGroupIndex })
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
                              // getTaskGroups(
                              //   user.id
                              // ).then(res => {
                              //   setNewTaskGroupTitle(
                              //     `Task group ${res.length + 1
                              //     }`
                              //   )
                              //   setTaskGroups(res)
                              // })
                            })
                          }}
                        />
                      )}
                    </>
                )}
              </li>
            ))}
            </motion.ul>
        )}
        {session.status === 'authenticated' ? (


            <Tabs defaultActiveKey="1"
              className={` ${s.tasks} `}
              style={{ overflowY: 'scroll', padding: '10px' }}
            // onChange={callback}
            >
              <TabPane tab={t('buttons.active_tasks')} key="1">
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
                              checked: task.data.checked,
                              important: task.data.important
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
                            <IoArchiveOutline
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
                taskGroups={taskGroups}
                setTasks={setTasks}
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
