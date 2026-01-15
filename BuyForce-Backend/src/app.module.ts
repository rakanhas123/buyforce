import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'buyforce',
      entities: [User, Group, WishlistItem, Product], // ✅ רק entities
      synchronize: true,
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
