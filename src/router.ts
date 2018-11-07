import { Router, Request, Response } from "express";
import { request_logic } from "./utility";
import { login } from "./sso";
import { getSheet, getSheetJson } from "./sheet";
import { append, update } from "./mongo";
import { search } from "./facebook";

const router: Router = Router();

router.get("/", (_, res: Response) => {
  console.log("GET");
  return res.status(200).send("server is working");
});

router.get("/search", async (req: Request, res: Response) => {
  return request_logic(res, search(req.query.q));
});

router.get("/sheet", async (req: Request, res: Response) => {
  let { sheet, sheetId, sheetid, page, json } = req.query;
  let args = [sheet || sheetId || sheetid, page];
  return request_logic(res, json ? getSheetJson(...args) : getSheet(...args));
});

router.post("/login", async (req: Request, res: Response) => {
  let { username, password } = req.body;
  return request_logic(res, login(username, password));
});

router.post("/append", async (req: Request, res: Response) => {
  console.log(req.body);
  return request_logic(res, append(req.body));
});

router.post("/update", async (req: Request, res: Response) => {
  let {values} = req.body;
  return request_logic(res, update(values instanceof Array ? values : JSON.parse(values)));
});

export default router;
