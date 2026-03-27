import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly index = 'products';
  private readonly categoryIndex = 'categories';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

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
            brand: { type: 'keyword' },
            tags: { type: 'keyword' },
            sku: { type: 'keyword' },
            barcode: { type: 'keyword' },
            createdAt: { type: 'date' },
          },
        },
      });
      this.logger.log(`Created index: ${this.index}`);
    }

    const categoryIndexExists = await this.elasticsearchService.indices.exists({
      index: this.categoryIndex,
    });

    if (!categoryIndexExists) {
      await this.elasticsearchService.indices.create({
        index: this.categoryIndex,
        mappings: {
          properties: {
            id: { type: 'integer' },
            name: { type: 'text', analyzer: 'standard' },
            slug: { type: 'keyword' },
            imageUrl: { type: 'keyword' },
          },
        },
      });
      this.logger.log(`Created index: ${this.categoryIndex}`);
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
          brand: product.brand?.name || 'No Brand',
          tags: product.tags,
          sku: product.sku,
          barcode: product.barcode,
          createdAt: product.createdAt,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to index product ${product.id}`, error.stack);
    }
  }

  async indexProducts(products: Product[]) {
    if (!products.length) return;

    const operations = products.flatMap((product) => [
      { index: { _index: this.index, _id: product.id.toString() } },
      {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price) || 0,
        category: product.category?.name || 'Uncategorized',
        brand: product.brand?.name || 'No Brand',
        tags: product.tags || [],
        sku: product.sku || '',
        barcode: product.barcode || '',
        createdAt: product.createdAt,
      },
    ]);

    try {
      const response = await this.elasticsearchService.bulk({
        operations,
        refresh: true,
      });

      if (response.errors) {
        this.logger.error('Bulk indexing encountered errors');
        response.items.forEach((item) => {
          if (item.index && item.index.error) {
            this.logger.error(
              `Error indexing product ${item.index._id}: ${JSON.stringify(item.index.error)}`,
            );
          }
        });
      } else {
        this.logger.log(`Successfully indexed ${products.length} products`);
      }
    } catch (error) {
      this.logger.error('Failed to bulk index products', error);
      console.error('Full ES Bulk Error:', JSON.stringify(error, null, 2));
      throw error; // Re-throw to see 500 in response
    }
  }

  async indexCategory(category: any) {
    try {
      return await this.elasticsearchService.index({
        index: this.categoryIndex,
        id: category.id.toString(),
        document: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          imageUrl: category.imageUrl,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to index category ${category.id}`, error.stack);
    }
  }

  async removeCategory(categoryId: number) {
    try {
      await this.elasticsearchService.delete({
        index: this.categoryIndex,
        id: categoryId.toString(),
      });
    } catch (error) {
      this.logger.error(
        `Failed to delete category ${categoryId} from index`,
        error.stack,
      );
    }
  }

  async removeProduct(productId: number) {
    try {
      await this.elasticsearchService.delete({
        index: this.index,
        id: productId.toString(),
      });
    } catch (error) {
      this.logger.error(
        `Failed to delete product ${productId} from index`,
        error.stack,
      );
    }
  }

  async search(text: string) {
    const lowerText = text.toLowerCase();

    // Search Products
    const productResponse = await this.elasticsearchService.search({
      index: this.index,
      query: {
        bool: {
          should: [
            {
              multi_match: {
                query: text,
                fields: ['name^3', 'description', 'tags^2', 'category', 'brand^2', 'sku^4', 'barcode^4'],
                fuzziness: 'AUTO',
                operator: 'and',
              },
            },
            { wildcard: { name: `*${lowerText}*` } },
            { wildcard: { description: `*${lowerText}*` } },
            { match_phrase_prefix: { name: text } },
          ],
          minimum_should_match: 1,
        },
      },
    });

    // Search Categories
    const categoryResponse = await this.elasticsearchService.search({
      index: this.categoryIndex,
      query: {
        bool: {
          should: [
            { match: { name: { query: text, fuzziness: 'AUTO' } } },
            { wildcard: { name: `*${lowerText}*` } },
          ],
          minimum_should_match: 1,
        },
      },
    });

    const products = productResponse.hits.hits.map((hit) => ({
      ...(hit._source as any),
      type: 'product',
    }));
    const categories = categoryResponse.hits.hits.map((hit) => ({
      ...(hit._source as any),
      type: 'category',
    }));

    return [...categories, ...products];
  }

  async findSimilar(
    productId: number,
    category: string,
    tags: string[] = [],
    limit: number = 4,
  ) {
    try {
      const response = await this.elasticsearchService.search({
        index: this.index,
        size: limit,
        query: {
          bool: {
            must: [{ match: { category: category } }],
            should: [{ terms: { tags: tags } }],
            filter: [{ bool: { must_not: { term: { id: productId } } } }],
          },
        },
      });

      return response.hits.hits.map((hit) => hit._source);
    } catch (error) {
      this.logger.error(
        `Failed to find similar products for ${productId}`,
        error.stack,
      );
      return [];
    }
  }
}
