import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class PhotosService {
  private supabase: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL || 'https://mmqmixlxesazjiyltswp.supabase.co';
    const key = process.env.SUPABASE_KEY || '';

    console.log('Supabase URL:', url);
    console.log('Supabase Key exists:', !!key);

    this.supabase = createClient(url, key);
  }

  async uploadPhoto(file: Express.Multer.File): Promise<{ url: string; fileName: string }> {
    const fileName = `${Date.now()}-${file.originalname}`;
    console.log('Iniciando upload:', fileName);

    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from('photos')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    console.log('Upload result:', { uploadData, uploadError });

    if (uploadError) {
      console.error('Erro no upload storage:', uploadError);
      throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
    }

    const { data: urlData } = this.supabase.storage
      .from('photos')
      .getPublicUrl(fileName);

    const fileUrl = urlData.publicUrl;
    console.log('URL da foto:', fileUrl);

    const { data: dbData, error: dbError } = await this.supabase
      .from('photos')
      .insert({
        file_name: file.originalname,
        file_url: fileUrl,
      })
      .select();

    console.log('DB result:', { dbData, dbError });

    if (dbError) {
      console.error('Erro no banco:', dbError);
      throw new Error(`Erro ao salvar no banco: ${dbError.message}`);
    }

    return { url: fileUrl, fileName: file.originalname };
  }

  async getAllPhotos(
    page: number = 1,
    limit: number = 20,
  ): Promise<{ photos: any[]; total: number; hasMore: boolean }> {
    const offset = (page - 1) * limit;

    const { data, error, count } = await this.supabase
      .from('photos')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Erro ao buscar fotos: ${error.message}`);
    }

    const total = count || 0;
    return {
      photos: data || [],
      total,
      hasMore: offset + limit < total,
    };
  }

  async getPhotoById(id: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('photos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }
    return data;
  }

  async getPhotosByIds(ids: string[]): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('photos')
      .select('*')
      .in('id', ids);

    if (error) {
      throw new Error(`Erro ao buscar fotos: ${error.message}`);
    }
    return data || [];
  }

  async downloadPhotoBuffer(storagePath: string): Promise<Buffer> {
    const { data, error } = await this.supabase.storage
      .from('photos')
      .download(storagePath);

    if (error) {
      throw new Error(`Erro ao baixar foto: ${error.message}`);
    }

    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  extractStoragePath(fileUrl: string): string {
    const parts = fileUrl.split('/photos/');
    return parts[parts.length - 1];
  }
}
