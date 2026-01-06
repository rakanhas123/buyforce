import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { GroupsModule } from './groups/groups.module';
import { Group } from './groups/group.entity';
import { WishlistModule } from './wishlist/wishlist.module';
import { WishlistItem } from './wishlist/wishlist-item.entity';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'rakan1',
      database: process.env.DB_NAME || 'buyforce',
      entities: [User, Group, WishlistItem] ,
      synchronize: false, // Changed to false - we're using existing database schema

    }),
    UsersModule,
    AuthModule,
    ScheduleModule.forRoot(),
    GroupsModule,
    WishlistModule,
  ],
})
export class AppModule {}
