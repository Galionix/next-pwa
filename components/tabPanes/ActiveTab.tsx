import { isValidText } from '@/utils/apputils';
import { Badge, Modal } from 'antd';
import classNames from 'classnames';
import { AddTasks } from 'components/AddTasks/AddTasks';
import { fastTransition } from 'components/anims';
import { UrgencyPopover } from 'components/taskActions/UrgencyPopover';
import { TaskDetails } from 'components/TaskStats';
import { motion } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import { GoNote } from 'react-icons/go';
import { IoArchiveOutline, IoDocumentTextSharp } from 'react-icons/io5';
import { Itask } from 'types/fireTypes';
import s from '../../styles/Home.module.scss';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { Dispatch, SetStateAction, useState } from 'react';
import { Image } from 'antd';
import { Images } from 'components/InputPanel/components/Images';
import { UploadFile } from 'antd/lib/upload/interface';

// const handlePreview = async (file: UploadFile) => {
//   if (!file.url && !file.preview) {
//     file.preview = await getBase64(file.originFileObj as RcFile);
//   }

//   setPreviewImage(file.url || (file.preview as string));
//   setPreviewOpen(true);
//   setPreviewTitle(
//     file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
//   );
// };

export const ImagesRenderer = ({ task, fileList, setFileList }: {
  task: Itask
  fileList: UploadFile[]
  setFileList: Dispatch<SetStateAction<UploadFile<any>[]>>
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  const [previewTitle, setPreviewTitle] = useState('');
  const handleCancel = () => setPreviewOpen(false);

  // if (task.data.images && task.data.images.length > 0) {
    return (
      <div className={s.taskImages}>
        {/* <Modal
        visible={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt='example' style={{ width: '100%' }} src={previewImage} />
      </Modal> */}
        <Image.PreviewGroup>
          {/* <Image width={200} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
    <Image
      width={200}
      src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
    /> */}
          {task.data.images && task.data.images.map((image, index) => {
            const thumb = image.variants.find(src => src.includes('preview'));
            const publicImage = image.variants.find(src =>
              src.includes('public'),
            );

            return (
              <Image
                key={index}
                src={publicImage}
                alt={image.filename}
                className={s.taskImage}
                placeholder={<Image alt={image.filename} preview={false} src={thumb} />}
              />
              // <img
              //   onClick={() => {
              //     setPreviewImage(`${image.variants.find(src => src.includes('public'))}`);
              //     setPreviewOpen(true);
              //     setPreviewTitle(image.filename);
              //   }}
              // />
            );
          })}
        </Image.PreviewGroup>
        <Images visible={true} fileList={fileList} setFileList={setFileList} />
      </div>
    );
  // }
  // return null;
};

const cn = classNames.bind(s);
interface IActiveProps {
  settingNewTaskGroup: boolean;
  tasks: Itask[];
  switchTextArea: (task: any) => void;
  onArchive: (id: string, value: boolean) => void;
  noteIndexEditing: string;
  textAreaRef2: React.MutableRefObject<null>;
  textareaValue: string;
  setTextareaValue: (value: string) => void;
  editingTask: Itask | undefined;
  longPressEvent: {
    readonly onMouseDown: (e: any) => void;
    readonly onTouchStart: (e: any) => void;
    readonly onMouseUp: () => void;
    readonly onMouseLeave: () => void;
    readonly onTouchEnd: () => void;
  };
  settingNewTask: boolean;
  editingTaskIndex: string;
  editingTaskText: string;
  setSettingNewTask: React.Dispatch<React.SetStateAction<boolean>>;
  updateTask: ({ id, data }: { id: string; data: any }) => void;
  setEditingTaskText: React.Dispatch<React.SetStateAction<string>>;
  setEditingTaskIndex: React.Dispatch<React.SetStateAction<string>>;
  paneIndex: number;
  touchableDevice: boolean;
  getUrgencyIndex: (urgency: string) => number;
  fileList: UploadFile[]
  setFileList: Dispatch<SetStateAction<UploadFile<any>[]>>
}

export const ActiveTab = ({
  settingNewTaskGroup,
  tasks,
  switchTextArea,
  onArchive,
  noteIndexEditing,
  textAreaRef2,
  textareaValue,
  setTextareaValue,
  editingTask,
  longPressEvent,
  settingNewTask,
  editingTaskIndex,
  editingTaskText,
  setSettingNewTask,
  updateTask,
  setEditingTaskText,
  setEditingTaskIndex,
  paneIndex,
  touchableDevice,
  getUrgencyIndex,
  fileList,
  setFileList
}: IActiveProps) => {
  const { t } = useTranslation('common');

  return (
    <motion.ul layout {...fastTransition} className={` ${s.tasks} `}>
      {!settingNewTaskGroup &&
        tasks.map(task => {

          if (!task.data.archived)
            return (
              <>
                <li
                  ref={textAreaRef2}
                  // className={cn({
                  //   // checked: task.data.checked,
                  //   normal: task.data.urgency === 'normal',
                  //   urgent: task.data.urgency === 'urgent',
                  //   warning: task.data.urgency === 'warning',
                  //   editing: noteIndexEditing === task.id,
                  // })}
                  className={`${task.data.urgency === 'normal' ? s.normal : ''}
                    ${task.data.urgency === 'urgent' ? s.urgent : ''}
                    ${task.data.urgency === 'warning' ? s.warning : ''}
                    ${noteIndexEditing === task.id ? s.editing : ''}
                    `}
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
                  {settingNewTask && editingTaskIndex === task.id ? (
                    <input
                      type='text'
                      autoFocus
                      onBlur={() => {
                        if (!isValidText(editingTaskText)) return;
                        setSettingNewTask(false);
                        updateTask({
                          id: task.id,
                          data: {
                            ...task.data,
                            text: editingTaskText,
                          },
                        });
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (!isValidText(editingTaskText)) return;
                          setSettingNewTask(false);
                          updateTask({
                            id: task.id,
                            data: {
                              ...task.data,
                              text: editingTaskText,
                            },
                          });
                        }
                      }}
                      placeholder=''
                      value={editingTaskText}
                      onChange={e => {
                        e.stopPropagation();
                        setEditingTaskText(e.target.value);
                      }}
                    />
                  ) : (
                    <>
                      <p
                        key={task.id + 'p'}
                        onDoubleClick={e => {
                          e.stopPropagation();
                          setEditingTaskIndex(task.id);
                          setEditingTaskText(task.data.text);
                          setSettingNewTask(true);
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          switchTextArea(task);

                          // updateTask({
                          //   id: task.id,
                          //   data: {
                          //     ...task.data,
                          //     checked:
                          //       !task.data.checked,
                          //   },
                          // })
                        }}
                      >
                        {task.data.text}
                      </p>

                      {(paneIndex !== 0 || !touchableDevice) && (
                        <div className={s.controlButtons}>
                          <UrgencyPopover
                            urgency={getUrgencyIndex(task.data.urgency)}
                            setUrgency={urgencyIndex =>
                              updateTask({
                                id: task.id,
                                data: {
                                  ...task.data,
                                  // @ts-ignore
                                  urgency: urgencies[urgencyIndex],
                                },
                              })
                            }
                            hideOnSelect
                          />
                          {
                            <button
                              key={task.id + 'b'}
                              onClick={e => {
                                e.stopPropagation();
                                onArchive(task.id, true);
                              }}
                            >
                              <IoArchiveOutline size={25} />
                            </button>
                          }
                          {task.data?.description && <button
                            key={task.id + 'bt'}
                          >
                            <IoDocumentTextSharp size={25} />
                          </button>}
                          { task.data.images?.length && <button>
                              <HiOutlinePhotograph  size={25} />
                          </button>}
                        </div>
                      )}
                    </>
                  )}

                  {noteIndexEditing === task.id && (
                    <>
                      <ImagesRenderer
                      task={task}
                      fileList={fileList}
                      setFileList={setFileList} />

                      <motion.textarea
                        key={task.id + 'ta'}
                        // ref={textAreaRef2}
                        placeholder={t('messages.task_description')}
                        name=''
                        id=''
                        cols={30}
                        rows={10}
                        value={textareaValue}
                        onChange={e => {
                          setTextareaValue(e.target.value);
                        }}
                      ></motion.textarea>
                      <TaskDetails taskDates={{ ...editingTask!.data }} />
                    </>
                  )}
                </li>
              </>
            );
        })}
      {tasks.length === 0 && <AddTasks />}
    </motion.ul>
  );
};
