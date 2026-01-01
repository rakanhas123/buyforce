import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'buyforce',
      entities: [User, Group, WishlistItem] ,
      synchronize: true,

    }),
    UsersModule,
    AuthModule,
    ScheduleModule.forRoot(),
    GroupsModule,
    WishlistModule,
  ],
})
export class AppModule {}
