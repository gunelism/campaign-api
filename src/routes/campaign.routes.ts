import * as express from "express";
import { CampaignController } from "../controllers/campaign.controller";

const Router = express.Router();

Router.get("/campaigns", CampaignController.listCampaigns);
Router.post("/campaigns", CampaignController.createCampaign);

Router.put("/campaigns/:id", CampaignController.toggleCampaign);

export { Router as campaignRouter };
