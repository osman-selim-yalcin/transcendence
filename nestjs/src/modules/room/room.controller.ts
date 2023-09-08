import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { roomDto } from 'src/types/room.dto';
import { RoomService } from './room.service';

@Controller('api/room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get()
  getRooms(@Req() req: any) {
    return this.roomService.getRooms(req.token);
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
  joinRoom(@Req() req: any, @Body() body: any) {
    return this.roomService.joinRoom(req.token, body);
  }

  @Post('createMsg')
  createMsg(@Body() body: any) {
    return this.roomService.createMsg(body);
  }
}
