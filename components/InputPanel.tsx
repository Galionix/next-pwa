import { motion } from 'framer-motion'
import { fastTransition } from './anims'
import s from '../styles/Home.module.scss'

import useTranslation from 'next-translate/useTranslation'
import {
    Dispatch,
    ForwardedRef,
    forwardRef,
    MutableRefObject,
    SetStateAction,
    useState,
} from 'react'
import {
    isValidText,
    getTasks,
    notif,
    getTaskGroups,
} from './../utils/apputils'
import { addTask, newTaskGroup } from './../utils/fire'
import { useUserStore } from 'utils/store'
import {
    IoAlertCircle,
    IoAlertCircleOutline,
    IoAttach,
    IoPlanet,
    IoSend,
} from 'react-icons/io5'
import classNames from 'classnames/bind';


const cn = classNames.bind(s);
type Props = {
    props: {
        taskGroups: { id: string; data: any }[]
        setTasks: Dispatch<
            SetStateAction<
                {
                    id: string
                    data: any
                }[]
            >
        >
        setTaskGroups: Dispatch<SetStateAction<{
            id: string;
            data: any;
        }[]>>
        setNewTaskGroupTitle: Dispatch<SetStateAction<string>>

    }
    ref: ForwardedRef<any>
}

export const InputPanel = (
    props: Props["props"]
) => {

    const {
        taskGroups,
        setTasks,
        setTaskGroups,
        setNewTaskGroupTitle
    } = props


    const {
        setTaskGroupIndex,
        taskGroupIndex,
        setUser,
        user,
    } = useUserStore(state => state)

    const urgencies = [
        'normal',
        'urgent',
        'warning',
    ]
    const [urgency, setUrgency] = useState(0)

    const { t } = useTranslation('common')
    const [newTaskTitle, setNewTaskTitle] =
        useState('')
    const performAddTask = async () => {
        if (isValidText(newTaskTitle)) {
            if (taskGroups.length === 0) {
                await newTaskGroup(user.id, t('messages.my_first_group'))
                await setTaskGroupIndex(0)
                await getTaskGroups(user.id).then(res => {
                    setTaskGroups(res)


                    setNewTaskGroupTitle(
                        `Task group ${res.length + 1}`
                    )
                    addTask(
                        user.id,
                        res[0].id,
                        {
                            text: newTaskTitle,
                            checkable: true,
                            urgency: urgencies[urgency]
                        }
                    ).then(() => {
                        getTasks(
                            user.id,
                            res[0].id
                        ).then(res => {
                            setTasks(res)
                            setNewTaskTitle('')
                        })
                    })
                })
            }
            else {
                addTask(
                    user.id,
                    taskGroups[taskGroupIndex].id,
                    {
                        text: newTaskTitle,
                        checkable: true,
                        urgency: urgencies[urgency]
                    }
                ).then(() => {
                    getTasks(
                        user.id,
                        taskGroups[taskGroupIndex].id
                    ).then(res => {
                        setTasks(res)
                        setNewTaskTitle('')
                    })
                })
            }



        }
    }
    return (
        <>
            <button
                onClick={() => notif({
                    type: 'warning',
                    message: t('messages.not_implemented_yet')

                })}
            >
                <IoPlanet />{' '}
            </button>
            <motion.input
                {...fastTransition}
                autoFocus
                layout
                type='text'
                placeholder={t('buttons.new_task')}
                value={newTaskTitle}
                onChange={e => {
                    setNewTaskTitle(e.target.value)
                }}
                // onBlur={() => {
                //     performAddTask()
                // }}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        performAddTask()
                    }
                }}
            />
            <button
                className={` ${cn(
                    {
                        normal: urgencies[urgency] === 'normal',
                        urgent: urgencies[urgency] === 'urgent',
                        warning: urgencies[urgency] === 'warning',
                    }
                )} `}

                onClick={() => {
                    setUrgency(urgency < urgencies.length - 1 ? urgency + 1 : 0)
                }}
            >
                {urgency === 0 ? (
                    <IoAlertCircleOutline />
                ) : (
                    <IoAlertCircle />
                )}
            </button>

            {newTaskTitle === '' && (
                <button
                    onClick={() => notif({
                        type: 'warning',
                        message: t('messages.not_implemented_yet')

                    })}

                >
                    <IoAttach />{' '}
                </button>
            )}

            {newTaskTitle !== '' && (
                <button onClick={() => performAddTask()}>
                    <IoSend />
                </button>
            )}
        </>
    )
}
