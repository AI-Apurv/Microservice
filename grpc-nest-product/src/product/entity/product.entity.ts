import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document } from 'mongoose';
import { StockDecreaseLog } from './stock-decrease-log.entity';

@Schema()
export class Product extends Document {
    @Prop()
    name: string;
  
    @Prop()
    description: string;
  
    @Prop()
    stock: number;
  
    @Prop()
    price: number;
  
    // If you have a One-To-Many relationship with StockDecreaseLog
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StockDecreaseLog' }] })
    stockDecreaseLogs: StockDecreaseLog[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
