// Panel under task Details with dates including start date, archive date and updated date, and elapsed time to archive

// import { format, render, cancel, register } from 'timeago.js';
import { motion } from 'framer-motion';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ru from 'javascript-time-ago/locale/ru';

import s from './styles.module.scss'
import moment from 'moment';

import 'moment/locale/en-gb'; // without this line it didn't work
import 'moment/locale/ru'; // without this line it didn't work
import { useRouter } from 'next/dist/client/router';


TimeAgo.addLocale(ru);
TimeAgo.addLocale(en);

// import timeagoru from 'timeago.js/locales/ru';


// import localization from 'moment/locale/fr';

// moment.updateLocale('fr', localization);

export interface ITaskDates {
  createdAt?: { seconds: number; nanoseconds: number };
  updatedAt?: { seconds: number; nanoseconds: number };
  archivedAt?: { seconds: number; nanoseconds: number };
  timestamp: { seconds: number; nanoseconds: number };
}
export interface TaskDetailsPanelProps {
    taskDates: ITaskDates;
}

export const TaskDetails = ({ taskDates }: TaskDetailsPanelProps) => {

  const router = useRouter();

  moment.locale(router.locale);
  // register(router.locale);
const timeAgo = new TimeAgo(router.locale || '');
  console.log('router: ', router);

  const { createdAt, archivedAt, updatedAt, timestamp } = taskDates;
  const created = createdAt || timestamp;
  const createdDate = new Date(created.seconds * 1000)
  const archivedDate = archivedAt ? new Date(archivedAt.seconds * 1000) : null;
  const updatedDate = updatedAt ? new Date(updatedAt.seconds * 1000) : null;
  // const elapsedTime = archivedDate ? new Date((archivedDate.getTime() - createdDate.getTime()) * 1000) : null;

  const elapsedTime = archivedDate
    ? moment.duration(moment(archivedDate).diff(moment(createdDate))).humanize()
    : null;


  const renderTimeAgo = (date: Date) => {
    const time = timeAgo.format(
      date,
      // 'ru',
      // 'zh_CN',
      // router.locale === 'ru' ? 'ru' : 'en_US'
    );
    return <span className={s.timeAgo}>({time})</span>;
  }

  const renderDate = (date: Date) => {
    const dateString = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    return <span className={s.date}>{dateString}</span>;
  }

  return (
    <motion.div className={s.taskDetails}>
      <div className={s.date}>
        <span>Создано</span>
        {renderDate(createdDate)}
        {renderTimeAgo(createdDate)}
      </div>
      {archivedDate && (
        <div className={s.date}>
          <span>Архивировано</span>
          {renderDate(archivedDate)}
          {renderTimeAgo(archivedDate)}
        </div>
      )}
      {updatedDate && (
        <div className={s.date}>
          <span>Обновлено</span>
          {renderDate(updatedDate)}
          {renderTimeAgo(updatedDate)}
        </div>
      )}
      {elapsedTime && (
        <div className={s.date}>
          <span>Затрачено</span>
          <span>{elapsedTime}</span>
          {/* {renderDate(elapsedTime)}
          {renderTimeAgo(elapsedTime)} */}
        </div>
      )}
    </motion.div>
  );
};