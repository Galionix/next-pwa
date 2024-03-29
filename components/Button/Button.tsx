import { IconType } from 'antd/lib/notification'
import { Tooltip } from 'antd'
import s from './Button.module.scss'
import classNames from 'classnames/bind';
import { TooltipPlacement } from 'antd/lib/tooltip';
const cn = classNames.bind(s);

interface Props {
    type?: IconType
    title?: string
    hint?: string
    disabled?: boolean
    icon?: JSX.Element
    onClick?: Function
    hintPosition?: TooltipPlacement
    className?: string
}

export const Button = ({ type, title, hint, hintPosition, disabled, icon, onClick, className }: Props) => {
    return (<Tooltip title={hint} placement={hintPosition} >

        <div
            className={`${cn({
                button: true,
                warning: type === 'warning',
                error: type === 'error',
                info: type === 'info',
                success: type === 'success',
                disabled,
                icon: !!icon
            })} ${className && className}`}
            onClick={(e) => {
                onClick && onClick(e)
            }}
        // title={title ? title : ''}
        >
            {icon ? icon : null}
            {title !== "" && <span >{title}</span>}
        </div>
    </Tooltip>
    )
}
