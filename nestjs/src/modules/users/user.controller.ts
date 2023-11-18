import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from 'src/modules/users/user.service';
import { userDto } from 'src/types/user.dto';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { twoFactorDto } from 'src/types/2fa.dto';

@Controller('user')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  allUsers(@Req() req: any) {
    return this.usersService.allUsers(req.query, req.user);
  }

  @Get('friends')
  getFriends(@Req() req: any) {
    return this.usersService.getFriends(req.user);
  }

  @Post()
  addFriend(@Req() req: any) {
    return this.usersService.addFriend(req.user, req.friendUser);
  }

  @Delete()
  deleteFriend(@Req() req: any) {
    return this.usersService.deleteFriend(req.user, req.friendUser);
  }

  @Put()
  updateUser(@Req() req: any, @Body() body: userDto) {
    return this.usersService.updateUser(req.user, body);
  }

  @Post('block')
  blockUser(@Req() req: any) {
    return this.usersService.blockUser(req.user, req.friendUser);
  }

  @Get('info')
  getUserInfo(@Req() req: any) {
    return this.usersService.getUserInfo(req.user);
  }

  @Post('2fa')
  async createQR(@Req() req: any) {
    return this.usersService.createQR(req.user);
  }

  @Post('2fa/verify')
  async verify2fa(@Req() req: any, @Body() body: twoFactorDto) {
    return this.usersService.verify2fa(req.user, body);
  }

  @Post('2fa/disable')
  async disable2fa(@Req() req: any) {
    return this.usersService.disable2fa(req.user);
  }

  @Post('file42')
  async file42(@Req() req: any) {
    if (req.user.oldAvatar)
      await this.cloudinaryService.deleteFile(req.user.oldAvatar);
    return this.usersService.file42(req.user);
  }

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(null, false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1000000, // must be less than 1 MB
      },
    }),
  )
  async uploadFile(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('file not found', 400);
    }

    const cloudinaryResponse = await this.cloudinaryService.uploadFile(file);
    if (req.user.oldAvatar)
      await this.cloudinaryService.deleteFile(req.user.oldAvatar);
    return this.usersService.updateAvatar(req.user, cloudinaryResponse);
  }
}
