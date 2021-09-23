import { motion } from 'framer-motion'
import { fastTransition } from './anims'
import s from '../styles/Home.module.scss'

import useTranslation from 'next-translate/useTranslation'
import {
    Dispatch,
    SetStateAction,
    useState,
} from 'react'
import {
    isValidText,
    getTasks,
    warn,
} from './../utils/apputils'
import { addTask } from './../utils/fire'
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
export const InputPanel = ({
    taskGroups,
    setTasks,
}: {
    taskGroups: { id: string; data: any }[]
    setTasks: Dispatch<
        SetStateAction<
            {
                id: string
                data: any
            }[]
        >
    >
}) => {
    const urgencies = [
        'normal',
        'urgent',
        'warning',
    ]
    const [urgency, setUrgency] = useState(0)
    const {
        taskGroupIndex,

        user,
    } = useUserStore(state => state)
    const { t } = useTranslation('common')
    const [newTaskTitle, setNewTaskTitle] =
        useState('')
    const performAddTask = () => {
        if (isValidText(newTaskTitle))
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
    return (
        <>
            <button
                onClick={() => warn(t('messages.not_implemented_yet'))}
            >
                <IoPlanet />{' '}
            </button>
            <motion.input
                {...fastTransition}
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
                    onClick={() => warn(t('messages.not_implemented_yet'))}

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
