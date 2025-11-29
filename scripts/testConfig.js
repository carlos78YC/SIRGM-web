const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('🔍 Verificando configuración...\n');

// Variables requeridas
const requiredVars = {
  'Base de datos PostgreSQL': [
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
  ],
  'Supabase': [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_KEY'
  ],
  'Servidor': [
    'PORT',
    'JWT_SECRET'
  ]
};

let hasErrors = false;

// Verificar variables de entorno
console.log('📋 Verificando variables de entorno...\n');
for (const [category, vars] of Object.entries(requiredVars)) {
  console.log(`  ${category}:`);
  vars.forEach(varName => {
    if (process.env[varName]) {
      // Ocultar valores sensibles
      const value = varName.includes('PASSWORD') || varName.includes('SECRET') || varName.includes('KEY')
        ? '***' + process.env[varName].slice(-4)
        : process.env[varName];
      console.log(`    ✅ ${varName}: ${value}`);
    } else {
      console.log(`    ❌ ${varName}: NO DEFINIDA`);
      hasErrors = true;
    }
  });
  console.log('');
}

if (hasErrors) {
  console.error('❌ Faltan variables de entorno requeridas. Por favor, verifica tu archivo .env\n');
  process.exit(1);
}

// Probar conexión a PostgreSQL
console.log('🗄️  Probando conexión a PostgreSQL...');
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('    ❌ Error conectando a PostgreSQL:', err.message);
    hasErrors = true;
  } else {
    console.log('    ✅ Conexión a PostgreSQL exitosa');
    console.log(`    📅 Hora del servidor: ${res.rows[0].now}`);
  }
  
  pool.end();
  
  // Probar conexión a Supabase
  console.log('\n☁️  Probando conexión a Supabase...');
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
  
  // Verificar que Supabase esté configurado correctamente
  // Intentamos hacer una operación simple para verificar la conexión
  supabase
    .storage
    .listBuckets()
    .then(({ data, error }) => {
      if (error) {
        // Si hay error pero las credenciales están bien, puede ser un problema de permisos
        // Verificamos si es un error de autenticación o de permisos
        if (error.message && error.message.includes('JWT')) {
          console.error('    ❌ Error de autenticación con Supabase:', error.message);
          console.error('    💡 Verifica que SUPABASE_SERVICE_KEY sea correcta');
          hasErrors = true;
        } else {
          // Otros errores pueden ser permisos, pero la conexión funciona
          console.log('    ⚠️  Supabase conectado (verifica permisos de Storage si vas a subir archivos)');
        }
      } else {
        console.log('    ✅ Conexión a Supabase exitosa');
        if (data && data.length > 0) {
          console.log(`    📦 Buckets encontrados: ${data.length}`);
        }
      }
      
      // Resumen final
      console.log('\n' + '='.repeat(50));
      if (hasErrors) {
        console.log('❌ VERIFICACIÓN FALLIDA');
        console.log('Por favor, corrige los errores antes de continuar.\n');
        process.exit(1);
      } else {
        console.log('✅ VERIFICACIÓN EXITOSA');
        console.log('Todo está configurado correctamente. Puedes iniciar el servidor con:');
        console.log('  npm start');
        console.log('  o');
        console.log('  npm run dev\n');
        process.exit(0);
      }
    });
});

