import { NextFunction, Request, Response } from "express";
import * as cache from "memory-cache";
import { AppDataSource } from "../data-source";
import { Campaign } from "../entity/Campaign.entity";
import { ApiError } from "../middleware/error.middleware";

const campaignRepository = AppDataSource.getRepository(Campaign);
export class CampaignController {
  static async listCampaigns(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        title,
        landingPageURL,
        isRunning,
        page = 1,
        limit = 10,
      } = req.query;

      const query = campaignRepository
        .createQueryBuilder("campaign")
        .leftJoinAndSelect("campaign.payouts", "payout");

      // Apply filters based on query parameters
      if (title) {
        query.andWhere("LOWER(campaign.title) LIKE :title", {
          title: `%${(title as string).toLowerCase()}%`,
        });
      }

      if (landingPageURL) {
        query.andWhere("LOWER(campaign.landingPageURL) LIKE :landingPageURL", {
          landingPageURL: `%${(landingPageURL as string).toLowerCase()}%`,
        });
      }

      if (isRunning !== undefined) {
        query.andWhere("campaign.isRunning = :isRunning", {
          isRunning: isRunning === "true",
        });
      }
      query.skip((+page - 1) * +limit).take(+limit);

      const [results, totalCount] = await query.getManyAndCount();

      return res.status(200).json({
        data: results,
        total: totalCount,
        page: +page,
        limit: +limit,
      });
      //new cahe verions ---
      //       const cacheKey = `campaigns_${JSON.stringify(req.query)}`;
      // const cachedData = cache.get(cacheKey);

      // if (cachedData) {
      //   console.log("Serving from cache");
      //   return res.status(200).json(cachedData);
      // }

      // const campaigns = await query.getManyAndCount();
      // cache.put(cacheKey, { data: campaigns, total }, 10000);

      // return res.status(200).json({
      //   data: campaigns,
      //   total,
      // });
      /// -----
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

      const campaign = campaignRepository.create({
        title,
        landingPageURL,
        payouts,
      });
      await campaignRepository.save(campaign);

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
      const campaign = await campaignRepository.findOne({
        where: { id },
      });
      if (!campaign) {
        throw new ApiError("Campaign not found", 404);
      }

      campaign.isRunning = !campaign.isRunning;
      await campaignRepository.save(campaign);

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
