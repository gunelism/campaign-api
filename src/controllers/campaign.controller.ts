import { NextFunction, Request, Response } from "express";
import { CampaignService } from "../services/campaign.service";
import { ApiError } from "../middleware/error.middleware";

export class CampaignController {
  static async listCampaigns(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await CampaignService.listCampaigns(req.query);
      return res.status(200).json(response);
    } catch (error) {
      next(
        new ApiError("Failed to fetch campaigns", 500, {
          originalError: error,
        }),
      );
    }
  }

  static async createCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, landingPageURL, payouts } = req.body;

      if (
        !title ||
        !landingPageURL ||
        !Array.isArray(payouts) ||
        payouts.length === 0
      ) {
        throw new ApiError(
          "Invalid input: Title, Landing Page URL, and at least one payout are required",
          400,
        );
      }

      const campaign = await CampaignService.createCampaign(req.body);

      return res
        .status(201)
        .json({ message: "Campaign created successfully", campaign });
    } catch (error) {
      next(
        error instanceof ApiError
          ? error
          : new ApiError("Failed to create campaign", 500, {
              originalError: error,
            }),
      );
    }
  }

  static async toggleCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const campaign = await CampaignService.toggleCampaign(id);

      return res
        .status(200)
        .json({ message: "Campaign updated successfully", campaign });
    } catch (error) {
      next(
        error instanceof ApiError
          ? error
          : new ApiError("Failed to toggle campaign status", 500, {
              originalError: error,
            }),
      );
    }
  }
}
