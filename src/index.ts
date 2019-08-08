import { getType } from 'mime';
import { streamS3Object } from './S3Client';
import { isSupportedInputMime, createPipe } from './pipes';
import { getTransformer } from './Sharp';

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
  const inputStream = streamS3Object(key, bucket, cb);
  const inputMime = getType(key);

  console.log(`Checking mime`);
  inputStream.once('readable', async () => {
    if (!isSupportedInputMime(inputMime)) {
      console.error(`Unsupported image ${key}`);
      return cb(null, { statusCode: 500 });
    }
    console.log(`Mime supported. Creating transform pipeline`);
    const { transformer, mime } = createPipe(
      event.queryStringParameters || {},
      inputMime,
      getTransformer()
    );
    console.log(`Pipe line created`);
    try {
      const image = await inputStream.pipe(transformer).toBuffer();
      console.log(`Image transformed to buffer`);
      const response = {
        statusCode: 200,
        headers: {
          'Content-Type': mime,
          'Cache-Control': 'public, max-age=31536000'
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
  });
};
