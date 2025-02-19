import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
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
