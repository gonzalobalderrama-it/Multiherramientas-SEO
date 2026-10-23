# SDD Workflow Guide — Multiherramientas SEI

> Propósito: Guía operativa para el flujo de trabajo guiado por especificaciones (Spec-Driven Development).
> Última actualización: 2026-10-23

## Flujo Central

```text
IDEA → PLAN → PRD → SPEC → TASKS → EXEC → REVIEW → SHIP
```

El flujo garantiza que cada micro-herramienta agregada al complemento de Chrome tenga una necesidad clara, un diseño técnico consistente, tareas atómicas y evidencia de verificación antes de tocar código.

## Fases y Comandos

### 1. IDEA (`/sdd-idea`)
- **Uso:** Explorar una nueva idea de herramienta o automatización para SEI cuando la dirección o utilidad aún no está totalmente definida.
- **Salida típica:** `.ai/sdd/ideas/NNN-nombre-idea.md`

### 2. PLAN (`/sdd-plan`)
- **Uso:** Mapear el catálogo o roadmap de herramientas que compondrán el kit, sus fases de entrega y dependencias.
- **Salida típica:** `.ai/sdd/PLAN.md`

### 3. PRD / Requisitos (`/sdd-prd`)
- **Uso:** Definir el QUÉ y el POR QUÉ de una herramienta específica (historias de usuario, casos de uso, sintaxis EARS, alcance fuera de límite).
- **Salida típica:** `.ai/sdd/specs/NNN-herramienta/requirements.md`
- **Compuerta:** Requiere aprobación humana explícita (`requirements:approved`).

### 4. SPEC / Diseño Técnico (`/sdd-spec`)
- **Uso:** Definir el CÓMO técnico (componentes de UI en sidepanel/popup, listeners de background, APIs de Chrome, modelos de datos locales y manejo de errores).
- **Salida típica:** `.ai/sdd/specs/NNN-herramienta/design.md`
- **Compuerta:** Requiere aprobación humana explícita (`design:approved`).

### 5. TASKS / Plan de Tareas (`/sdd-tasks`)
- **Uso:** Desglosar el diseño técnico en tareas atómicas y secuenciales de 2 a 4 horas con criterios de aceptación y comandos de verificación.
- **Salida típica:** `.ai/sdd/specs/NNN-herramienta/tasks.md`
- **Compuerta:** Requiere aprobación humana explícita (`tasks:approved`).

### 6. EXEC / Implementación (`/sdd-exec`)
- **Uso:** Implementar una tarea aprobada a la vez. No se escribe código si el estado no es `tasks:approved`.
- **Salida típica:** Código fuente, pruebas y actualización de evidencia en `.status`.

### 7. REVIEW / Verificación (`/sdd-review`)
- **Uso:** Auditoría imparcial de la implementación contra los requisitos y diseño técnico aprobados.
- **Salida típica:** `.ai/sdd/specs/NNN-herramienta/review.md`

---

## Principio Fundamental

> **El código es consecuencia de una especificación aprobada, nunca una improvisación.**
