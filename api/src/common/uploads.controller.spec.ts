import { Test, TestingModule } from '@nestjs/testing';
import { UploadsController } from './uploads.controller';

describe('UploadsController', () => {
  let controller: UploadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadsController],
    }).compile();

    controller = module.get<UploadsController>(UploadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should return file information and url', () => {
      const mockFile = {
        originalname: 'test.png',
        filename: 'file-123.png',
      } as any;

      const result = controller.uploadFile(mockFile);

      expect(result).toEqual({
        originalname: 'test.png',
        filename: 'file-123.png',
        url: '/uploads/file-123.png',
      });
    });
  });
});
