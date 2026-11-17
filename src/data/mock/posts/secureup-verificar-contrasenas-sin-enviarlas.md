La mayoría de las apps de seguridad piden tu contraseña para “verificarla”. Ese es el problema, no la solución. SecureUP parte de una regla simple: la contraseña completa nunca sale del dispositivo.

## El problema de reutilizar contraseñas

La reutilización es cómoda y peligrosa. Cuando un servicio se filtra, los atacantes prueban la misma combinación en bancos, correos y redes sociales. La víctima no necesita haber hecho nada malo: basta con que el sitio filtró una base de datos.

Una app puede ayudar de dos formas:

1. Decirte si una contraseña aparece en filtraciones conocidas.
2. Avisarte antes de abrir un enlace sospechoso.

Ninguna de las dos requiere que la app se quede con tus credenciales.

## HIBP y k-anonimato

Have I Been Pwned expone un endpoint para consultar contraseñas filtradas. El detalle importante es cómo: no envías la contraseña, envías un prefijo de su hash SHA-1.

El flujo es:

1. Calculas el SHA-1 de la contraseña.
2. Tomas los primeros cinco caracteres del hash.
3. Consultas el rango correspondiente.
4. Comparas el resto del hash localmente.

El servidor devuelve cientos de sufijos posibles. No sabe cuál es el tuyo. Eso es k-anonimato: tu consulta se pierde entre muchas parecidas.

```kotlin
private fun sha1Prefix(password: String): String {
    val digest = MessageDigest.getInstance("SHA-1")
    val hash = digest.digest(password.toByteArray(Charsets.UTF_8))
    val hex = hash.joinToString("") { "%02X".format(it) }
    return hex.take(5)
}
```

SHA-1 está roto para firmas, pero aquí se usa como función de búsqueda, no como prueba de integridad. El prefijo de cinco caracteres reduce la consulta a una fracción del espacio total y permite comparar sin revelar el secreto.

## Análisis local de URLs y QR

El escáner de QR no abre la URL directamente. Primero extrae el contenido y lo analiza con reglas locales:

- Esquema permitido (`https`, no `javascript:` ni `file:`).
- HTTPS obligatorio para enlaces externos.
- IP como host en lugar de dominio.
- Punycode y caracteres homógrafos.
- User-info en la URL (`https://banco.com@malicioso.example`).
- Acortadores conocidos.
- Longitud y cantidad de subdominios.

Solo si el enlace pasa las reglas se ofrece el botón para abrirlo en el navegador. El análisis es heurístico: no reemplaza a un servicio de reputación, pero detiene los casos obvios sin enviar la URL a ningún servidor.

## Historial con Room

El historial vive en el dispositivo. Room guarda el resultado del escaneo, la fecha y el nivel de riesgo. No hay cuenta, no hay sincronización y no hay backend propio todavía.

Esa decisión tiene un costo: si cambias de teléfono, pierdes el historial. También tiene una ventaja: no hay una base de datos central con los enlaces que escaneaste.

El PDF se genera con `PdfDocument` y se comparte con Storage Access Framework. El archivo sale del dispositivo solo cuando el usuario lo decide.

## Lo que falta

SecureUP es funcional, pero no está terminado:

- El backend propio no existe; el login usa un repositorio simulado.
- La bóveda de contraseñas está pospuesta.
- El análisis de URLs es heurístico, no un servicio de reputación.
- La app no está publicada en Play Store.

Las 71 pruebas unitarias y el lint sin errores no convierten el proyecto en producto. Convierten el código en algo que se puede seguir tocando sin miedo.

La lección más útil fue esta: la seguridad de una app también está en lo que no hace. No recolectar contraseñas, no enviar URLs y no pedir una cuenta son decisiones de diseño, no features.
