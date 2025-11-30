const { Pool } = require('pg');
const dns = require('dns');
const { promisify } = require('util');
require('dotenv').config();

// Forzar que Node.js prefiera IPv4 sobre IPv6 a nivel del sistema
// Esto evita problemas de conectividad en entornos como Render
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Si no está disponible en esta versión de Node.js, continuar
}

// Configurar variables de entorno para forzar IPv4
process.env.NODE_OPTIONS = (process.env.NODE_OPTIONS || '') + ' --dns-result-order=ipv4first';

// Función de lookup personalizada que FUERZA IPv4
function ipv4Lookup(hostname, options, callback) {
  // Siempre forzar familia IPv4 - esto es crítico para Render
  dns.lookup(hostname, { 
    family: 4,  // Solo IPv4
    all: false  // Solo la primera dirección
  }, (err, address, family) => {
    if (err) {
      // Si falla IPv4, intentar una vez más
      return dns.lookup(hostname, { family: 4, all: false }, (err2, address2, family2) => {
        if (err2) {
          return callback(err2);
        }
        callback(null, address2, 4);
      });
    }
    // Asegurar que siempre devolvamos familia 4 (IPv4)
    callback(null, address, 4);
  });
}

// Función para crear la configuración del pool
function createPoolConfig() {
  // Opción 1: Usar DATABASE_URL (preferido para Supabase)
  if (process.env.DATABASE_URL) {
    try {
      // Parsear la URL para extraer componentes y forzar IPv4
      const dbUrl = new URL(process.env.DATABASE_URL);
      
      // Extraer credenciales de la URL
      const username = dbUrl.username;
      const password = dbUrl.password;
      const hostname = dbUrl.hostname;
      const port = parseInt(dbUrl.port) || 5432;
      const database = dbUrl.pathname.replace(/^\//, '') || 'postgres';
      
      // Configuración individual para forzar IPv4
      const config = {
        host: hostname,
        port: port,
        database: database,
        user: username,
        password: password,
        // Forzar IPv4 - CRÍTICO para Render
        family: 4,
        // Lookup personalizado que fuerza IPv4
        lookup: ipv4Lookup,
        // SSL obligatorio para Supabase
        ssl: {
          rejectUnauthorized: false,
          require: true
        },
        // Timeout de conexión
        connectionTimeoutMillis: 10000,
        // Asegurar UTF-8
        client_encoding: 'UTF8'
      };
      
      return config;
    } catch (error) {
      // Si hay error al parsear, intentar con connectionString directamente
      console.warn('⚠️ Advertencia: No se pudo parsear DATABASE_URL, usando connectionString directamente');
      return {
        connectionString: process.env.DATABASE_URL,
        family: 4,
        lookup: ipv4Lookup,
        ssl: {
          rejectUnauthorized: false,
          require: true
        },
        connectionTimeoutMillis: 10000,
      };
    }
  }
  
  // Opción 2: Usar variables individuales (fallback)
  const poolConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // Asegurar que la conexión use UTF-8
    client_encoding: 'UTF8',
    // Forzar IPv4 para evitar problemas de conectividad
    family: 4,
    // Lookup personalizado que fuerza IPv4
    lookup: ipv4Lookup,
    // Timeout de conexión
    connectionTimeoutMillis: 10000,
  };

  // SSL obligatorio para Supabase o bases de datos remotas
  if (process.env.DB_HOST && process.env.DB_HOST.includes('supabase.co')) {
    poolConfig.ssl = {
      rejectUnauthorized: false,
      require: true
    };
  } else if (process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production') {
    // En producción, siempre usar SSL
    poolConfig.ssl = {
      rejectUnauthorized: false,
      require: true
    };
  }

  return poolConfig;
}

// Verificar variables de entorno
const hasDatabaseUrl = !!process.env.DATABASE_URL;
const hasIndividualVars = process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD;

if (!hasDatabaseUrl && !hasIndividualVars) {
  console.error('❌ ERROR: No se encontraron variables de entorno para la base de datos.');
  console.error('');
  console.error('💡 Configura UNA de estas opciones:');
  console.error('');
  console.error('   Opción 1 (Recomendado): DATABASE_URL');
  console.error('   - Obténla desde: Supabase Dashboard → Settings → Database → Connection string');
  console.error('   - Formato: postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres');
  console.error('');
  console.error('   Opción 2: Variables individuales');
  console.error('   - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD');
  console.error('');
  console.error('📝 Consulta VERIFICAR_CONFIG.md para más información.\n');
}

// Crear configuración del pool
let poolConfig;
try {
  poolConfig = createPoolConfig();
} catch (error) {
  console.error('❌ ERROR al configurar la conexión:', error.message);
  process.exit(1);
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
    const result = await client.query('SELECT NOW(), version()');
    client.release();
    
    console.log('✅ Conexión a PostgreSQL exitosa');
    console.log(`   📅 Hora del servidor: ${result.rows[0].now}`);
    console.log(`   🔌 Versión PostgreSQL: ${result.rows[0].version.split(',')[0]}`);
    
    // Verificar que SSL esté activo
    try {
      const sslResult = await pool.query('SHOW ssl');
      console.log(`   🔒 SSL: ${sslResult.rows[0]?.ssl || 'Verificado'}`);
    } catch (e) {
      // Ignorar si no se puede verificar SSL
    }
    
    return true;
  } catch (err) {
    console.error('❌ Error al conectar con PostgreSQL:');
    console.error(`   Mensaje: ${err.message}`);
    console.error(`   Código: ${err.code || 'N/A'}`);
    
    // Mensajes de ayuda según el tipo de error
    if (err.code === 'ENOTFOUND') {
      console.error('   💡 El host no se puede resolver. Verifica:');
      console.error('      - Que el host en DATABASE_URL o DB_HOST sea correcto');
      console.error('      - Que el proyecto de Supabase esté activo (no pausado)');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('   💡 La conexión fue rechazada. Verifica:');
      console.error('      - Que el puerto sea correcto (5432 para Supabase)');
      console.error('      - Que el firewall permita la conexión');
    } else if (err.code === 'ENETUNREACH') {
      console.error('   💡 Error de red. Verifica:');
      console.error('      - Que el proyecto de Supabase esté activo');
      console.error('      - Que las credenciales sean correctas');
      console.error('      - Que no haya problemas de conectividad');
    } else if (err.code === '28P01') {
      console.error('   💡 Error de autenticación. Verifica:');
      console.error('      - DB_USER o usuario en DATABASE_URL');
      console.error('      - DB_PASSWORD o contraseña en DATABASE_URL');
    } else if (err.code === '3D000') {
      console.error('   💡 La base de datos no existe. Verifica DB_NAME');
    } else if (err.code === 'ETIMEDOUT' || err.message.includes('timeout')) {
      console.error('   💡 Timeout de conexión. Verifica:');
      console.error('      - Que el host sea accesible desde Render');
      console.error('      - Que el proyecto de Supabase esté activo');
    } else if (err.message.includes('SSL') || err.message.includes('TLS')) {
      console.error('   💡 Error de SSL. Verifica que SSL esté configurado correctamente.');
    }
    
    // Mostrar qué variables están configuradas (sin mostrar valores completos)
    console.error('');
    console.error('📋 Variables de entorno detectadas:');
    console.error(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada'}`);
    console.error(`   DB_HOST: ${process.env.DB_HOST || '❌ No configurada'}`);
    console.error(`   DB_USER: ${process.env.DB_USER ? '✅ Configurada' : '❌ No configurada'}`);
    console.error(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '✅ Configurada' : '❌ No configurada'}`);
    console.error(`   DB_NAME: ${process.env.DB_NAME || '❌ No configurada'}`);
    console.error('');
    
    return false;
  }
}

// Probar conexión al cargar el módulo (solo si hay variables configuradas)
if (hasDatabaseUrl || hasIndividualVars) {
  testConnection().catch(() => {
    // El error ya se mostró en testConnection
  });
}

module.exports = pool;
module.exports.testConnection = testConnection;
