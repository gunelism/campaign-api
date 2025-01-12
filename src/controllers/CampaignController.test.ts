import { Request, Response, NextFunction } from "express";
import { CampaignController } from "./campaign.controller";

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
    }),
  },
}));
jest.mock("redis", () => ({
  createClient: jest.fn().mockReturnValue({
    connect: jest.fn(),
    get: jest.fn(),
    setEx: jest.fn(),
    flushDb: jest.fn(),
    on: jest.fn(),
  }),
}));

describe("CampaignController.listCampaigns", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    process.env.REDIS_HOST = "localhost";
    process.env.REDIS_PORT = "6379";

    req = {
      query: {
        page: "1",
        limit: "10",
        title: "test",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should fetch campaigns from database and return results", async () => {
    mockQueryBuilder.getManyAndCount.mockResolvedValue([
      [{ id: "1", title: "test campaign" }],
      1,
    ]);

    await CampaignController.listCampaigns(
      req as Request,
      res as Response,
      next,
    );

    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      "campaign.payouts",
      "payout",
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      "LOWER(campaign.title) LIKE :title",
      {
        title: "%test%",
      },
    );
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [{ id: "1", title: "test campaign" }],
      total: 1,
      page: 1,
      limit: 10,
    });
  });

  it("should handle errors and call next with an ApiError", async () => {
    mockQueryBuilder.getManyAndCount.mockRejectedValue(
      new Error("Database error"),
    );

    await CampaignController.listCampaigns(
      req as Request,
      res as Response,
      next,
    );

    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Failed to fetch campaigns",
        statusCode: 500,
      }),
    );
  });
});
