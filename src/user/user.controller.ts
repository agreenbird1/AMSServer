import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('list')
  findAll(@Body() searchUserDto: any) {
    return this.userService.findAll(searchUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('login')
  login(@Body() body, @Req() req: Request) {
    return this.userService.login(body, req);
  }

  @Post('status')
  changeStatus(@Body() body) {
    return this.userService.changeStatus(body);
  }

  @Post('role')
  changeRole(@Body() body) {
    return this.userService.changeRole(body);
  }

  @Post('check')
  checkRepeatAccount(@Body() body) {
    return this.userService.checkRepeatAccount(body);
  }
}
