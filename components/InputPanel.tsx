
import { motion } from 'framer-motion';
import { fastTransition } from './anims';
import useTranslation from 'next-translate/useTranslation';
import { Dispatch, SetStateAction, useState } from 'react';
import { isValidText, getTasks } from './../utils/apputils';
import { addTask } from './../utils/fire';
import { useUserStore } from 'utils/store';
import { IoAttach, IoPlanet, IoSend } from "react-icons/io5";

export const InputPanel = ({ taskGroups, setTasks }:
    {
        taskGroups: { id: string; data: any }[],
        setTasks: Dispatch<SetStateAction<{
            id: string;
            data: any;
        }[]>>
    }) => {
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
                }
            ).then(() => {
                getTasks(
                    user.id,
                    taskGroups[taskGroupIndex]
                        .id
                ).then(res => {
                    setTasks(res)
                    setNewTaskTitle('')
                })
            })
    }
    return (<>
        <button
        // onClick={() => ()}
        ><IoPlanet /> </button>
        <motion.input
            {...fastTransition}
            layout
            type='text'
            placeholder={t('buttons.new_task')}
            value={newTaskTitle}
            onChange={e => {
                setNewTaskTitle(e.target.value)
            }}
            onBlur={() => {
                performAddTask()
            }}
            onKeyDown={e => {
                if (e.key === 'Enter') {
                    performAddTask()
                }
            }}
        />
        {newTaskTitle === '' && <button
        // onClick={() => ()}
        ><IoAttach /> </button>}


        {newTaskTitle !== '' && <button
            onClick={() => performAddTask()}
        ><IoSend /></button>}


    </>
    )
}
