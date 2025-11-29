const supabase = require('../config/supabase');
const fs = require('fs').promises;
const path = require('path');

class StorageService {
  constructor() {
    this.bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'reportes-fotos';
  }

  async uploadFile(filePath, fileName, folder = 'reportes') {
    try {
      // Leer el archivo
      const fileBuffer = await fs.readFile(filePath);

      // Ruta en Supabase Storage
      const storagePath = `${folder}/${Date.now()}-${fileName}`;

      // Subir a Supabase
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(storagePath, fileBuffer, {
          contentType: this.getContentType(fileName),
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(storagePath);

      // Eliminar archivo temporal
      await this.deleteLocalFile(filePath);

      return {
        url: urlData.publicUrl,
        path: storagePath
      };
    } catch (error) {
      // Asegurar que se elimine el archivo temporal incluso si hay error
      await this.deleteLocalFile(filePath);
      throw error;
    }
  }

  async deleteFile(storagePath) {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([storagePath]);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error al eliminar archivo de storage:', error);
      return false;
    }
  }

  async deleteLocalFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Ignorar error si el archivo no existe
      if (error.code !== 'ENOENT') {
        console.error('Error al eliminar archivo local:', error);
      }
    }
  }

  getContentType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    return contentTypes[ext] || 'image/jpeg';
  }
}

module.exports = new StorageService();















