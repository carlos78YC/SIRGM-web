/**
 * Script para crear el bucket de Storage en Supabase
 * Uso: node scripts/createBucket.js
 */

const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'reportes-fotos';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno:');
  console.error('   - SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_KEY');
  console.error('\n💡 Verifica tu archivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createBucket() {
  console.log('🔍 Verificando bucket de Storage...\n');

  // Primero, listar buckets existentes
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.error('❌ Error al listar buckets:', listError.message);
    if (listError.message.includes('JWT')) {
      console.error('💡 Verifica que SUPABASE_SERVICE_KEY sea correcta');
    }
    process.exit(1);
  }

  // Verificar si el bucket ya existe
  const bucketExists = buckets.some(bucket => bucket.name === bucketName);

  if (bucketExists) {
    console.log(`✅ El bucket "${bucketName}" ya existe`);
    console.log('\n📦 Buckets disponibles:');
    buckets.forEach(bucket => {
      const marker = bucket.name === bucketName ? '✓' : ' ';
      console.log(`   ${marker} ${bucket.name} (${bucket.public ? 'público' : 'privado'})`);
    });
    return;
  }

  // Crear el bucket
  console.log(`📦 Creando bucket "${bucketName}"...`);

  const { data, error } = await supabase.storage.createBucket(bucketName, {
    public: true, // Hacer el bucket público para URLs públicas
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  });

  if (error) {
    console.error('❌ Error al crear el bucket:', error.message);
    
    if (error.message.includes('already exists')) {
      console.log(`✅ El bucket "${bucketName}" ya existe (creado desde otro lugar)`);
    } else {
      console.error('\n💡 Intenta crear el bucket manualmente:');
      console.error('   1. Ve a Supabase Dashboard → Storage');
      console.error(`   2. Crea un bucket llamado: ${bucketName}`);
      console.error('   3. Configúralo como público');
      process.exit(1);
    }
  } else {
    console.log(`✅ Bucket "${bucketName}" creado exitosamente`);
    console.log('   - Público: Sí');
    console.log('   - Tamaño máximo: 5MB');
    console.log('   - Tipos permitidos: jpeg, jpg, png, gif, webp');
  }

  // Listar buckets después de crear
  const { data: updatedBuckets } = await supabase.storage.listBuckets();
  console.log('\n📦 Buckets disponibles:');
  updatedBuckets.forEach(bucket => {
    const marker = bucket.name === bucketName ? '✓' : ' ';
    console.log(`   ${marker} ${bucket.name} (${bucket.public ? 'público' : 'privado'})`);
  });
}

createBucket()
  .then(() => {
    console.log('\n✨ Proceso completado!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });











