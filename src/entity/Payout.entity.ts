import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Campaign } from "./Campaign.entity";

@Entity({ name: "payouts" })
export class Payout {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  country: string;

  @Column("decimal")
  amount: number;

  @ManyToOne(() => Campaign, (campaign) => campaign.payouts)
  campaign: Campaign;
}
