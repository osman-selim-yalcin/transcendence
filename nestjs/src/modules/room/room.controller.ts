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
    return this.roomService.getRooms(req.query, req.body);
  }

  @Get('user-rooms')
  getUserRooms(@Req() req: any) {
    return this.roomService.getUserRooms(req.token);
  }

  @Post()
  createRoom(@Req() req: any, @Body() body: roomDto) {
    return this.roomService.createRoom(req.token, body);
  }

  @Delete()
  deleteRoom(@Req() req: any, @Body() body: roomDto) {
    return this.roomService.deleteRoom(req.token, body);
  }

  @Put()
  updateRoom(@Req() req: any, @Body() body: roomDto) {
    return this.roomService.updateRoom(req.token, body);
  }

  @Post('join')
  joinRoom(@Req() req: any, @Body() body: roomDto) {
    return this.roomService.joinRoom(req.token, body);
  }

  @Post('leave')
  leaveRoom(@Req() req: any, @Body() body: roomDto) {
    return this.roomService.leaveRoom(req.token, body);
  }

  @Post('message')
  createMsg(@Req() req: any, @Body() body: messageDto) {
    return this.roomService.createMsg(req.token, body);
  }

  //Command Service
  @Post('invite')
  inviteUser(@Req() req: any, @Body() body: roomCommands) {
    return this.commandService.inviteUser(req.token, body);
  }

  @Post('kick')
  kickUser(@Req() req: any, @Body() body: roomCommands) {
    return this.commandService.kickUser(req.token, body);
  }

  @Post('ban')
  banUser(@Req() req: any, @Body() body: roomCommands) {
    return this.commandService.banUser(req.token, body);
  }

  @Post('mod')
  modUser(@Req() req: any, @Body() body: roomCommands) {
    return this.commandService.modUser(req.token, body);
  }
}
