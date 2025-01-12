import { MigrationInterface, QueryRunner } from "typeorm";

export class Campaigns1734449297326 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            --Create Table Campaigns
              CREATE TABLE "campaigns" (
              "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
              "title" character varying NOT NULL,
              "landingPageURL" character varying NOT NULL,
              "isRunning" boolean NOT NULL DEFAULT false,
              "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
              "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
              CONSTRAINT "PK_5e65d646f1b217b2361e9fbd57e" PRIMARY KEY ("id")
              )
      `);

    await queryRunner.query(`
            -- Create Payouts Table
            CREATE TABLE "payouts" (
              "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
              "country" character varying NOT NULL,
              "amount" decimal NOT NULL,
              "campaignId" uuid NOT NULL,
              "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
              "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
              CONSTRAINT "PK_45e2ff54efbbd9bfc8d79e9b43f" PRIMARY KEY ("id"),
              CONSTRAINT "FK_campaign_payout" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE
            );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payouts"`);
    await queryRunner.query(`DROP TABLE "campaigns"`);
  }
}