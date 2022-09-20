import s from '../../styles/Home.module.scss';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fastTransition } from './../anims';

export const AddTasks = () => {
  const { t } = useTranslation('common');

  return (
    <div className={` ${s.notasks} `}>
      {
        <motion.div layout {...fastTransition}>
          <Image
            draggable='false'
            // "fill", "fixed", "intrinsic", "responsive"
            // layout="intrinsic"
            // objectFit="fill"
            // height={kitty.height}
            // width={kitty.width}
            // src={kitty.url}
            height={300}
            width={300}
            src={`http://placekitten.com/300/300`}
          />
        </motion.div>
      }
      <motion.p layout {...fastTransition}>
        {t('messages.add_tasks')}
      </motion.p>
    </div>
  );
};
