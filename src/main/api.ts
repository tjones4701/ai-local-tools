import express, { Response } from 'express';
import cors from 'cors';

export function startServer() {
  let p = new Promise<void>(async (resolve) => {
    const server = express();

    // Configure CORS to reject requests from localhost
    server.use(
      cors({
        origin: (origin, callback) => {
          console.log(origin);
          if (origin && origin.includes('localhost')) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        }
      })
    );

    server.get('/models/*', async (req, res: Response) => {
      const url: string = req.url;
      let model = url.substring('/models/'.length);
      const parts = model.split('/resolve/');
      if (parts.length == 1) {
        const newParts = model.split('/');
        const fileName = newParts.pop();
        model = `${newParts.join('/')}/resolve/main/${fileName}`;
      }

      const newUrl = `https://huggingface.co/${model}`;

      const response = await fetch(newUrl);
      const contentType = response.headers.get('content-type');
      if (model.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json');
        res.send(await response.json());
      } else {
        res.setHeader('Content-Type', contentType || 'application/octet-stream');
        res.send(await response.blob());
      }
    });

    // Start the server on a specific port
    server.listen(3000, () => {
      resolve();
    });
  });
  return p;
}
