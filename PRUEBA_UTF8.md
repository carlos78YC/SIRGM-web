# Prueba de UTF-8 - Instrucciones

## 🔍 Problema Detectado

Aunque configuramos el middleware UTF-8, todavía hay problemas con la codificación de caracteres especiales como "ñ" y tildes.

## ✅ Solución Aplicada

1. Mejorado el middleware `utf8Handler.js` para asegurar mejor manejo de UTF-8
2. Verificado que el charset se establezca antes de enviar respuestas

## 🧪 Cómo Probar en el Frontend

1. **Abre el navegador** y ve a `http://localhost:5173/`

2. **Inicia sesión como admin** (o crea un usuario admin si no existe)

3. **Ve al panel de administración** → Gestión de Usuarios

4. **Crea un usuario de prueba**:
   - Nombre: `José`
   - Apellido: `Peña`
   - Email: `jose.pena@test.com`
   - Rol: `alumno`
   - Contraseña: `Test123`

5. **Verifica**:
   - Que el usuario aparezca en la tabla con "Peña" mostrándose correctamente
   - Que no aparezca como "Pea" o símbolos raros

6. **Crea un reporte de prueba**:
   - Título: `Reparación de baño`
   - Descripción: `Necesito reparar el baño de la planta baja`
   - Verifica que los caracteres especiales se muestren correctamente

## 🔧 Si Aún Hay Problemas

Si los caracteres aún no se muestran correctamente:

1. **Verifica la consola del navegador** (F12):
   - Ve a la pestaña "Network"
   - Busca una petición a `/admin/users` o `/reportes`
   - Verifica que el header `Content-Type` incluya `charset=utf-8`

2. **Verifica el encoding de la base de datos**:
   - Los datos pueden estar almacenados incorrectamente
   - Puede ser necesario re-insertar los datos con UTF-8 correcto

3. **Reinicia el servidor backend**:
   ```bash
   # Detener (Ctrl+C) y reiniciar:
   npm run dev
   ```

## 📝 Nota sobre PowerShell

PowerShell puede mostrar caracteres incorrectamente en la consola, pero esto NO significa que el problema esté en el backend. **La mejor forma de probar es directamente en el navegador** donde los caracteres deberían mostrarse correctamente si el UTF-8 está bien configurado.


