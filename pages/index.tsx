// import { db, app } from '@/utils/fire';
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import s from '../styles/Home.module.scss'
import { AuthButton } from './../components/AuthButton'
import { useUserStore } from './../utils/store'
import { AiFillDelete } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";

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
  getTaskGroups,
  getTasks,
  notification,
  requestNotificationPermission,
} from '@/utils/apputils'
import { addTask } from './../utils/fire'
import { useRouter } from 'next/dist/client/router'
import useTranslation from 'next-translate/useTranslation'
import { UserPanel } from './../components/UserPanel'
import { NotLogged } from './../components/NotLogged';
import { TaskPanel } from './../components/TaskPanel';
import { deleteTaskGroup } from './../utils/fire';
import { isValidText } from './../utils/apputils';
import { Loader } from './../components/Loader/Loader';

// const db = getFirestore(app)

const Home: NextPage = () => {
  const loading = true
  const router = useRouter()
  const { t } = useTranslation('common')
  const [email, setEmail] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [editingTaskTitle, setEditingTaskTitle] = useState(false)
  const [settingNewTaskGroup, setSettingNewTaskGroup] = useState(false)
  const [newTaskGroupTitle, setNewTaskGroupTitle] = useState(`Task group 1`)
  const [updateTaskGroupTitle, setUpdateTaskGroupTitle] = useState('')
  const [newTaskText, setNewTaskText] = useState('')
  const [settingNewTask, setSettingNewTask] = useState(false)
	// const [selectedTaskGroup, setSelectedTaskGroup] = useState(0)
  const [taskGroups, setTaskGroups] = useState<
    { id: string; data: any }[]
  >([])
  const [tasks, setTasks] = useState<
    { id: string; data: any }[]
  >([])
  const { setTaskGroupIndex, taskGroupIndex, setUser } =
    useUserStore(state => state)
  const session = useSession()

  useEffect(() => {
    if (
      session.status === 'authenticated' &&
      session.data.token != undefined
    ) {
			//@ts-ignore
      const { name, email, picture } =
        session.data?.token
      setUser({ name, email, picture })
      setEmail(email)
      initUser(name, email, picture)
      requestNotificationPermission()
      getTaskGroups(email).then(res => {
        setTaskGroups(res)
        setNewTaskGroupTitle(`Task group ${res.length + 1}`)
        if (res.length > 0)
        {
          // console.log("%c 👜: Home:NextPage -> res ",
          //   "font-size:16px;background-color:#8dd53b;color:black;",
          //   taskGroupIndex)

          getTasks(
            email,
            res[taskGroupIndex].id
          ).then(res => {

            setTasks(res)
          })
        }
      })

    }
  }, [session])

  useEffect(() => {
    if (taskGroups.length > 0)
    {
      getTasks(
        email,
        taskGroups[taskGroupIndex].id
      ).then(res => {

        setTasks(res)
      })
    }
  }, [taskGroupIndex])


  return (
    <>
      <Head>
        <title>Dimas planner</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={s.main}>
        <UserPanel />
        <TaskPanel />

        {session.status === 'authenticated' && <ul className={` ${s.taskGroups} `}>
          {taskGroups.map((group, index) => (
            <li
              key={group.id}
              className={
                taskGroupIndex === index
                  ? s.selected
                  : ''
              }
              onClick={() => {
                setUpdateTaskGroupTitle(group.data.title)
                setTaskGroupIndex(index)
              }}
              onDoubleClick={() => {
                setEditingTaskTitle(true)
                console.log(taskGroups[taskGroupIndex].id)
              }}
            >
              {index === taskGroupIndex && editingTaskTitle ? <input
                autoFocus
                onBlur={() => {
                  if (isValidText(updateTaskGroupTitle)) return
                  f_updateTaskGroupTitle(email, taskGroups[taskGroupIndex].id, updateTaskGroupTitle).then(() => {
                    console.log('updated')

                    getTaskGroups(email).then(res => {
                      setNewTaskGroupTitle(`Task group ${res.length + 1}`)
                      setTaskGroups(res)
                      setEditingTaskTitle(false)
                    })
                  })

                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (isValidText(updateTaskGroupTitle)) return
                    f_updateTaskGroupTitle(email, taskGroups[taskGroupIndex].id, updateTaskGroupTitle).then(() => {
                      console.log('updated')

                      getTaskGroups(email).then(res => {
                        setNewTaskGroupTitle(`Task group ${res.length + 1}`)
                        setTaskGroups(res)
                        setEditingTaskTitle(false)
                      })
                    })

                  }
                }}
                type='text'
                placeholder={t("messages.task_group_title_placeholder")}
                value={updateTaskGroupTitle}
                onChange={e => {
                  setUpdateTaskGroupTitle(e.target.value)
                }}
              />
                : <>
                  <p>{group.data.title}</p>
                  <AiFillDelete
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log({ index, taskGroupIndex })
                      deleteTaskGroup(email, taskGroups[index].id).then(() => {
                        if (index <= taskGroupIndex) {
                          if (taskGroupIndex > 0)
                            setTaskGroupIndex(taskGroupIndex - 1)
                          else setTaskGroupIndex(0)

                        }
                        getTaskGroups(email).then(res => {
                          setNewTaskGroupTitle(`Task group ${res.length + 1}`)
                          setTaskGroups(res)
                        })
                      })
                    }}
                  />
                </>
              }
            </li>
          ))}
          {settingNewTaskGroup ? <input
            autoFocus
            type="text"
            value={newTaskGroupTitle}
            onChange={(e) => setNewTaskGroupTitle(e.target.value)}
            onBlur={(e) => {
              if (isValidText(newTaskGroupTitle))
                newTaskGroup(
                  email,
                  newTaskGroupTitle
                ).then(() => {
                  getTaskGroups(email).then(res => {
                    setTaskGroups(res)
                    setNewTaskGroupTitle(`Task group ${taskGroups.length + 1}`)
                    setSettingNewTaskGroup(false)
                    setTaskGroupIndex(res.length - 1)
                  }
                  )
                })
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (isValidText(newTaskGroupTitle))
                  newTaskGroup(
                    email,
                    newTaskGroupTitle
                  ).then(() => {
                    getTaskGroups(email).then(res => {
                      setTaskGroups(res)
                      setNewTaskGroupTitle(`Task group ${taskGroups.length + 1}`)
                      setSettingNewTaskGroup(false)
                      setTaskGroupIndex(res.length - 1)
                    }
                    )
                  })

              }
            }}
          /> : <li
            className={` ${s.control} `}

            onClick={() => {
              setSettingNewTaskGroup(true)
            }}
          ><>
              <p>{t("buttons.add_task_group")}</p>
              <IoAddCircleOutline />
            </></li>}
        </ul>}
        {session.status === 'authenticated' ? <ul className={` ${s.tasks} `}>
          {!settingNewTaskGroup && tasks.map(task => (
            <li key={task.id}>
              {task.data.text}
            </li>
          ))}
          <li
            className={` ${s.newTask} `}

          >
            <input
              type='text'
              placeholder={t("buttons.new_task")}
              value={newTaskTitle}
              onChange={e => {
                setNewTaskTitle(e.target.value)
              }}
              onBlur={() => {
                if (isValidText(newTaskTitle))
                  addTask(
                    email,
                    taskGroups[taskGroupIndex].id,
                    { text: newTaskTitle }
                  ).then(() => {
                    getTasks(
                      email,
                      taskGroups[taskGroupIndex].id
                    ).then(res => {
                      setTasks(res)
                      setNewTaskTitle('')
                    })
                  })
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (isValidText(newTaskTitle))
                    addTask(
                      email,
                      taskGroups[taskGroupIndex].id,
                      { text: newTaskTitle }
                    ).then(() => {
                      getTasks(
                        email,
                        taskGroups[taskGroupIndex].id
                      ).then(res => {
                        setTasks(res)
                        setNewTaskTitle('')
                      })
                    })
                }
              }}
            />

          </li>
        </ul> : <NotLogged />}
        <Loader loading={session.status === 'loading'} />
      </main>
    </>
  )
}

export default Home
