import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ListUserDto } from './dtos';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(listDto?: ListUserDto): Promise<[User[], number]> {
    const { limit, offset, snapshotTimestamp } = paginationDto;

    // If no snapshot timestamp is provided, use the current timestamp
    const timestamp = snapshotTimestamp || new Date().toISOString();

    const [users, total] = await this.userRepository.findAndCount({
      where: { createdAt: LessThanOrEqual(timestamp) },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      data: users,
      meta: {
        total,
        limit,
        offset,
        snapshotTimestamp: timestamp, // Ensure all pages use the same snapshot
      },
    };
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async find(user: FindOneOptions<User>): Promise<User | null> {
    return this.userRepo.findOne(user);
  }

  async create(user: Partial<User>): Promise<User> {
    return this.userRepo.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    await this.userRepo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }
}
