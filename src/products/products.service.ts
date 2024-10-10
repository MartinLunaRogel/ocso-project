import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product)
    private ProuctRepository: Repository<Product>)
    {}
  private products: CreateProductDto[] = [
    {
      productId: uuid(),
      productName: "Sabritas normal",
      price: 29,
      countSeal: 3,
      provider: uuid()
    },
    {
      productId: uuid(),
      productName: "Coca cola 600ml",
      price: 40,
      countSeal: 2,
      provider: uuid()
    },
    {
      productId: uuid(),
      productName: "Agua ciel 1l",
      price: 15,
      countSeal: 2,
      provider: uuid()
    }
  ]

  create(createProductDto: CreateProductDto) {
    const product = this.ProuctRepository.save(createProductDto)
    return product;
  }

  findAll() {
    return this.ProuctRepository.find();
  }

  findOne(id: string) {
    const product = this.ProuctRepository.findBy({
      productId : id,
    })
    if (!product) throw new NotFoundException()
    return product;
  }

  findByProvider(id: string){
    const productsFound = this.products.filter((product) => product.provider === id)
    if (productsFound.length === 0) throw new NotFoundException;
    return productsFound;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const productToUpdate = await this.ProuctRepository.preload({
      productId: id,
      ... updateProductDto,
    })
    if(!productToUpdate) throw new NotFoundException()
      this.ProuctRepository.save(productToUpdate);
    return productToUpdate;
  }

  remove(id: string) {
    this.findOne(id)
    this.ProuctRepository.delete({
      productId: id,
    })
    return{
      message: `Objeto con id ${id} eliminado`
    }
  }
}
