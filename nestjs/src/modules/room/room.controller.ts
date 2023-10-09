import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { roomCommands, roomDto } from 'src/types/room.dto';
import { RoomService } from './room.service';
import { messageDto } from 'src/types/message.dto';
import { CommandsService } from './commands.service';

@Controller('room')
export class RoomController {
  constructor(
    private roomService: RoomService,
    private commandService: CommandsService,
  ) {}

  @Get()
  getRooms(@Req() req: any) {
    return this.roomService.getRooms(req.query);
  }

  @Get('user-rooms')
  getUserRooms(@Req() req: any) {
    return this.roomService.getUserRooms(req.user);
  }

  @Post()
  createRoom(@Req() req: any, @Body() body: roomDto) {
    return this.roomService.createRoom(req.user, body);
  }

  @Delete()
  deleteRoom(@Req() req: any, @Body() body: roomDto) {
    return this.roomService.deleteRoom(req.user, req.room);
  }

  //interceptor
  @Put()
  updateRoom(@Req() req: any, @Body() body: roomDto) {
    return this.roomService.updateRoom(req.user, req.room, body);
  }

  @Post('join')
  joinRoom(@Req() req: any, @Body() body: roomDto) {
    return this.roomService.joinRoom(req.user, req.room, body);
  }

  @Post('leave')
  leaveRoom(@Req() req: any, @Body() body: roomDto) {
    return this.roomService.leaveRoom(req.user, req.room);
  }
  //interceptor

  @Post('message')
  createMsg(@Req() req: any, @Body() body: messageDto) {
    return this.roomService.createMsg(req.user, req.room, body);
  }

  //Command Service
  @Post('command/invite')
  inviteUser(@Req() req: any, @Body() body: roomCommands) {
    return this.commandService.inviteUser(req.friendUser, req.room);
  }

  @Post('command/kick')
  kickUser(@Req() req: any, @Body() body: roomCommands) {
    return this.commandService.kickUser(req.user, req.room, req.friendUser);
  }

  @Post('command/ban')
  banUser(@Req() req: any, @Body() body: roomCommands) {
    return this.commandService.banUser(req.user, req.room, req.friendUser);
  }

  @Post('command/mod')
  modUser(@Req() req: any, @Body() body: roomCommands) {
    return this.commandService.modUser(req.user, req.room, req.friendUser);
  }
}
