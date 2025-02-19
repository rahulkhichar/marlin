import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { LoggerService } from 'src/utils';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  async findAll() {
    return this.userRepository.findAll();
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
