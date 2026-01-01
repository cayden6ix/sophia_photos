import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import archiver from 'archiver';
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
  async getAllPhotos(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    try {
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 20));
      return await this.photosService.getAllPhotos(pageNum, limitNum);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('download/:id')
  async downloadPhoto(@Param('id') id: string, @Res() res: Response) {
    const photo = await this.photosService.getPhotoById(id);
    if (!photo) {
      throw new HttpException('Foto nao encontrada', HttpStatus.NOT_FOUND);
    }

    try {
      const storagePath = this.photosService.extractStoragePath(photo.file_url);
      const buffer = await this.photosService.downloadPhotoBuffer(storagePath);

      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${photo.file_name}"`,
      });

      res.send(buffer);
    } catch (error) {
      throw new HttpException(
        `Erro ao baixar foto: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('download-zip')
  async downloadZip(
    @Body() body: { photoIds: string[] },
    @Res() res: Response,
  ) {
    const { photoIds } = body;

    if (!photoIds || photoIds.length === 0) {
      throw new HttpException(
        'Nenhuma foto selecionada',
        HttpStatus.BAD_REQUEST,
      );
    }

    const photos = await this.photosService.getPhotosByIds(photoIds);

    if (photos.length === 0) {
      throw new HttpException('Fotos nao encontradas', HttpStatus.NOT_FOUND);
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, 19);
    const zipFilename = `sophia_photos_${timestamp}.zip`;

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${zipFilename}"`,
    });

    const archive = archiver('zip', { zlib: { level: 5 } });
    archive.pipe(res);

    // Download paralelo das fotos para melhor performance
    const downloadResults = await Promise.allSettled(
      photos.map(async (photo) => {
        const storagePath = this.photosService.extractStoragePath(photo.file_url);
        const buffer = await this.photosService.downloadPhotoBuffer(storagePath);
        return { buffer, fileName: photo.file_name, id: photo.id };
      }),
    );

    // Adiciona ao arquivo apenas os downloads bem sucedidos
    for (const result of downloadResults) {
      if (result.status === 'fulfilled') {
        archive.append(result.value.buffer, { name: result.value.fileName });
      } else {
        console.error('Erro ao baixar foto:', result.reason);
      }
    }

    await archive.finalize();
  }
}
