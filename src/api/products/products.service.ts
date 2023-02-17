import { CategoriesRepository } from './../categories/categories.repository';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsRepository)
    private productsRepository: ProductsRepository,
    @InjectRepository(CategoriesRepository)
    private categoriesRepository: CategoriesRepository,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const category = await this.categoriesRepository.findOne({
      id: createProductDto.category_id,
    });

    const product = await this.productsRepository.save({
      ...createProductDto,
      category,
    });

    return this.getProductDetail(product.id);
  }

  async getProductDetail(id: number) {
    const query = this.productsRepository.createQueryBuilder('product');

    await query
      .update()
      .set({ viewCount: () => 'view_count + 1' })
      .where('id =:id', { id })
      .execute();

    const result = await query
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.productImageUrl', 'productImageUrl')
      // .select([
      //   'product.title',
      //   'product.description',
      //   'product.prevPrice',
      //   'product.sellPrice',
      //   'product.minAmount',
      //   'product.status',
      //   'product.viewCount',
      //   'category.name',
      //   'productImageUrl.storedFileName',
      // ])
      .where('product.id = :id', { id })
      .getOne();

    return result;
  }

  async getProductList() {
    return await this.productsRepository.find({
      select: ['title', 'description'],
      relations: ['category_id'],
    });
  }

  async updateProduct(updateProductDto: UpdateProductDto, id: number) {
    const board = await this.productsRepository
      .createQueryBuilder('product')
      .update(Product)
      .set({ ...updateProductDto })
      .where('id = :id', { id })
      .execute();
    return board;
  }

  async deleteProduct(id: number) {
    return await this.productsRepository.softDelete(id);
  }

  async restoreProduct(id: number) {
    return await this.productsRepository.restore(id);
  }
}
