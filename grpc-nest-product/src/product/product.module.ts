import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './entity/product.entity';
import { StockDecreaseLog, StockDecreaseLogSchema } from './entity/stock-decrease-log.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([
    {name: 'Product', schema:ProductSchema},
    {name: 'StockDecreaseLog', schema:StockDecreaseLogSchema}
  ])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}