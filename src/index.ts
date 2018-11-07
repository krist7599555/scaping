"use strict";
import express, { Application } from "express";
import bodyParser from "body-parser";
import router from "./router";
import { server } from "../CONFIG";


const app: Application = express();

app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(bodyParser.json({limit: '10mb'}));

app.use("/", router);
app.listen(server.port, () => {
  console.log("SERVER START localhost:" + server.port);
});

export default app;