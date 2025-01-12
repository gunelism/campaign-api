import { CampaignService } from "./campaign.service";
import redisClient from "../utils/redisClient";

const mockQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn(),
};

jest.mock("../data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      createQueryBuilder: jest.fn().mockImplementation(() => mockQueryBuilder),
      create: jest.fn((data) => data),
      save: jest.fn(),
      findOne: jest.fn(),
    }),
  },
}));

jest.mock("../utils/redisClient", () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  get: jest.fn().mockResolvedValue(null),
  setEx: jest.fn(),
  flushDb: jest.fn(),
  on: jest.fn(),
}));

describe.skip("CampaignService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await redisClient.disconnect();
  });

  describe("listCampaigns", () => {
    it("should fetch from database", async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        [{ id: "1", title: "DB Campaign" }],
        1,
      ]);

      const result = await CampaignService.listCampaigns({
        page: "1",
        limit: "10",
      });

      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
      expect(result).toEqual({
        data: [{ id: "1", title: "DB Campaign" }],
        total: 1,
        page: 1,
        limit: 10,
      });
    });
  });

  describe("createCampaign", () => {
    it("should create a new campaign", async () => {
      const mockCampaign = { id: "1", title: "New Campaign" };
      const repo = require("../data-source").AppDataSource.getRepository();

      repo.create.mockReturnValueOnce(mockCampaign);
      repo.save.mockResolvedValueOnce(mockCampaign);

      const result = await CampaignService.createCampaign(mockCampaign);

      expect(repo.create).toHaveBeenCalledWith(mockCampaign);
      expect(repo.save).toHaveBeenCalledWith(mockCampaign);
      expect(result).toEqual(mockCampaign);
    });
  });

  describe("toggleCampaign", () => {
    it("should toggle campaign status", async () => {
      const mockCampaign = { id: "1", isRunning: false };
      const repo = require("../data-source").AppDataSource.getRepository();

      repo.findOne.mockResolvedValueOnce(mockCampaign);
      repo.save.mockResolvedValueOnce({ ...mockCampaign, isRunning: true });

      const result = await CampaignService.toggleCampaign("1");

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(repo.save).toHaveBeenCalledWith({
        ...mockCampaign,
        isRunning: true,
      });
      expect(result).toEqual({ ...mockCampaign, isRunning: true });
    });
  });
});
