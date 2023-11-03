import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from './product.entity'; // Make sure to import the Product entity

@Schema()
export class StockDecreaseLog extends Document {
  @Prop()
  orderId: number;

  // Many-To-One relationship with the Product entity
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  product: Product;
}

export const StockDecreaseLogSchema = SchemaFactory.createForClass(StockDecreaseLog);