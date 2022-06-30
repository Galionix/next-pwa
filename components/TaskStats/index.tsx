// Panel under task Details with dates including start date, archive date and updated date, and elapsed time to archive

import { format, render, cancel, register } from 'timeago.js';
import s from './styles.module.scss'

export interface ITaskDates {
  startDate: { seconds: number; nanoseconds: number };
  archiveDate: { seconds: number; nanoseconds: number };
  updatedDate: { seconds: number; nanoseconds: number };
}
export interface TaskDetailsPanelProps {
    taskDates: ITaskDates;
}

export const TaskDetails = ({ taskDates }: TaskDetailsPanelProps) => {
  const { startDate, archiveDate, updatedDate } = taskDates;
  console.log('taskDates: ', taskDates);
    // const elapsedTime = archiveDate.getTime() - startDate.getTime();
    // const elapsedTimeFormatted = format(elapsedTime, 'en_US');
    // const updatedDateFormatted = format(updatedDate, 'en_US');
    // const archiveDateFormatted = format(archiveDate, 'en_US');
    // const startDateFormatted = format(startDate, 'en_US');
    // const renderTimeAgo = (date: Date) => {
    //     const timeAgo = render(date, 'en_US');
    //     return timeAgo;
    // }

    // const elapsedTimeString = `${elapsedTimeFormatted}`;


  return (
    <div className={s.panel}>
      <div className='task-Details__dates'>
        <div className='task-Details__date'>
          <span className='task-Details__date-label'>Started:</span>
          <span className='task-Details__date-value'>
            {format(new Date(startDate.seconds), 'en_US')}
          </span>
        </div>
        <div className='task-Details__date'>
          <span className='task-Details__date-label'>Archived:</span>
          {/* <span className='task-Details__date-value'>{archiveDate}</span> */}
        </div>
        <div className='task-Details__date'>
          <span className='task-Details__date-label'>Updated:</span>
          {/* <span className='task-Details__date-value'>{updatedDate}</span> */}
        </div>
      </div>
      <div className='task-Details__elapsed-time'>
        <span className='task-Details__elapsed-time-label'>Elapsed time:</span>
        <span className='task-Details__elapsed-time-value'>
          {'elapsedTimeString'}
        </span>
      </div>
    </div>
  );
};