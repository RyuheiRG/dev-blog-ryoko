Un blog personal no necesita un CMS corporativo. Necesita publicar rápido, no romperse y no obligarte a pelear con plugins cada vez que cambias un título. Este es el razonamiento detrás de Ryoko: un sitio estático con un CMS propio, tres APIs pequeñas y un deploy que se dispara solo.

## Por qué no WordPress ni un CMS SaaS

WordPress resuelve el 90% del problema y trae el 100% de la superficie de ataque. Para un blog con tres posts iniciales, mantener PHP, temas, plugins y actualizaciones era más trabajo que escribir el contenido.

Un CMS SaaS era la otra opción. El problema no era el precio: era que el contenido vive en otra parte. Quería que el blog fuera mío, que el HTML se generara en mi máquina y que el navegador no tuviera que pedir permiso a un servicio externo para mostrar un párrafo.

La decisión fue construir algo pequeño y aburrido: FastAPI, PostgreSQL y Astro.

## Tres APIs, una sola responsabilidad

El CMS no es un monolito. Son tres servicios con límites claros:

| API | Responsabilidad | Lo que no hace |
|---|---|---|
| Content API | Posts, proyectos, media, tags | Métricas |
| Webhook API | Eventos firmados, reintentos, auditoría | Contenido |
| Metrics API | Visitas, clicks, agregados GraphQL | Leer contenido |

Separarlas evita que un pico de métricas afecte la publicación. También permite desplegarlas y escalarlas por separado.

El contrato vive en un solo archivo. Si un campo no está ahí, no existe. Esa regla suena rígida hasta que dos servicios empiezan a interpretar `status` de formas distintas.

## Astro en build time

El navegador nunca consulta la Content API. Astro pide los datos durante el build, valida la respuesta con Zod y genera HTML estático.

```ts
// src/lib/cms/client.ts
export async function cmsFetch<T>(path: string): Promise<T> {
  const response = await fetch(new URL(path, CMS_API_URL), {
    headers: { Authorization: `Bearer ${CMS_API_TOKEN}` },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`CMS respondió ${response.status} en ${path}`);
  }

  return response.json() as Promise<T>;
}
```

Si la API falla, el build falla y Vercel conserva el deploy anterior. Prefiero un build rojo a un sitio con la mitad del contenido.

El costo es que publicar tarda un par de minutos. La ventaja es que la visita promedio descarga HTML, CSS y unas cuantas imágenes: nada de JavaScript esperando datos.

## Publicar: CMS → webhook → n8n → Vercel

El flujo completo es corto:

1. Escribo el post en el panel del CMS.
2. La Content API guarda el borrador y calcula el tiempo de lectura.
3. Al publicar, emite un evento `post.published`.
4. La Webhook API valida la firma HMAC y lo encola.
5. n8n recibe el evento y llama al Deploy Hook de Vercel.
6. Vercel reconstruye el sitio y el post aparece.

La firma se calcula sobre `timestamp + "." + body` y se compara en tiempo constante. Un evento duplicado responde `202` sin reprocesar. Si n8n falla, el evento queda en la cola con intentos y último error.

## Métricas sin cookies

Las métricas son lo único que se envía desde el navegador. No uso cookies ni identificadores persistentes. El `session_id` se genera por sesión y el servidor resuelve el sitio con una key pública.

El envío usa `fetch` con `keepalive: true`:

```ts
await fetch(METRICS_API_URL, {
  method: "POST",
  keepalive: true,
  headers: {
    "Content-Type": "application/json",
    "X-Site-Key": METRICS_SITE_KEY,
  },
  body: JSON.stringify({
    query: TRACK_EVENT,
    variables: { input: event },
  }),
});
```

No uso `navigator.sendBeacon` porque no permite enviar el header `X-Site-Key` sin convertir la petición en un formulario. El API resuelve el `site_id` desde la key: el cliente no elige a qué sitio pertenecen sus eventos.

> **Nota:** si el usuario tiene Do Not Track activo o `navigator.connection.saveData`, el script no envía nada. El sitio funciona igual.

## Lo que aprendí

- **El contrato es el producto.** Cambiar `status` por `publish_status` y `lifecycle_status` después de escribir los schemas fue barato; hacerlo con datos reales habría dolido.
- **Validar temprano ahorra builds.** Zod señala el endpoint, el campo y el valor recibido. Un error claro vale más que un `cannot read property of undefined`.
- **Publicar es el flujo crítico.** El hero se ve bonito, pero si publicar requiere cinco pasos manuales, el blog se muere en dos semanas.

Todavía falta: búsqueda, comentarios y un modo de lectura claro. Nada de eso está en v1. Si algún día llega, tiene que justificar su peso.
