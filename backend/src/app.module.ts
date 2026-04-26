import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PagesModule } from './pages/pages.module';
import { DeitiesModule } from './deities/deities.module';
import { GalleryModule } from './gallery/gallery.module';
import { EventsModule } from './events/events.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { TimingsModule } from './timings/timings.module';
import { DonationsModule } from './donations/donations.module';
import { UploadModule } from './upload/upload.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL ?? '60') * 1000,
      limit: parseInt(process.env.THROTTLE_LIMIT ?? '100'),
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    PagesModule,
    DeitiesModule,
    GalleryModule,
    EventsModule,
    AnnouncementsModule,
    TimingsModule,
    DonationsModule,
    UploadModule,
    VideosModule,
  ],
})
export class AppModule {}
