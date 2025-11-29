const dotenv = require('dotenv');
const path = require('path');
const { Pool } = require('pg');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('🔍 DIAGNÓSTICO DE CONEXIÓN A POSTGRESQL\n');
console.log('='.repeat(60) + '\n');

// Paso 1: Verificar archivo .env
console.log('📋 PASO 1: Verificando archivo .env...\n');

const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ El archivo .env NO existe en la raíz del proyecto.');
  console.error('\n💡 SOLUCIÓN:');
  console.error('   1. Crea un archivo llamado .env en la raíz del proyecto');
  console.error('   2. Agrega las siguientes variables:');
  console.error('      DB_HOST=tu-host');
  console.error('      DB_PORT=5432');
  console.error('      DB_NAME=postgres');
  console.error('      DB_USER=postgres');
  console.error('      DB_PASSWORD=tu-password');
  console.error('\n   Consulta VERIFICAR_CONFIG.md para más detalles.\n');
  process.exit(1);
} else {
  console.log('✅ Archivo .env encontrado\n');
}

// Paso 2: Verificar variables de entorno
console.log('📋 PASO 2: Verificando variables de entorno...\n');

const requiredVars = {
  'DB_HOST': 'Host de la base de datos',
  'DB_PORT': 'Puerto de la base de datos',
  'DB_NAME': 'Nombre de la base de datos',
  'DB_USER': 'Usuario de la base de datos',
  'DB_PASSWORD': 'Contraseña de la base de datos'
};

let hasMissingVars = false;

for (const [varName, description] of Object.entries(requiredVars)) {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    console.error(`❌ ${varName}: NO DEFINIDA (${description})`);
    hasMissingVars = true;
  } else {
    // Ocultar valores sensibles
    const displayValue = varName === 'DB_PASSWORD' 
      ? '*'.repeat(Math.min(value.length, 8)) 
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  }
}

if (hasMissingVars) {
  console.error('\n❌ Faltan variables de entorno requeridas.');
  console.error('   Por favor, completa tu archivo .env con todas las variables necesarias.\n');
  process.exit(1);
}

console.log('\n✅ Todas las variables de entorno están definidas\n');

// Paso 3: Verificar formato de las variables
console.log('📋 PASO 3: Verificando formato de las variables...\n');

const port = parseInt(process.env.DB_PORT);
if (isNaN(port) || port < 1 || port > 65535) {
  console.error(`❌ DB_PORT tiene un valor inválido: ${process.env.DB_PORT}`);
  console.error('   El puerto debe ser un número entre 1 y 65535\n');
  process.exit(1);
} else {
  console.log(`✅ DB_PORT es válido: ${port}`);
}

if (!process.env.DB_HOST.includes('.') && !process.env.DB_HOST.includes('localhost') && process.env.DB_HOST !== '127.0.0.1') {
  console.warn(`⚠️  DB_HOST parece tener un formato inusual: ${process.env.DB_HOST}`);
  console.warn('   Verifica que sea correcto (ej: db.xxxxx.supabase.co o localhost)\n');
} else {
  console.log(`✅ DB_HOST tiene formato válido: ${process.env.DB_HOST}`);
}

console.log('');

// Paso 4: Intentar conexión
console.log('📋 PASO 4: Intentando conectar a PostgreSQL...\n');

const poolConfig = {
  host: process.env.DB_HOST,
  port: port,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionTimeoutMillis: 5000, // 5 segundos de timeout
};

// Habilitar SSL si es Supabase
if (process.env.DB_HOST.includes('supabase.co')) {
  poolConfig.ssl = { rejectUnauthorized: false };
  console.log('🔒 SSL habilitado (Supabase detectado)\n');
}

const pool = new Pool(poolConfig);

pool.query('SELECT NOW(), version()', (err, res) => {
  if (err) {
    console.error('❌ ERROR AL CONECTAR:\n');
    console.error(`   Código: ${err.code || 'N/A'}`);
    console.error(`   Mensaje: ${err.message}\n`);
    
    // Mensajes de ayuda específicos
    console.log('💡 DIAGNÓSTICO Y SOLUCIONES:\n');
    
    if (err.code === 'ENOTFOUND') {
      console.log('   Problema: El host no se puede resolver.');
      console.log('   Soluciones:');
      console.log('     1. Verifica que DB_HOST sea correcto');
      console.log('     2. Verifica tu conexión a internet');
      console.log('     3. Si es Supabase, verifica que el proyecto esté activo\n');
    } else if (err.code === 'ECONNREFUSED') {
      console.log('   Problema: La conexión fue rechazada.');
      console.log('   Soluciones:');
      console.log('     1. Verifica que el servidor PostgreSQL esté corriendo');
      console.log('     2. Verifica que DB_PORT sea correcto (5432 por defecto)');
      console.log('     3. Verifica que el firewall permita conexiones en ese puerto');
      console.log('     4. Si es local, verifica que PostgreSQL esté instalado y activo\n');
    } else if (err.code === '28P01') {
      console.log('   Problema: Error de autenticación.');
      console.log('   Soluciones:');
      console.log('     1. Verifica que DB_USER sea correcto');
      console.log('     2. Verifica que DB_PASSWORD sea correcto');
      console.log('     3. Si es Supabase, obtén las credenciales desde:');
      console.log('        Dashboard → Settings → Database\n');
    } else if (err.code === '3D000') {
      console.log('   Problema: La base de datos no existe.');
      console.log('   Soluciones:');
      console.log('     1. Verifica que DB_NAME sea correcto');
      console.log('     2. Crea la base de datos si no existe');
      console.log('     3. Para Supabase, generalmente es "postgres"\n');
    } else if (err.code === 'ETIMEDOUT' || err.message.includes('timeout')) {
      console.log('   Problema: Timeout de conexión.');
      console.log('   Soluciones:');
      console.log('     1. Verifica tu conexión a internet');
      console.log('     2. Verifica que el host sea accesible');
      console.log('     3. Si es Supabase, verifica que el proyecto no esté pausado');
      console.log('     4. Intenta aumentar el timeout en la configuración\n');
    } else if (err.code === '23505') {
      console.log('   Problema: Violación de restricción única (esto es un error de datos, no de conexión)');
      console.log('   La conexión funciona, pero hay un problema con los datos.\n');
    } else {
      console.log('   Problema desconocido.');
      console.log('   Soluciones generales:');
      console.log('     1. Verifica todas las credenciales en tu archivo .env');
      console.log('     2. Si es Supabase, verifica que el proyecto esté activo');
      console.log('     3. Consulta VERIFICAR_CONFIG.md para más ayuda\n');
    }
    
    pool.end();
    process.exit(1);
  } else {
    console.log('✅ ¡CONEXIÓN EXITOSA!\n');
    console.log(`   📅 Hora del servidor: ${res.rows[0].now}`);
    console.log(`   🗄️  Versión: ${res.rows[0].version.split(' ')[0]} ${res.rows[0].version.split(' ')[1]}\n`);
    console.log('='.repeat(60));
    console.log('✅ La base de datos está configurada correctamente.');
    console.log('   Puedes iniciar el servidor con: npm start\n');
    
    pool.end();
    process.exit(0);
  }
});











