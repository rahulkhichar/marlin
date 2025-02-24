import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { LoggingInterceptor } from 'src/utils';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { RateLimiterGuard } from '../rate-limiting/rate-limiter.guard';

@UseInterceptors(LoggingInterceptor)
@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RateLimiterGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
