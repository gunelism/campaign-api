import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedingData1736698980627 implements MigrationInterface {
  name = "SeedingData1736698980627";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO campaigns (title, "landingPageURL", "isRunning")
            VALUES 
              ('Summer Sale Campaign', 'https://example.com/summer-sale', false),
              ('Winter Sale Campaign', 'https://example.com/winter-sale', true);
          `);

    await queryRunner.query(`
            INSERT INTO payouts (country, amount, "campaignId")
            VALUES 
              ('US', 5.00, (SELECT id FROM campaigns WHERE title = 'Summer Sale Campaign' LIMIT 1)),
              ('UK', 4.50, (SELECT id FROM campaigns WHERE title = 'Summer Sale Campaign' LIMIT 1)),
              ('IN', 3.00, (SELECT id FROM campaigns WHERE title = 'Winter Sale Campaign' LIMIT 1));
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM payouts;`);
    await queryRunner.query(`DELETE FROM campaigns;`);
  }
}
