import express from "express";
import {router as index} from "./api/index";
import {router as user} from "./api/user";
import {router as rider} from "./api/rider";
import bodyParser from "body-parser";

export const app = express();


app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/", index);
app.use("/user", user);
app.use("/rider", rider);