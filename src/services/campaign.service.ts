import { Repository } from "typeorm";
import { Campaign } from "../entity/Campaign.entity";
import redisClient from "../utils/redisClient";
import { AppDataSource } from "../data-source";

const campaignRepository: Repository<Campaign> =
  AppDataSource.getRepository(Campaign);

export class CampaignService {
  static async listCampaigns(filters: any) {
    const { title, landingPageURL, isRunning, page = 1, limit = 10 } = filters;

    const cacheKey = `campaigns_${JSON.stringify(filters)}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const query = campaignRepository
      .createQueryBuilder("campaign")
      .leftJoinAndSelect("campaign.payouts", "payout");

    if (title) {
      query.andWhere("LOWER(campaign.title) LIKE :title", {
        title: `%${title.toLowerCase()}%`,
      });
    }

    if (landingPageURL) {
      query.andWhere("LOWER(campaign.landingPageURL) LIKE :landingPageURL", {
        landingPageURL: `%${landingPageURL.toLowerCase()}%`,
      });
    }

    if (isRunning !== undefined) {
      query.andWhere("campaign.isRunning = :isRunning", {
        isRunning: isRunning === "true",
      });
    }

    query.skip((+page - 1) * +limit).take(+limit);

    const [results, totalCount] = await query.getManyAndCount();

    const response = {
      data: results,
      total: totalCount,
      page: +page,
      limit: +limit,
    };

    await redisClient.setEx(cacheKey, 10, JSON.stringify(response));

    return response;
  }

  static async createCampaign(data: any) {
    const { title, landingPageURL, payouts } = data;

    const campaign = campaignRepository.create({
      title,
      landingPageURL,
      payouts,
    });

    const savedCampaign = await campaignRepository.save(campaign);

    await redisClient.flushDb();

    return savedCampaign;
  }

  static async toggleCampaign(id: string) {
    const campaign = await campaignRepository.findOne({
      where: { id },
    });

    if (!campaign) {
      throw new Error("Campaign not found");
    }

    campaign.isRunning = !campaign.isRunning;

    const updatedCampaign = await campaignRepository.save(campaign);

    await redisClient.flushDb();

    return updatedCampaign;
  }
}
