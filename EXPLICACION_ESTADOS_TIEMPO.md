# Explicación: Estados y Tiempos en SIRGM

## 📊 Estados de los Reportes

El sistema SIRGM maneja **4 estados** para los reportes:

1. **Pendiente** - El reporte ha sido creado pero aún no se ha comenzado a trabajar en él
2. **En Proceso** - El reporte está siendo atendido por el personal de mantenimiento
3. **Resuelto** - El problema ha sido solucionado, pero el reporte aún no está cerrado
4. **Cerrado** - El reporte ha sido finalizado completamente

## ⏰ ¿Qué Significan las "Horas" en Pendiente y Resuelto?

En la página de **Estadísticas** (`/estadisticas`), el sistema calcula y muestra:

### Tiempo Promedio en cada Estado

El sistema calcula cuánto tiempo (en días y horas) los reportes permanecen en cada estado:

#### **Pendiente - Tiempo Promedio**
- **Qué es**: Cuánto tiempo promedio han estado los reportes esperando antes de ser atendidos
- **Cómo se calcula**: Diferencia entre la fecha actual y cuando se creó el reporte
- **Ejemplo**: 
  - Un reporte creado hace 2 días y 5 horas que sigue en "pendiente"
  - Muestra: "Promedio: 2 días 5 horas"

#### **Resuelto - Tiempo Promedio**
- **Qué es**: Cuánto tiempo promedio permanecen los reportes en estado "resuelto" antes de ser cerrados
- **Cómo se calcula**: Diferencia entre la fecha actual y cuando se marcó como "resuelto"
- **Ejemplo**:
  - Un reporte marcado como "resuelto" hace 3 horas
  - Muestra: "Promedio: 3 horas"

## 📈 Visualización en la Interfaz

En la página de **Estadísticas**, verás algo como:

```
┌─────────────────────────┐
│   ⏳ Pendientes        │
│   15                    │
│   Promedio: 2 días 5h   │  ← Tiempo promedio esperando
└─────────────────────────┘

┌─────────────────────────┐
│   ✅ Resueltos          │
│   8                     │
│   Promedio: 6 horas     │  ← Tiempo promedio resueltos
└─────────────────────────┘
```

## 🔍 Cómo Funciona el Cálculo

El sistema calcula estos tiempos así:

1. **Para cada reporte en un estado específico**:
   - Toma la fecha de creación (`created_at`) para "pendiente"
   - Toma la fecha de última actualización (`updated_at`) para otros estados
   - Calcula la diferencia con la fecha/hora actual

2. **Promedio**:
   - Suma todos los tiempos de los reportes en ese estado
   - Divide entre la cantidad de reportes
   - Muestra el resultado en días y horas

## 💡 ¿Para Qué Sirve?

Estos tiempos promedio ayudan a:
- **Identificar cuellos de botella**: Si los reportes están mucho tiempo "pendientes", significa que hay demoras en la atención
- **Medir eficiencia**: Si los reportes "resueltos" están mucho tiempo sin cerrar, indica que falta seguimiento
- **Mejorar procesos**: Permite ver dónde se puede optimizar el flujo de trabajo

## 📝 Notas Importantes

- El tiempo se calcula **desde la fecha de creación** para "pendiente"
- El tiempo se calcula **desde la última actualización** para otros estados
- El sistema muestra el promedio de **todos los reportes** en cada estado
- Los tiempos se muestran en formato: "X días Y horas" o solo "X horas" si es menos de un día

## 🔄 Flujo de Estados

```
Creación → [Pendiente] → [En Proceso] → [Resuelto] → [Cerrado]
           ↑ tiempo     ↑ tiempo      ↑ tiempo
           promedio     promedio      promedio
```

---

**En resumen**: Las "horas" que ves en pendiente y resuelto son el **tiempo promedio** que los reportes permanecen en ese estado antes de cambiar al siguiente.


