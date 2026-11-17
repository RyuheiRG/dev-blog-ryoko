Los datasets académicos llegan como llegan: un CSV exportado de otro sistema, con columnas que nadie documentó y tipos que cambian entre filas. Frame-Data-Bayes existe para analizar esos archivos sin asumir que están limpios.

## Contexto

El proyecto es un motor de análisis probabilístico y clasificación estadística. Combina validación de datos, detección automática de tipos, inferencia bayesiana y visualizaciones interactivas en Streamlit.

Es individual y corre local. No hay demo pública porque el valor está en el pipeline, no en una URL.

## Problema

Un análisis estadístico confiable necesita datos confiables. Si el pipeline acepta cualquier columna como numérica, el modelo aprende ruido y las visualizaciones mienten con estilo.

El problema tenía tres partes:

1. Validar la estructura del archivo antes de leerlo completo.
2. Detectar el tipo real de cada columna sin intervención manual.
3. Explicar el resultado del modelo, no solo mostrar una predicción.

## Restricciones

- Tiempo de una materia, no de un producto.
- Stack académico: Python, Pandas, NumPy, Scikit-Learn, Streamlit.
- Datasets pequeños y heterogéneos.
- Sin backend ni base de datos.
- La interfaz debía caber en una sola app.

## Decisiones

### 1. Validar antes de modelar

La ingesta revisa codificación, delimitador, columnas y filas. Si el archivo no cumple el mínimo, se detiene con un mensaje claro. Prefiero un error explícito a un `NaN` que se propaga hasta la matriz de confusión.

### 2. Detectar tipos con reglas, no con fechas mágicas

La detección combina el tipo declarado por Pandas con una prueba de parseo. Una columna se considera temporal si más del 90% de sus valores se pueden interpretar como fecha. El umbral es conservador: evita convertir identificadores en fechas.

### 3. Implementar Bayes explícitamente

El Teorema de Bayes se calcula paso a paso, no se importa como caja negra. Eso permite mostrar los términos en la UI y explicar por qué una probabilidad sube o baja.

### 4. Usar Gaussian Naïve Bayes para clasificación

Para anomalías, Gaussian Naïve Bayes ofrece un balance razonable entre simplicidad e interpretabilidad. La matriz de confusión se muestra completa, con falsos positivos incluidos.

### 5. Visualizaciones antes que métricas

El panel prioriza histogramas, series temporales y matrices. Un número de accuracy sin contexto no dice nada; una distribución mal segmentada sí.

## Arquitectura

```text
CSV
 │
 ▼
Validación de integridad
 │
 ▼
Detección de tipos ──► Limpieza
 │                      │
 ▼                      ▼
EDA                 Bayes / Gaussian NB
 │                      │
 └──────► Visualización ◄┘
```

Cada etapa es una función pura sobre un `DataFrame`. La UI solo orquesta: no contiene lógica de validación ni de cálculo.

## Implementación

El panel de ingesta muestra el archivo, el número de filas y columnas, y los problemas detectados. El panel EDA permite filtrar por tipo de columna. El panel Bayes muestra la probabilidad previa, la verosimilitud y la posterior.

La parte más delicada fue la limpieza: eliminar filas vacías sin perder información válida, normalizar nombres de columnas y separar categóricas de numéricas sin convertir todo a texto.

## Resultado

Funciona con datasets pequeños y medianos. Detecta columnas numéricas, categóricas, temporales y binarias. Genera visualizaciones y clasificaciones explicables.

Lo que no hace:

- No maneja archivos gigantes.
- No tiene tests con datasets reales.
- No persiste resultados entre sesiones.
- No es una herramienta multiusuario.

## Aprendizajes

- Validar antes de modelar ahorra horas de debugging.
- La interpretabilidad importa más que la accuracy en un contexto académico.
- Un pipeline claro se puede explicar; un notebook no.

## Qué haría diferente

- Escribiría tests de integración con archivos sucios desde el primer día.
- Separaría la UI del pipeline en paquetes desde el inicio.
- Agregaría un modo de exportación de reportes para no depender de la sesión de Streamlit.
