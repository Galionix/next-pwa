// https://api.cloudflare.com/client/v4/accounts/023e105f4ecef8ad9ca31a8372d0c353/images/v2/direct_upload

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import Cors from 'cors';
import initMiddleware from '../../utils/init-middleware';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: true,
    credentials: true,
    preflightContinue: true,
    // Only allow requests with GET, POST and OPTIONS
    methods: ['POST', 'GET'],
  }),
);

type Data = {
  res?: AxiosResponse['data'];
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const form = new FormData();

  form.append('requireSignedURLs', 'true');
  const config = {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_KEY}`,
      // 'access-control-allow-origin': '*',
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Credentials': 'true',
      // 'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
      // 'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    },
  };
  console.log('config: ', config);

  try {
    // Run cors
    await cors(req, res);

    // Rest of the API logic

    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_IMAGES_USER}/images/v2/direct_upload`,
      form,
      config,
    );

      console.log('response: ', response);

    res.status(200).json({ res: response.data });
  } catch (e) {
    console.log('error: ', e);
    res.status(500).json({ error: e });
  }
}
