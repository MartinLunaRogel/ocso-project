import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product)
    private ProuctRepository: Repository<Product>)
    {}

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
    return this.ProuctRepository.findBy({
      provider: {
        providerID: id
      }
    })
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
