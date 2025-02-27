import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { LoggerService } from 'src/utils';
import { UserRepository } from './user.repository';
import { CreateUserDto, ListUserDto, UpdateUserDto } from './dtos';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(listUserDto: ListUserDto) {
    const cacheKey = `users-list-${listUserDto.page || 1}-${listUserDto.limit || 10}`;
    const cachedUsers = await this.cacheManager.get(cacheKey);

    if (cachedUsers) {
      console.log('Returning cached users');
      return cachedUsers;
    }

    const [users, total] = await this.userRepository.findAll(listUserDto);
    const result = {
      users,
      total,
    };

    await this.cacheManager.set(
      cacheKey,
      result,
      5000, // 5 seconds, not 60 as mentioned in comment
    );

    return {
      users,
      total,
    };
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.warn(`User not found: ${id}`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.find({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingUser) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }
    return this.userRepository.create(createUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async delete(id: string) {
    await this.findById(id);
    return this.userRepository.delete(id);
  }
}
