import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { RoomService } from 'src/modules/room/room.service';

@Injectable()
export class RoomInterceptor implements NestInterceptor {
  constructor(private roomService: RoomService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('intercepted', context.getArgs());
    return next.handle().pipe(
      map((data) => {
        console.log(data);
        // let content = '';
        // if (context.url === '/api/room') {
        //   content = 'room updated';
        // } else if (context.url === '/api/room/join') {
        //   content = 'room joined';
        // } else if (context.url === '/api/room/leave') {
        //   content = 'room left';
        // }
        //room.id or admin
        // this.roomService.specialMsg(data.room, {
        //   owner: 'admin',
        //   content: content,
        //   roomID: data.id,
        //   createdAt: '',
        // });
        // 	url: '/api/room',
        // method: 'PUT',
        return data;
      }),
    );
  }
}
