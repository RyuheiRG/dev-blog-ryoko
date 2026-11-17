Vaca Cúbica es un Sistema de Gestión Bovina (S.G.B.) construido como monorepositorio: frontend React, backend FastAPI y despliegue en AWS con una base de datos privada.

## Contexto

El proyecto nació en una materia de desarrollo web con un requisito claro: gestionar información bovina con una arquitectura que no fuera un CRUD improvisado. El equipo éramos tres personas y el alcance incluía autenticación, CRUD, despliegue y documentación.

## Problema

La información del ganado suele vivir en hojas de cálculo y libretas. Un sistema centralizado necesita resolver tres cosas: quién puede ver los datos, cómo se mantienen consistentes y dónde corre la base de datos.

## Restricciones

- Equipo de tres personas.
- Tiempo de un cuatrimestre.
- Presupuesto limitado para infraestructura.
- Stack definido por la materia: React, FastAPI, MySQL.
- Despliegue real, no solo local.

## Decisiones

### 1. Monorepo con fronteras claras

Frontend y backend viven en el mismo repositorio, pero en carpetas separadas. Compartir configuración es fácil; mezclar responsabilidades no.

### 2. FastAPI + SQLAlchemy async

FastAPI da validación con Pydantic y documentación OpenAPI sin esfuerzo. SQLAlchemy async con `asyncmy` mantiene el backend no bloqueante.

### 3. MySQL local, RDS en producción

El desarrollo usa MySQL 8.4 local con DBngin. Producción usa Amazon RDS dentro de una VPC privada, sin acceso público.

### 4. EC2 como nodo de cómputo

La API corre en una instancia EC2. RDS solo acepta conexiones desde la VPC y los security groups están restringidos. No es una arquitectura empresarial, pero es una separación real entre cómputo y datos.

### 5. Pydantic falla al arrancar

Si faltan variables críticas, la app no inicia. Es mejor un error de configuración visible que un secreto vacío en producción.

## Arquitectura

```text
React + Vite
     │  HTTPS
     ▼
FastAPI (EC2)
     │
     ▼
SQLAlchemy async
     │
     ▼
MySQL (Amazon RDS, VPC privada)
```

## Implementación

El frontend usa React 18 con Vite y consume la API con fetch. El backend separa routers, schemas y servicios. La autenticación usa JWT con `SECRET_KEY` y las contraseñas se almacenan con hash.

El despliegue del frontend está en Vercel; el backend en EC2. La base de datos no es accesible desde internet.

## Resultado

- CRUD funcional de ganado.
- Autenticación con JWT.
- Despliegue en Vercel + AWS.
- Documentación de la arquitectura y variables de entorno.

Lo que falta:

- Tests de integración del backend.
- Migraciones formales con Alembic.
- Observabilidad y backups automatizados.
- Un dominio propio para la API.

## Aprendizajes

- La separación cliente-servidor se vuelve tangible cuando hay que desplegar.
- La seguridad de infraestructura no es opcional: RDS privado, security groups y secrets.
- Un monorepo ordena el trabajo en equipo, pero exige disciplina.

## Qué haría diferente

- Agregaría migraciones desde el primer commit.
- Definiría un contrato OpenAPI compartido antes de escribir el frontend.
- Automatizaría el despliegue del backend con un pipeline, no con pasos manuales.
