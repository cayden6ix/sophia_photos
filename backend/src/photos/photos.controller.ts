import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('photos', 20))
  async uploadPhotos(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new HttpException('Nenhuma foto enviada', HttpStatus.BAD_REQUEST);
    }

    const results = [];

    for (const file of files) {
      try {
        const result = await this.photosService.uploadPhoto(file);
        results.push(result);
      } catch (error) {
        results.push({
          fileName: file.originalname,
          error: error.message,
        });
      }
    }

    return {
      message: `${results.filter((r) => !r.error).length} foto(s) enviada(s) com sucesso`,
      photos: results,
    };
  }

  @Get()
  async getAllPhotos() {
    try {
      const photos = await this.photosService.getAllPhotos();
      return { photos };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
