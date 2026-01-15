import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ProductsModule } from './products/products.module';
import { HomeModule } from './home/home.module';

import { User } from './users/user.entity';
import { Group } from './groups/group.entity';
import { WishlistItem } from './wishlist/wishlist-item.entity';
import { Product } from './products/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',

      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'buyforce',
      entities: [User, Group, WishlistItem, Product], // ✅ רק entities
      synchronize: true,
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
    ProductsModule,
    HomeModule, // ✅ פה זה צריך להיות
  ],
})
export class AppModule {}
