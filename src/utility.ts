import { Response } from "express";

export function response_success(res: Response, args: Array<any> | Number | String | Object) {
  if (args instanceof Array && typeof args[0] == "number" && args.length == 2)
    return res.status(args[0]).send(args[1]);
  return res.status(200).send(args);
}

export function response_error(
  res: Response,
  args: Array<any> | Number | String | Error
) {
  if (args instanceof Error) return res.status(400).send(args.message);
  if (args instanceof String) return res.status(400).send(args);
  if (args instanceof Number) return res.sendStatus(+args);
  if (args instanceof Array && typeof args[0] == "number" && args.length == 2)
    return res.status(args[0]).send(args[1]);
  return res.status(400).send(args);
}

export function request_logic(res: Response, logic: Promise<any>) {
  return logic
    .then(result => {
      return response_success(res, result);
    })
    .catch(args => {
      return response_error(res, args);
    });
}

export function to_promise(itm: any): Promise<any> {
  return new Promise(res => res(itm));
}
