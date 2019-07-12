import fetch from "node-fetch";
import { RequestInit, Response } from "node-fetch";

function checkStatus(res: Response): Response {
  if (res.status >= 200 && res.status < 303) {
    return res;
  }
  throw {
    body: res.body,
    message: res.statusText,
    response: res,
    status: res.status
  };
}

export default (url: string, options?: RequestInit): Promise<any> => {
  return fetch(url, options)
    .then(checkStatus)
    .then((res: Response) => {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return res.json();
      }
      return res;
    });
};
