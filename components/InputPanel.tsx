import { motion } from 'framer-motion'
import { fastTransition } from './anims'
import s from '../styles/Home.module.scss'
import { UrgencyPopover } from "./taskActions/UrgencyPopover"
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
    refreshTaskData,
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
import { useLongPress } from 'react-use';
import { Popover, Tag } from 'antd'

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
        setNewTaskGroupTitle: Dispatch<SetStateAction<string>>

    }
    ref: ForwardedRef<any>
}

export const InputPanel = (
    props: Props["props"]
) => {

    const [popoverOpen, setPopoverOpen] = useState(false)
    const {
        setNewTaskGroupTitle
    } = props

    const onLongPress = () => {
        console.log('calls callback after long pressing 300ms');
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
        setGroupsLoading
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
                        refreshTaskData({
                            userid: user.id,
                            taskGroupIndex,
                            setTaskGroups,
                            setTasks,
                            setGroupsLoading
                        })
                        setNewTaskTitle('')
                        // getTasks(
                        //     user.id,
                        //     res[0].id
                        // ).then(res => {
                        //     setTasks(res)
                        //     setNewTaskTitle('')
                        // })
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
                    refreshTaskData({
                        userid: user.id,
                        taskGroupIndex,
                        setTaskGroups,
                        setTasks,
                        setGroupsLoading
                    })
                    setNewTaskTitle('')
                    // getTasks(
                    //     user.id,
                    //     taskGroups[taskGroupIndex].id
                    // ).then(res => {
                    //     setTasks(res)
                    //     setNewTaskTitle('')
                    // })
                })
            }



        }
    }
    return (
        <>
            {/* <button
                onClick={() => notif({
                    type: 'warning',
                    message: t('messages.not_implemented_yet')

                })}
            >
                <IoPlanet />{' '}
            </button> */}
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
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        performAddTask()
                    }
                }}
            />
            <UrgencyPopover
                urgency={urgency} setUrgency={setUrgency}
            />
            {/* <Popover
                title={t("urgency.title")}
                trigger="click"
                visible={popoverOpen}
                overlayClassName={s.urgencyPickerOverlay}
                onVisibleChange={(state) => setPopoverOpen(state)}
                content={<>
                    <CheckableTag
                        checked={urgency === 2}
                        className={`${s.urgency} ${s.warning}`} onClick={() => {
                            setUrgency(2)
                            // setPopoverOpen(false)
                        }}>
                        {t("urgency.warning")}
                    </CheckableTag>
                    <CheckableTag
                        checked={urgency === 1}
                        className={`${s.urgency} ${s.urgent}`} onClick={() => {
                            setUrgency(1)
                            // setPopoverOpen(false)
                        }}>
                        {t("urgency.urgent")}
                    </CheckableTag>
                    <CheckableTag
                        checked={urgency === 0}
                        className={`${s.urgency} ${s.normal}`} onClick={() => {
                            setUrgency(0)
                            // setPopoverOpen(false)
                        }}>
                        {t("urgency.normal")}
                    </CheckableTag>
                </>}

            >
                <button

                    onClick={() => setPopoverOpen(true)}
                    className={` ${cn(
                        {
                            normal: urgencies[urgency] === 'normal',
                            urgent: urgencies[urgency] === 'urgent',
                            warning: urgencies[urgency] === 'warning',
                        }
                    )} `}
                // onClick={() => {
                //     setUrgency(urgency < urgencies.length - 1 ? urgency + 1 : 0)
                // }}
                // {...longPressEvent}
                >
                    {urgency === 0 ? (
                        <IoAlertCircleOutline />
                    ) : (
                        <IoAlertCircle />
                    )}
                </button>
            </Popover> */}

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
