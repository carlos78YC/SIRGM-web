const { Pool } = require('pg');
require('dotenv').config();

// Verificar que las variables de entorno estén definidas
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ ERROR: Faltan variables de entorno requeridas:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 Solución: Crea un archivo .env en la raíz del proyecto con las variables necesarias.');
  console.error('   Consulta VERIFICAR_CONFIG.md para más información.\n');
}

// Configuración del pool
const poolConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Asegurar que la conexión use UTF-8
  client_encoding: 'UTF8',
};

// SSL solo si es necesario (para Supabase o bases de datos remotas)
// Si DB_HOST contiene 'supabase.co', habilitar SSL
if (process.env.DB_HOST && process.env.DB_HOST.includes('supabase.co')) {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
} else if (process.env.DB_SSL === 'true') {
  // Permitir habilitar SSL manualmente
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = new Pool(poolConfig);

// Manejo de errores del pool
pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de conexiones:', err.message);
  console.error('   Detalles:', err.code || 'Sin código de error');
});

// Función para probar la conexión
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Conexión a PostgreSQL exitosa');
    console.log(`   📅 Hora del servidor: ${result.rows[0].now}`);
    return true;
  } catch (err) {
    console.error('❌ Error al conectar con PostgreSQL:');
    console.error(`   Mensaje: ${err.message}`);
    
    // Mensajes de ayuda según el tipo de error
    if (err.code === 'ENOTFOUND') {
      console.error('   💡 El host no se puede resolver. Verifica DB_HOST en tu archivo .env');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('   💡 La conexión fue rechazada. Verifica:');
      console.error('      - Que el servidor PostgreSQL esté corriendo');
      console.error('      - Que DB_PORT sea correcto');
      console.error('      - Que el firewall permita la conexión');
    } else if (err.code === '28P01') {
      console.error('   💡 Error de autenticación. Verifica DB_USER y DB_PASSWORD');
    } else if (err.code === '3D000') {
      console.error('   💡 La base de datos no existe. Verifica DB_NAME');
    } else if (err.code === 'ETIMEDOUT') {
      console.error('   💡 Timeout de conexión. Verifica:');
      console.error('      - Que el host sea accesible');
      console.error('      - Tu conexión a internet');
    }
    
    return false;
  }
}

// Probar conexión al cargar el módulo (solo si todas las variables están definidas)
if (missingVars.length === 0) {
  testConnection().catch(() => {
    // El error ya se mostró en testConnection
  });
}

module.exports = pool;
module.exports.testConnection = testConnection;





