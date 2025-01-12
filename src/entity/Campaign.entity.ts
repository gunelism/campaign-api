import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Payout } from "./Payout.entity";

@Entity({ name: "campaigns" })
export class Campaign {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ unique: true })
  title: string;

  @Column()
  landingPageURL: string;

  @Column({ default: false })
  isRunning: boolean;

  @OneToMany(() => Payout, (payout) => payout.campaign, { cascade: true })
  payouts: Payout[];
}
