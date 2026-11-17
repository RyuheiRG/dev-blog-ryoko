Un CSV no es un archivo inocente. Puede traer tipos inconsistentes, columnas duplicadas, filas vacías, fechas en tres formatos y un número de teléfono que Excel convirtió en notación científica. Modelar encima de eso es construir sobre arena.

Frame-Data-Bayes nació de esa idea: tratar cada dataset como un entorno hostil y validar antes de calcular.

## Qué significa Zero Trust en datos

Zero Trust normalmente se explica con redes: no confíes en nada dentro del perímetro, verifica cada solicitud. En datos la idea se traduce igual: no confíes en la forma del archivo, verifica cada columna antes de usarla.

Eso implica cuatro reglas:

1. El archivo se valida antes de entrar al pipeline.
2. El tipo de cada columna se detecta, no se asume.
3. Las excepciones se manejan por fila, no se ignoran.
4. El modelo no recibe datos que no pasaron validación.

## Pipeline de ingesta

El flujo es lineal y cada etapa tiene una responsabilidad:

```text
CSV → Validación → Detección de tipos → Limpieza → Bayes → Clasificación → Visualización
```

La validación revisa integridad del archivo, codificación, delimitador y número de columnas. Después viene la detección de tipos: numéricos, categóricos, temporales y binarios.

```python
def detect_column_kind(series: pd.Series) -> str:
    non_null = series.dropna()
    if non_null.empty:
        return "empty"
    if pd.api.types.is_bool_dtype(non_null):
        return "boolean"
    if pd.api.types.is_numeric_dtype(non_null):
        return "numeric"
    if pd.api.types.is_datetime64_any_dtype(non_null):
        return "temporal"

    parsed = pd.to_datetime(non_null, errors="coerce", format="mixed")
    if parsed.notna().mean() > 0.9:
        return "temporal"
    return "categorical"
```

La regla del 90% evita que una fecha mal escrita convierta toda una columna en texto. Es una decisión conservadora: prefiero una columna categórica que un `NaT` silencioso.

## Bayes sin fórmulas innecesarias

El Teorema de Bayes actualiza una creencia cuando llega evidencia. En el proyecto se usa para calcular la probabilidad de una clase dado un conjunto de características.

La fórmula completa es corta:

```text
P(A|B) = P(B|A) * P(A) / P(B)
```

Lo interesante no es memorizarla, sino entender qué significa cada término:

- `P(A)` es lo que creía antes de ver los datos.
- `P(B|A)` es qué tan probable es la evidencia si la clase es A.
- `P(B)` normaliza para que las probabilidades sumen uno.

En un dataset pequeño, la parte difícil no es la fórmula: es elegir variables que no estén correlacionadas y detectar cuándo la evidencia es demasiado débil para concluir algo.

## Gaussian Naïve Bayes para anomalías

La clasificación usa Gaussian Naïve Bayes. La parte “naïve” asume independencia entre variables. Es una mentira útil: simplifica el cálculo y funciona sorprendentemente bien cuando las variables aportan señales distintas.

El pipeline separa entrenamiento y evaluación. La matriz de confusión se muestra tal cual, sin esconder falsos positivos. En un contexto académico, un modelo que explica sus errores vale más que uno con mejor accuracy y cero interpretabilidad.

## Visualizaciones que se entienden

El panel tiene tres vistas:

- Histogramas por variable para ver distribuciones.
- Series temporales para detectar cambios de comportamiento.
- Matriz de confusión para entender dónde falla el clasificador.

Streamlit permitió construirlo rápido, pero también impone límites: el estado se pierde con facilidad y el control fino de la UI es limitado. Para v1 fue suficiente; para una herramienta de producción no lo sería.

## Limitaciones y siguientes pasos

- El proyecto corre local; no hay demo pública.
- La detección de tipos es heurística, no perfecta.
- No hay tests de integración con datasets reales grandes.
- La explicación de Bayes en la UI puede mejorar.

El siguiente paso no es agregar modelos más complejos. Es agregar datasets de prueba difíciles y medir cuántas veces el pipeline se equivoca al inferir tipos. Eso vale más que una métrica bonita en un notebook.
