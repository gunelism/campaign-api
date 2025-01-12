import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToCampaignTitle1736515695641
  implements MigrationInterface
{
  name = "AddIndexToCampaignTitle1736515695641";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_c8554d2f247117d7d6f7256e7a" ON "campaigns" ("title") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c8554d2f247117d7d6f7256e7a"`,
    );
  }
}
