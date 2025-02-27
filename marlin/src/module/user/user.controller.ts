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
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LoggingInterceptor } from 'src/utils';
import { UserService } from './user.service';
import { CreateUserDto, ListUserDto, UpdateUserDto } from './dtos';
import { RateLimiterGuard } from '../rate-limiting/rate-limiter.guard';

@UseInterceptors(LoggingInterceptor)
@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RateLimiterGuard)
  async findAll(@Query() listUserDto: ListUserDto) {
    const paginatedResult: any = await this.userService.findAll(listUserDto);

    return {
      data: paginatedResult.users,
      meta: {
        total: paginatedResult.total,
        page: listUserDto.page || 1,
        limit: listUserDto.limit || 10,
        totalPages: Math.ceil(
          paginatedResult.total / (listUserDto.limit || 10),
        ),
      },
    };
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
