import * as AWS from 'aws-sdk';
import { getType } from 'mime';
import { createPipe, isSupportedInputMime } from './pipes';
import { getTransformer } from './Sharp';
import { getS3ClientConfig } from './Utils';

export const handle = (
  event: any,
  context: any,
  cb: (err: any | null, response?: any) => void
) => {
  console.log(`Inside handle`);
  if (event.pathParameters == null || event.pathParameters.proxy == null) {
    return cb(null, { statusCode: 400 });
  }
  console.log(`Checking params`);
  const key = event.pathParameters.proxy as string;
  const bucket = process.env.BUCKET!;
  const s3 = new AWS.S3(getS3ClientConfig());
  const params = {
    Bucket: bucket,
    Key: key
  };
  s3.headObject(params, function (err, data) {
    if (err) {
      console.error(`Exception while transforming ${key}`);
      console.error(err);
      cb(err, { statusCode: 500 });
    }
    let inputMime = data.ContentType || null;
    if (!isSupportedInputMime(inputMime)) {
      inputMime = getType(key);
      if (!isSupportedInputMime(inputMime)) {
        console.error(`Unsupported image ${key} for mime ${inputMime}`);
        return cb(null, { statusCode: 500 });
      }
    }
    console.log(`Mime supported. Creating transform pipeline`);
    const { transformer, mime } = createPipe(
      event.queryStringParameters || {},
      inputMime,
      getTransformer()
    );
    console.log(`Pipe line created`);
    const inputStream = s3.getObject(params).createReadStream();
    inputStream.once('readable', async () => {
      try {
        const image = await inputStream.pipe(transformer).toBuffer();
        console.log(`Image transformed to buffer`);
        const response = {
          statusCode: 200,
          headers: {
            'Content-Type': mime,
            'Cache-Control': 'public, max-age=31536000',
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
          },
          body: image.toString('base64'),
          isBase64Encoded: true
        };
        console.log(`Sending response`);
        cb(null, response);
        console.log(`Response sent`);
      } catch (e) {
        console.error(`Exception while transforming ${key}`);
        console.error(e);
        cb(null, { statusCode: 500 });
      }
    })
  });


};
