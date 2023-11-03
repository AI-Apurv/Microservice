import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entity/product.entity';
import { CreateProductRequestDto, DecreaseStockRequestDto, FindOneRequestDto } from './product.dto';
import { CreateProductResponse, DecreaseStockResponse, FindOneData, FindOneResponse } from './product.pb';
import { StockDecreaseLog } from './entity/stock-decrease-log.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    @InjectModel(StockDecreaseLog.name)
    private readonly decreaseLogModel: Model<StockDecreaseLog>
  ) { }


  public async findOne({ id }: FindOneRequestDto): Promise<FindOneResponse> {
    const product: FindOneData = await this.productModel.findOne({ _id: id });
    if (!product) {
      return { data: null, error: ['Product not found'], status: HttpStatus.NOT_FOUND };
    }
    return { data: product, error: null, status: HttpStatus.OK };
  }



  public async createProduct(payload: CreateProductRequestDto): Promise<CreateProductResponse> {
    console.log('inside the create Product ------------------->>>>>>>>>>')
    console.log(payload.description, payload.name, payload.price, payload.stock);
    const product = new this.productModel({
      price: payload.price,
      description: payload.description,
      name: payload.name,
      stock: payload.stock
    });
    console.log("inside the product++++++++++++++++++++++++", product)
    await product.save();
    return { id: product.id, error: null, status: HttpStatus.OK };
  }



  public async decreaseStock({ id, orderId }: DecreaseStockRequestDto): Promise<DecreaseStockResponse> {
    const product: Product = await this.productModel.findOne({ _id: id, stock: { $gt: 0 } });
    if (!product) {
      return { error: ['Product not found or stock too low'], status: HttpStatus.NOT_FOUND };
    }
    const isAlreadyDecreased: number = await this.decreaseLogModel.countDocuments({ orderId });
    if (isAlreadyDecreased) {
      return { error: ['Stock already decreased'], status: HttpStatus.CONFLICT };
    }
    product.stock--;
    await product.save();
    const decreaseLog = new this.decreaseLogModel({
      product: product._id,
      orderId
    })
    await decreaseLog.save();
    return { error: null, status: HttpStatus.OK };
  }
}