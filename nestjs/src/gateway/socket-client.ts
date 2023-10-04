import { Injectable, OnModuleInit } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';

@Injectable()
export class SocketClient implements OnModuleInit {
  public socketClient: Socket;

  constructor() {
    this.socketClient = io('http://localhost:3000', {
      auth: {
        sessionID: process.env.adminID,
      },
    });
  }

  onModuleInit() {
    this.socketClient.on('connect', () => {
      console.log('connected');
    });
  }

  async tmp() {
    console.log('here');
  }
}
