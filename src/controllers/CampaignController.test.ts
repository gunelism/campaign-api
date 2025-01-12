import { Request, Response, NextFunction } from "express";
import { CampaignController } from "./campaign.controller";
import { CampaignService } from "../services/campaign.service";

jest.mock("../services/campaign.service");
jest.mock("../utils/redisClient", () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  get: jest.fn().mockResolvedValue(null),
  setEx: jest.fn(),
  flushDb: jest.fn(),
  on: jest.fn(),
}));

describe("CampaignController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      query: {
        page: "1",
        limit: "10",
        title: "test",
      },
      body: {
        title: "New Campaign",
        landingPageURL: "https://example.com",
        payouts: [{ country: "US", amount: 5 }],
      },
      params: { id: "1" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    const redisClient = require("../utils/redisClient");
    await redisClient.disconnect();
  });

  describe("listCampaigns", () => {
    it("should return campaigns from the service", async () => {
      const serviceResponse = {
        data: [{ id: "1", title: "test campaign" }],
        total: 1,
        page: 1,
        limit: 10,
      };

      (CampaignService.listCampaigns as jest.Mock).mockResolvedValue(
        serviceResponse,
      );

      await CampaignController.listCampaigns(
        req as Request,
        res as Response,
        next,
      );

      expect(CampaignService.listCampaigns).toHaveBeenCalledWith(req.query);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(serviceResponse);
    });
  });

  describe("createCampaign", () => {
    it("should create a new campaign", async () => {
      const serviceResponse = {
        id: "1",
        title: "New Campaign",
        landingPageURL: "https://example.com",
        payouts: [{ country: "US", amount: 5 }],
      };

      (CampaignService.createCampaign as jest.Mock).mockResolvedValue(
        serviceResponse,
      );

      await CampaignController.createCampaign(
        req as Request,
        res as Response,
        next,
      );

      expect(CampaignService.createCampaign).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Campaign created successfully",
        campaign: serviceResponse,
      });
    });

    it("should call next with an error if the service throws", async () => {
      const error = new Error("Service Error");

      (CampaignService.createCampaign as jest.Mock).mockRejectedValue(error);

      await CampaignController.createCampaign(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to create campaign",
          statusCode: 500,
        }),
      );
    });
  });

  describe("toggleCampaign", () => {
    it("should toggle the campaign status", async () => {
      const serviceResponse = {
        id: "1",
        isRunning: true,
      };

      (CampaignService.toggleCampaign as jest.Mock).mockResolvedValue(
        serviceResponse,
      );

      await CampaignController.toggleCampaign(
        req as Request,
        res as Response,
        next,
      );

      expect(CampaignService.toggleCampaign).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Campaign updated successfully",
        campaign: serviceResponse,
      });
    });
  });
});
