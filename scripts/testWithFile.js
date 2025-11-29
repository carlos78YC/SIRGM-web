/**
 * Script para probar la creación de reportes con archivos
 * Requiere: npm install form-data (si no está instalado)
 * Uso: node scripts/testWithFile.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
let authToken = '';

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function login() {
  log('\n=== Iniciando sesión ===', 'blue');
  return new Promise((resolve, reject) => {
    const loginData = JSON.stringify({
      email: 'alumno@ejemplo.com',
      password: 'Password123'
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode === 200 && json.success) {
            authToken = json.data.token;
            log('✅ Login exitoso', 'green');
            resolve(true);
          } else {
            log(`❌ Error en login: ${json.message || 'Error desconocido'}`, 'red');
            resolve(false);
          }
        } catch (e) {
          log(`❌ Error parseando respuesta: ${e.message}`, 'red');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      log(`❌ Error de conexión: ${error.message}`, 'red');
      reject(error);
    });

    req.write(loginData);
    req.end();
  });
}

async function createReporteWithFile(FormData) {
  log('\n=== Probando POST /reportes con archivo ===', 'blue');

  if (!authToken) {
    log('❌ No hay token. Ejecutando login primero...', 'yellow');
    const loginOk = await login();
    if (!loginOk) {
      log('❌ No se pudo obtener token. Asegúrate de tener un usuario registrado.', 'red');
      return;
    }
  }

  // Crear un archivo de prueba (imagen simple en formato base64)
  // Esto crea un PNG de 1x1 pixel
  const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const testImageBuffer = Buffer.from(testImageBase64, 'base64');
  const testImagePath = path.join(__dirname, '..', 'uploads', 'temp', 'test-image.png');

  // Asegurarse de que el directorio existe
  const uploadsDir = path.dirname(testImagePath);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Escribir el archivo de prueba
  fs.writeFileSync(testImagePath, testImageBuffer);
  log(`📁 Archivo de prueba creado: ${testImagePath}`, 'yellow');

  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('titulo', 'Reporte con foto de prueba');
    form.append('descripcion', 'Este es un reporte de prueba que incluye una imagen');
    form.append('ubicacion', 'Edificio de Pruebas, Piso 1');
    form.append('prioridad', 'media');
    form.append('foto', fs.createReadStream(testImagePath), {
      filename: 'test-image.png',
      contentType: 'image/png'
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/reportes',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...form.getHeaders()
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode === 201 && json.success) {
            log('✅ Reporte con archivo creado exitosamente', 'green');
            log(JSON.stringify(json, null, 2));
            
            // Limpiar archivo temporal
            if (fs.existsSync(testImagePath)) {
              fs.unlinkSync(testImagePath);
              log('🧹 Archivo temporal eliminado', 'yellow');
            }
            
            resolve(true);
          } else {
            log(`❌ Error: ${res.statusCode}`, 'red');
            log(JSON.stringify(json, null, 2));
            resolve(false);
          }
        } catch (e) {
          log(`❌ Error parseando respuesta: ${e.message}`, 'red');
          log(`Respuesta: ${data}`, 'yellow');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      log(`❌ Error de conexión: ${error.message}`, 'red');
      reject(error);
    });

    form.pipe(req);
  });
}

async function runTest() {
  log('🧪 Iniciando prueba de subida de archivos...\n', 'blue');
  
  // Verificar si form-data está disponible
  let FormData;
  try {
    FormData = require('form-data');
  } catch (e) {
    log('❌ El paquete "form-data" no está instalado', 'red');
    log('💡 Ejecuta: npm install form-data', 'yellow');
    log('\n💡 Alternativamente, puedes usar:', 'yellow');
    log('   - curl (ver TEST_ARCHIVOS.md)', 'yellow');
    log('   - Postman o similar', 'yellow');
    process.exit(1);
  }

  // Verificar que el servidor esté corriendo
  try {
    await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/health', (res) => {
        if (res.statusCode === 200) {
          log('✅ Servidor está corriendo', 'green');
          resolve();
        } else {
          reject(new Error(`Servidor respondió con código ${res.statusCode}`));
        }
      });
      req.on('error', reject);
      req.setTimeout(3000, () => {
        req.destroy();
        reject(new Error('Timeout: El servidor no responde'));
      });
    });
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    log('💡 Asegúrate de que el servidor esté corriendo: npm start', 'yellow');
    process.exit(1);
  }

  // Ejecutar prueba
  await createReporteWithFile(FormData);

  log('\n✨ Prueba completada!\n', 'green');
}

// Ejecutar prueba
runTest().catch(console.error);

