import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Order extends Document {

    @Prop({ type: Number, default: 0 })
    public price: number;

    /*
     * Relation IDs
     */

    @Prop({ type: Number })
    public productId: number;

    @Prop({ type: Number })
    public userId: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
