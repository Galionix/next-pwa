// NEXT_PUBLIC_CLOUDFLARE_IMAGES_ADMIN

import axios, { AxiosResponse } from 'axios';

export interface ImageData {
  id: string;
  filename: string;
  uploaded: string;
  requireSignedURLs: boolean;
  variants: string[];
  v: { [key: string]: string };
}

export const imageEndpoint =
  'https://api.cloudflare.com/client/v4/accounts/b88646f7d4a59213df05e976d2cbaf5d/images/v1';

interface IUploadArgs {
  file: any;
  storeName?: string;
  // onSuccess?: (response: {result:ImageData}) => void;
  onSuccess?: (body: { result: ImageData },xhr: XMLHttpRequest) => void;
  onError?: (error?: any) => void;
  onProgress?:  (event: any)  => void;
  debug?: boolean;
}

export const uploadToCloudFlare = async ({
  storeName,
  file,
  onSuccess,
  onError,
  debug,
  onProgress
}: IUploadArgs) => {

  const {
    data: {
      res: {
        result: { uploadURL },
      },
    },
  } = await axios.get('/api/cloud_get_image');

  const formData = new FormData();

  formData.append('file', file, `${storeName}_${file.name}`);

  // formData.append('requireSignedURLs', 'true');

  const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event:ProgressEvent) => {
        // const percent = Math.floor((event.loaded / event.total) * 100);
        // setProgress(percent);
        // if (percent === 100) {
        //   setTimeout(() => setProgress(0), 1000);
        // }
        onProgress &&
        onProgress(event);
      }
      // ...formData.getHeaders(),
      // Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_KEY}`,
      // 'access-control-allow-origin': '*',
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Credentials': 'true',
      // 'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
      // 'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
  };

  // const uploadResult = await fetch(uploadURL, {
  //   method: 'post',
  //   body: formData,
  // });

  try {
    const uploadResult = await axios
      .post(uploadURL, formData, config);

    console.log('uploadResult: ', uploadResult);

    const result = uploadResult.data;

    if (result.success && onSuccess) {
      onSuccess(result,{} as any);
    }
    if (!result.success && onError) {
      onError(result);
    }
    return result.result.variants[2];
  } catch (e) {
    console.log('error: ', e);
  }
};



export interface UploadedImage {
  uid: string
  lastModified: number
  lastModifiedDate: string
  name: string
  size: number
  type: string
  percent: number
  originFileObj: {
    uid: string
  }
  status: string
  response: Response
  xhr: {}
  thumbUrl: string
}



export interface Response {
  result: Result
  success: boolean
  errors: any[]
  messages: any[]
}

export interface Result {
  id: string
  filename: string
  uploaded: string
  requireSignedURLs: boolean
  variants: string[]
}

export const stripImagesData = (images: any): {
  filename: string
  variants: string[]
}[] => {
  console.log('images: ', images);
  return images.map((image:any) => {
    return {
      filename: image.name,
      variants: image.response.result.variants,
      // image.response.result.variants[2]
    };
  });
};