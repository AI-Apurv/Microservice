import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Order } from './order.entity';
import { FindOneResponse, DecreaseStockResponse, ProductServiceClient, PRODUCT_SERVICE_NAME } from './proto/product.pb';
import { CreateOrderRequest, CreateOrderResponse } from './proto/order.pb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrderService implements OnModuleInit {
  // constructor(
  //   private readonly client: ClientGrpc,
  // ){}
  private productSvc: ProductServiceClient;

  @Inject(PRODUCT_SERVICE_NAME)
  private readonly client: ClientGrpc;

  @InjectModel(Order.name)
  private readonly orderModel: Model<Order>;


  public onModuleInit(): void {
    this.productSvc = this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  public async createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    const product: FindOneResponse = await firstValueFrom(this.productSvc.findOne({ id: data.productId }));

    if (product.status >= HttpStatus.NOT_FOUND) {
      return { id: null, error: ['Product not found'], status: product.status };
    } else if (product.data.stock < data.quantity) {
      return { id: null, error: ['Stock too less'], status: HttpStatus.CONFLICT };
    }

    const order = new this.orderModel({
      price: product.data.price,
      productId: product.data.id,
      userId: data.userId,
    });

    try {
      await order.save();
    }
    catch (error) {
      return { id: null, error: ['Error saving order'], status: HttpStatus.INTERNAL_SERVER_ERROR }
    }


    const decreasedStockData: DecreaseStockResponse = await firstValueFrom(
      this.productSvc.decreaseStock({ id: order.id }),
    );

    if (decreasedStockData.status === HttpStatus.CONFLICT) {
      // deleting order if decreaseStock fails
      await this.orderModel.findByIdAndRemove(order._id);

      return { id: null, error: decreasedStockData.error, status: HttpStatus.CONFLICT };
    }

    return { id: order.id, error: null, status: HttpStatus.OK };
  }
}