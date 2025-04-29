import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { MailModule } from './mail/mail.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ResourcesModule } from './resources/resources.module';
import { UsersModule } from './users/users.module';
import { SpacesModule } from './spaces/spaces.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ClientsModule, MailModule, ReservationsModule, ResourcesModule, UsersModule, SpacesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
