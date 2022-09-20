import { uploadToCloudFlare } from '@/utils/cloudflare';
import { useUserStore } from '@/utils/store';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';
import s from './images.module.scss';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

interface IImagesProps {
  visible: boolean;
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
}
export const Images = ({ visible, fileList, setFileList }: IImagesProps) => {

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const { user } = useUserStore();

  if (!visible) {
    return null;
  }

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    );
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <div className={s.uploadButton}>
      <PlusOutlined />
      <div>Upload</div>
    </div>
  );
  return (
    <div className={s.imagesWrapper}>
      <Upload
        multiple
        accept='.png,.jpg,.jpeg'
        // action={file => {
        //   return uploadToCloudFlare({
        //     file,
        //     storeName: `planner_${user.id}`,
        //   });
        // }}
        listType='picture'
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        customRequest={props =>
          uploadToCloudFlare({ ...props, storeName: `planner_${user.id}` })
        }
        // beforeUpload={file => {
        //   setFileList([...fileList, file]);

        //   return false;
        // }}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt='example' style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};
