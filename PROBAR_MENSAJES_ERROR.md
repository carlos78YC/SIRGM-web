# 🔍 Cómo Probar los Mensajes de Error

## ⚠️ Si el mensaje NO aparece

Sigue estos pasos para diagnosticar:

### Paso 1: Verificar en la Consola del Navegador

1. Abre el dashboard: `http://localhost:5173`
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña "Console"
4. Intenta hacer login con credenciales incorrectas
5. Busca mensajes que empiecen con "Error en login:" o "Error completo en AuthContext:"

Esto te dirá exactamente qué mensaje está recibiendo el frontend.

---

### Paso 2: Verificar que el Backend Devuelve el Mensaje

1. Abre otra terminal
2. Ejecuta:
```powershell
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{\"email\":\"noexiste@test.com\",\"password\":\"incorrecta\"}'
```

Deberías ver:
```json
{
  "success": false,
  "message": "El email o la contraseña no coinciden. Por favor, verifica tus credenciales e intenta nuevamente."
}
```

---

### Paso 3: Reiniciar el Servidor

Si el mensaje aún no aparece:

1. **Detén el servidor del frontend** (Ctrl+C)
2. **Reinicia el frontend**:
```bash
cd frontend
npm run dev
```

3. **Refresca el navegador** (Ctrl+F5 o Ctrl+Shift+R para forzar recarga)

---

### Paso 4: Verificar en el Código

El mensaje debería aparecer automáticamente porque:

1. ✅ El backend ahora devuelve el mensaje mejorado
2. ✅ El frontend captura el mensaje del backend
3. ✅ El componente Login muestra el mensaje cuando `error` tiene valor

Si aún no aparece, revisa la consola del navegador para ver qué error está ocurriendo.





