import { Tabs } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import classNames from 'classnames';
import { AddTasks } from 'components/AddTasks/AddTasks';
import { fastTransition } from 'components/anims';
import { ImagesRenderer } from 'components/tabPanes/ActiveTab';
import { TaskDetails } from 'components/TaskStats';
import { motion } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import { Dispatch, SetStateAction } from 'react';
import { GoNote } from 'react-icons/go';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { RiInboxUnarchiveLine } from 'react-icons/ri';
import { Itask } from 'types/fireTypes';
import s from '../../styles/Home.module.scss';

const cn = classNames.bind(s);

interface IArchivedProps {
  settingNewTaskGroup: boolean;
  tasks: Itask[];
  switchTextArea: (task: any) => void;
  onArchive: (id: string, value: boolean) => void;
  noteIndexEditing: string;
  textAreaRef: React.MutableRefObject<null>;
  textareaValue: string;
  setTextareaValue: (value: string) => void;
  editingTask: Itask | undefined;
  fileList: UploadFile[];
  setFileList: Dispatch<SetStateAction<UploadFile<any>[]>>;
  longPressEvent: {
    readonly onMouseDown: (e: any) => void;
    readonly onTouchStart: (e: any) => void;
    readonly onMouseUp: () => void;
    readonly onMouseLeave: () => void;
    readonly onTouchEnd: () => void;
  };
}

export const ArchivedTab = ({
  settingNewTaskGroup,
  tasks,
  switchTextArea,
  onArchive,
  noteIndexEditing,
  textAreaRef,
  textareaValue,
  setTextareaValue,
  editingTask,
  fileList,
  setFileList,
  longPressEvent,
}: IArchivedProps) => {
  const { t } = useTranslation('common');

  const renderArchivedTask = (task: Itask): JSX.Element | undefined => {

    const liClassname = `${task.data.urgency === 'normal' ? s.normal : ''}
                    ${task.data.urgency === 'urgent' ? s.urgent : ''}
                    ${task.data.urgency === 'warning' ? s.warning : ''}
                    ${noteIndexEditing === task.id ? s.editing : ''}
                    `;

    if (task.data.archived)
      return (
        <div key={task.id}>
          <li
            ref={textAreaRef}
            className={liClassname}
            key={task.id}
            {...longPressEvent}
            onMouseDown={(e: any) => {
              e.taskId = task.id;
              longPressEvent.onMouseDown(e);
            }}
            onTouchStart={(e: any) => {
              e.taskId = task.id;
              longPressEvent.onTouchStart(e);
            }}
          >
            <p
              onClick={e => {
                e.stopPropagation();
                switchTextArea(task);
              }}
            >
              {task.data.text}
            </p>

            <div className={s.controlButtons}>

              {task.data?.description && (
                <button key={task.id + 'bt'}>
                  <IoDocumentTextSharp size={25} />
                </button>
              )}

              {task.data.images?.length !== 0 ? (
                <button>
                  <HiOutlinePhotograph size={25} />
                </button>
              ) : null}

              <button
                onClick={e => {
                  e.stopPropagation();
                  onArchive(task.id, false);
                }}
              >
                <RiInboxUnarchiveLine size={25} />
              </button>

            </div>

            {noteIndexEditing === task.id && (
              <>
                <ImagesRenderer
                  task={task}
                  fileList={fileList}
                  setFileList={setFileList}
                />
                <motion.textarea
                  ref={textAreaRef}
                  placeholder={t('messages.task_description')}
                  name=''
                  id=''
                  cols={30}
                  rows={10}
                  key={task.id + 'ta2'}
                  value={textareaValue}
                  onChange={e => {
                    setTextareaValue(e.target.value);
                  }}
                ></motion.textarea>
                <TaskDetails taskDates={{ ...editingTask!.data }} />
              </>
            )}
          </li>
        </div>
      );
  };

  return (
    <motion.ul
      layout
      {...fastTransition}
      key='2'
      className={` ${s.tasks}  ${s.archived_tasks} `}
    >
      {!settingNewTaskGroup && tasks.map(renderArchivedTask)}
      {tasks.length === 0 && <AddTasks />}
    </motion.ul>
  );
};
