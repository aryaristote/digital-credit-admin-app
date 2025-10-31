import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../../common/enums/user-role.enum';
import { Session } from '../../sessions/entities/session.entity';
import { SavingsAccount } from '../../savings/entities/savings-account.entity';
import { CreditRequest } from '../../credit/entities/credit-request.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  creditScore: number;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToOne(() => SavingsAccount, (savingsAccount) => savingsAccount.user)
  savingsAccount: SavingsAccount;

  @OneToMany(() => CreditRequest, (creditRequest) => creditRequest.user)
  creditRequests: CreditRequest[];
}
