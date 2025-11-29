/**
 * Script para probar todos los endpoints de la API
 * Uso: node scripts/testEndpoints.js
 */

const http = require('http');

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

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function testHealth() {
  log('\n=== 1. Probando /health ===', 'blue');
  try {
    const response = await makeRequest('GET', '/health');
    if (response.status === 200) {
      log('✅ Servidor funcionando correctamente', 'green');
      log(JSON.stringify(response.data, null, 2));
      return true;
    } else {
      log(`❌ Error: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    log('⚠️  Asegúrate de que el servidor esté corriendo en el puerto 3000', 'yellow');
    return false;
  }
}

async function testRegister() {
  log('\n=== 2. Probando POST /auth/register ===', 'blue');
  const userData = {
    email: `test${Date.now()}@ejemplo.com`,
    password: 'Password123',
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: 'alumno'
  };

  try {
    const response = await makeRequest('POST', '/auth/register', userData);
    if (response.status === 201 && response.data.success) {
      log('✅ Usuario registrado exitosamente', 'green');
      log(JSON.stringify(response.data, null, 2));
      authToken = response.data.data.token;
      log(`\n🔑 Token guardado: ${authToken.substring(0, 20)}...`, 'yellow');
      return true;
    } else {
      log(`❌ Error: ${response.status}`, 'red');
      log(JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    if (error.message.includes('ENOTFOUND')) {
      log('⚠️  Error de conexión a la base de datos', 'yellow');
      log('⚠️  Verifica tus credenciales en el archivo .env', 'yellow');
    }
    return false;
  }
}

async function testLogin() {
  log('\n=== 3. Probando POST /auth/login ===', 'blue');
  const loginData = {
    email: 'alumno@ejemplo.com',
    password: 'Password123'
  };

  try {
    const response = await makeRequest('POST', '/auth/login', loginData);
    if (response.status === 200 && response.data.success) {
      log('✅ Login exitoso', 'green');
      log(JSON.stringify(response.data, null, 2));
      authToken = response.data.data.token;
      log(`\n🔑 Token guardado: ${authToken.substring(0, 20)}...`, 'yellow');
      return true;
    } else {
      log(`❌ Error: ${response.status}`, 'red');
      log(JSON.stringify(response.data, null, 2));
      log('⚠️  Si es el primer login, primero debes registrar el usuario', 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return false;
  }
}

async function testCreateReporte() {
  log('\n=== 4. Probando POST /reportes ===', 'blue');
  
  if (!authToken) {
    log('❌ No hay token de autenticación. Primero debes hacer login o registro', 'red');
    return false;
  }

  const reporteData = {
    titulo: 'Fuga de agua en el baño',
    descripcion: 'Hay una fuga constante de agua en el baño del segundo piso que necesita reparación urgente',
    ubicacion: 'Edificio A, Segundo piso, Baño 2',
    prioridad: 'alta'
  };

  try {
    const response = await makeRequest('POST', '/reportes', reporteData, authToken);
    if (response.status === 201 && response.data.success) {
      log('✅ Reporte creado exitosamente', 'green');
      log(JSON.stringify(response.data, null, 2));
      return response.data.data.id; // Retornar el ID del reporte creado
    } else {
      log(`❌ Error: ${response.status}`, 'red');
      log(JSON.stringify(response.data, null, 2));
      return null;
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return null;
  }
}

async function testGetReportes() {
  log('\n=== 5. Probando GET /reportes ===', 'blue');
  
  if (!authToken) {
    log('❌ No hay token de autenticación', 'red');
    return false;
  }

  try {
    const response = await makeRequest('GET', '/reportes?estado=pendiente', null, authToken);
    if (response.status === 200 && response.data.success) {
      log('✅ Reportes obtenidos exitosamente', 'green');
      log(`📊 Total de reportes: ${response.data.count}`, 'yellow');
      log(JSON.stringify(response.data, null, 2));
      return true;
    } else {
      log(`❌ Error: ${response.status}`, 'red');
      log(JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return false;
  }
}

async function testGetReporteById(reporteId) {
  log('\n=== 6. Probando GET /reportes/:id ===', 'blue');
  
  if (!authToken) {
    log('❌ No hay token de autenticación', 'red');
    return false;
  }

  if (!reporteId) {
    log('⚠️  No hay ID de reporte para probar', 'yellow');
    return false;
  }

  try {
    const response = await makeRequest('GET', `/reportes/${reporteId}`, null, authToken);
    if (response.status === 200 && response.data.success) {
      log('✅ Reporte obtenido exitosamente', 'green');
      log(JSON.stringify(response.data, null, 2));
      return true;
    } else {
      log(`❌ Error: ${response.status}`, 'red');
      log(JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return false;
  }
}

async function testUpdateEstado(reporteId) {
  log('\n=== 7. Probando PUT /reportes/:id/estado ===', 'blue');
  
  if (!authToken) {
    log('❌ No hay token de autenticación', 'red');
    return false;
  }

  if (!reporteId) {
    log('⚠️  No hay ID de reporte para probar', 'yellow');
    return false;
  }

  const estadoData = {
    estado: 'en_proceso',
    observaciones: 'Se ha asignado un técnico para revisar el problema'
  };

  try {
    const response = await makeRequest('PUT', `/reportes/${reporteId}/estado`, estadoData, authToken);
    if (response.status === 200 && response.data.success) {
      log('✅ Estado actualizado exitosamente', 'green');
      log(JSON.stringify(response.data, null, 2));
      return true;
    } else {
      log(`❌ Error: ${response.status}`, 'red');
      log(JSON.stringify(response.data, null, 2));
      if (response.data.message && response.data.message.includes('permisos')) {
        log('⚠️  Solo admin y mantenimiento pueden actualizar estados', 'yellow');
      }
      return false;
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return false;
  }
}

async function testInvalidLogin() {
  log('\n=== 8. Probando Login con credenciales inválidas ===', 'blue');
  const invalidData = {
    email: 'noexiste@ejemplo.com',
    password: 'PasswordIncorrecto'
  };

  try {
    const response = await makeRequest('POST', '/auth/login', invalidData);
    if (response.status === 401) {
      log('✅ Validación de credenciales inválidas funciona correctamente', 'green');
      return true;
    } else {
      log(`⚠️  Se esperaba 401, se obtuvo: ${response.status}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return false;
  }
}

async function testUnauthorizedAccess() {
  log('\n=== 9. Probando acceso sin token ===', 'blue');
  
  try {
    const response = await makeRequest('GET', '/reportes', null, null);
    if (response.status === 401) {
      log('✅ Protección de rutas funciona correctamente', 'green');
      return true;
    } else {
      log(`⚠️  Se esperaba 401, se obtuvo: ${response.status}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('🧪 Iniciando pruebas de endpoints...\n', 'blue');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };

  // 1. Verificar que el servidor funcione
  log('\n' + '='.repeat(60), 'blue');
  const healthOk = await testHealth();
  results.total++;
  if (healthOk) results.passed++; else results.failed++;
  
  if (!healthOk) {
    log('\n❌ El servidor no está funcionando. Deteniendo pruebas.', 'red');
    log('\n💡 Ejecuta: npm start o npm run dev', 'yellow');
    return;
  }

  // 2. Registrar usuario
  log('\n' + '='.repeat(60), 'blue');
  const registerOk = await testRegister();
  results.total++;
  if (registerOk) results.passed++; else results.failed++;
  
  // Si el registro falla, intentar login (tal vez el usuario ya existe)
  if (!registerOk) {
    log('\n⚠️  Registro falló. Intentando login con credenciales existentes...', 'yellow');
    const loginOk = await testLogin();
    results.total++;
    if (loginOk) results.passed++; else results.failed++;
  } else {
    // Si el registro fue exitoso, también probar login
    log('\n⚠️  Probando login con el usuario recién registrado...', 'yellow');
    const loginOk = await testLogin();
    results.total++;
    if (loginOk) results.passed++; else results.failed++;
  }

  // 3. Probar acceso no autorizado
  log('\n' + '='.repeat(60), 'blue');
  const unauthorizedOk = await testUnauthorizedAccess();
  results.total++;
  if (unauthorizedOk) results.passed++; else results.failed++;

  // 4. Probar login inválido
  log('\n' + '='.repeat(60), 'blue');
  const invalidLoginOk = await testInvalidLogin();
  results.total++;
  if (invalidLoginOk) results.passed++; else results.failed++;

  // 5. Crear reporte
  log('\n' + '='.repeat(60), 'blue');
  const reporteId = await testCreateReporte();
  results.total++;
  if (reporteId) results.passed++; else results.failed++;

  // 6. Listar reportes
  log('\n' + '='.repeat(60), 'blue');
  const getReportesOk = await testGetReportes();
  results.total++;
  if (getReportesOk) results.passed++; else results.failed++;

  // 7. Obtener reporte por ID
  if (reporteId) {
    log('\n' + '='.repeat(60), 'blue');
    const getReporteOk = await testGetReporteById(reporteId);
    results.total++;
    if (getReporteOk) results.passed++; else results.failed++;

    // 8. Actualizar estado (requiere rol admin o mantenimiento)
    log('\n' + '='.repeat(60), 'blue');
    const updateEstadoOk = await testUpdateEstado(reporteId);
    results.total++;
    if (updateEstadoOk) results.passed++; else results.failed++;
  }

  // Resumen de resultados
  log('\n' + '='.repeat(60), 'blue');
  log('\n📊 RESUMEN DE PRUEBAS', 'blue');
  log('='.repeat(60), 'blue');
  log(`Total de pruebas: ${results.total}`, 'blue');
  log(`✅ Exitosas: ${results.passed}`, 'green');
  log(`❌ Fallidas: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log('='.repeat(60), 'blue');
  
  if (results.failed === 0) {
    log('\n✨ ¡Todas las pruebas pasaron exitosamente!', 'green');
  } else {
    log(`\n⚠️  ${results.failed} prueba(s) fallaron. Revisa los detalles arriba.`, 'yellow');
  }
  
  log('\n💡 Nota: Para probar la subida de archivos, usa:', 'yellow');
  log('   - curl (ver TEST_ARCHIVOS.md)', 'yellow');
  log('   - Postman o similar', 'yellow');
  log('   - node scripts/testWithFile.js', 'yellow');
  log('\n');
}

// Ejecutar pruebas
runTests().catch(console.error);


