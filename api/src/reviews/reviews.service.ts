import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async create(userId: number, createReviewDto: CreateReviewDto) {
    const { productId, rating, comment } = createReviewDto;

    // Məhsulun mövcudluğunu yoxlayırıq
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Məhsul tapılmadı');
    }

    // İstifadəçi artıq rəy yazmışdırmı?
    const existingReview = await this.reviewRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (existingReview) {
      throw new BadRequestException('Siz artıq bu məhsula rəy yazmısınız');
    }

    const review = this.reviewRepository.create({
      user: { id: userId } as any,
      product: { id: productId } as any,
      rating,
      comment,
      isApproved: false, // Default olaraq təsdiqlənməmiş
    });

    return this.reviewRepository.save(review);
  }

  async findByProduct(productId: number, includeUnapproved = false) {
    const query = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.productId = :productId', { productId });

    if (!includeUnapproved) {
      query.andWhere('review.isApproved = :isApproved', { isApproved: true });
    }

    return query.orderBy('review.createdAt', 'DESC').getMany();
  }

  async approve(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Rəy tapılmadı');
    }
    review.isApproved = true;
    return this.reviewRepository.save(review);
  }

  async getAverageRating(productId: number): Promise<number> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .where('review.productId = :productId', { productId })
      .andWhere('review.isApproved = :isApproved', { isApproved: true })
      .getRawOne();

    return result?.average ? parseFloat(result.average) : 0;
  }

  async remove(id: number, userId: number, isAdmin = false) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException('Rəy tapılmadı');
    }

    // Admin deyilsə və rəy ona aid deyilsə
    if (!isAdmin && review.user.id !== userId) {
      throw new BadRequestException('Bu rəyi silmək üçün icazəniz yoxdur');
    }

    return this.reviewRepository.remove(review);
  }
}
