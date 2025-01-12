import "reflect-metadata";
import { AppDataSource } from "./data-source";
import * as express from "express";
import * as dotenv from "dotenv";
import * as cors from "cors";
import { Request, Response } from "express";
import { campaignRouter } from "./routes/campaign.routes";
import { errorHandler } from "./middleware/error.middleware";
dotenv.config();

const app = express();
app.use(express.json());
const { PORT = 3000 } = process.env;

app.use(cors());
app.use("/api", campaignRouter);

app.get("*", (req: Request, res: Response) => {
  res.status(500).json({ message: "Hi. go to main page" });
});
app.use(errorHandler);

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
