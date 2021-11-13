
import { Popover, Tag } from 'antd';
import s from '../../styles/Home.module.scss'
import classNames from 'classnames/bind';
import useTranslation from 'next-translate/useTranslation'
import {
    Dispatch,
    SetStateAction,
    useState,
} from 'react'
import { IoAlertCircle, IoAlertCircleOutline } from 'react-icons/io5';

const { CheckableTag } = Tag;

const cn = classNames.bind(s);

export const urgencies = [
    'normal',
    'urgent',
    'warning',
]

export const UrgencyPopover = ({
    urgency,
    setUrgency,
    hideOnSelect }:
    {
        urgency: number,
        setUrgency: Dispatch<SetStateAction<number>>,
        hideOnSelect?: boolean
    }) => {

    const { t } = useTranslation('common')

    const [popoverOpen, setPopoverOpen] = useState(false)

    return (
        <Popover
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
                        hideOnSelect && setPopoverOpen(false)
                    }}>
                    {t("urgency.warning")}
                </CheckableTag>
                <CheckableTag
                    checked={urgency === 1}
                    className={`${s.urgency} ${s.urgent}`} onClick={() => {
                        setUrgency(1)
                        hideOnSelect && setPopoverOpen(false)
                    }}>
                    {t("urgency.urgent")}
                </CheckableTag>
                <CheckableTag
                    checked={urgency === 0}
                    className={`${s.urgency} ${s.normal}`} onClick={() => {
                        setUrgency(0)
                        hideOnSelect && setPopoverOpen(false)
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
            >
                {!popoverOpen ? (
                    <IoAlertCircleOutline />
                ) : (
                    <IoAlertCircle />
                )}
            </button>
        </Popover>
    )
}
