SecureUP es una app Android de seguridad digital personal. Verifica contraseñas filtradas sin enviarlas, analiza códigos QR antes de abrirlos y guarda el historial en el dispositivo.

## Contexto

El proyecto nace de una pregunta incómoda: ¿por qué las apps de seguridad piden justo el dato que deberían proteger? La respuesta suele ser comodidad. SecureUP intenta resolver el problema sin recolectar credenciales.

Es individual, está escrita en Kotlin con Jetpack Compose y usa Room para persistencia local. El backend propio todavía no existe.

## Problema

Las personas reutilizan contraseñas y abren enlaces sin verificar. Una app puede ayudar en ambos casos, pero solo si el usuario confía en ella. Y la confianza empieza por no pedir más de lo necesario.

## Restricciones

- Android nativo, sin backend propio.
- Una sola persona desarrollando.
- Tiempo de materia.
- La app debía funcionar sin conexión para el historial.
- El análisis de URLs no podía depender de un servicio externo.

## Decisiones

### 1. k-anonimato para contraseñas

La verificación usa HIBP Pwned Passwords. Solo se envía el prefijo SHA-1 de cinco caracteres. La contraseña completa nunca abandona el dispositivo y la comparación final es local.

### 2. Análisis local de URLs

Las reglas revisan esquema, HTTPS, IP como host, punycode, user-info, acortadores y longitud. Es heurística, no reputación, pero cubre los ataques más comunes sin enviar la URL a terceros.

### 3. Solo las URLs seguras se pueden abrir

La app no bloquea el enlace: deja de ofrecer el botón. El usuario puede copiarlo y abrirlo por su cuenta, pero la acción segura es la ruta por defecto.

### 4. Room para el historial

El historial vive en el dispositivo. No hay cuenta ni sincronización. El costo es perderlo al cambiar de teléfono; la ventaja es que no existe una base central de enlaces escaneados.

### 5. MVVM sin capas decorativas

La arquitectura es UI → ViewModel → Repository → Room/Retrofit/ML Kit. No hay capa de casos de uso para un proyecto de este tamaño; agregarla habría sido ceremonia sin beneficio.

## Arquitectura

```text
Compose UI
   │
   ▼
ViewModel (StateFlow)
   │
   ▼
Repository
   ├── Room (historial)
   ├── Retrofit (HIBP)
   └── ML Kit (QR)
```

## Implementación

La pantalla de inicio muestra un Security Score calculado con los escaneos recientes. La pantalla de brechas consulta HIBP y muestra cuántas veces aparece la contraseña. El escáner usa CameraX y ML Kit, y el análisis de la URL ocurre antes de habilitar cualquier acción.

El PDF se genera con `PdfDocument` y se comparte con Storage Access Framework. No requiere permisos de almacenamiento amplios.

## Resultado

- 71 pruebas unitarias.
- Lint sin errores.
- Flujo completo de verificación de contraseña y escaneo de QR.
- Historial local funcional.
- Exportación a PDF.

Lo que falta:

- Backend propio.
- Bóveda de contraseñas.
- Servicio de reputación de URLs.
- Publicación en Play Store.

## Aprendizajes

- El k-anonimato es una decisión de diseño, no solo de criptografía.
- El historial local puede dar valor sin backend.
- La seguridad de una app también está en lo que no hace.

## Qué haría diferente

- Definiría el contrato del backend antes de simular el repositorio.
- Agregaría tests de instrumentación para los flujos de cámara.
- Separaría las reglas de análisis de URLs en un módulo reutilizable.
