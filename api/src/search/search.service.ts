import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly index = 'products';

  constructor(private readonly elasticsearchService: ElasticsearchService) { }

  async onModuleInit() {
    const indexExists = await this.elasticsearchService.indices.exists({
      index: this.index,
    });

    if (!indexExists) {
      await this.elasticsearchService.indices.create({
        index: this.index,
        mappings: {
          properties: {
            id: { type: 'integer' },
            name: { type: 'text', analyzer: 'standard' },
            description: { type: 'text', analyzer: 'standard' },
            price: { type: 'float' },
            category: { type: 'keyword' },
            tags: { type: 'keyword' },
            createdAt: { type: 'date' },
          },
        },
      });
      this.logger.log(`Created index: ${this.index}`);
    }
  }

  async indexProduct(product: Product) {
    try {
      return await this.elasticsearchService.index({
        index: this.index,
        id: product.id.toString(),
        document: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          category: product.category?.name || 'Uncategorized',
          tags: product.tags,
          createdAt: product.createdAt,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to index product ${product.id}`, error.stack);
      // Don't throw - allow DB save to proceed even if search indexing fails temporarily
    }
  }

  async removeProduct(productId: number) {
    try {
      await this.elasticsearchService.delete({
        index: this.index,
        id: productId.toString(),
      });
    } catch (error) {
      this.logger.error(`Failed to delete product ${productId} from index`, error.stack);
    }
  }

  async search(text: string) {
    const response = await this.elasticsearchService.search({
      index: this.index,
      query: {
        multi_match: {
          query: text,
          fields: ['name^3', 'description', 'tags^2', 'category'], // Name is boosted 3x, tags 2x
          fuzziness: 'AUTO', // Handles typos
        },
      },
    });

    return response.hits.hits.map((hit) => hit._source);
  }
}
