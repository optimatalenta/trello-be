import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./middleware/index.mjs";
import router from "./routes/index.mjs";

const PORT = process.env.APP_PORT || 3000;

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use(router);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
