# Project Principles — Multiherramientas SEI

> Status: Draft
> Last Updated: 2026-10-23

## Purpose

Este documento establece los principios de diseño y desarrollo que gobiernan la evolución de la extensión Multiherramientas SEI. Guía la toma de decisiones para mantener la extensión confiable, rápida, intuitiva y respetuosa con los datos institucionales.

## How to Use These Principles

- `MUST`: Obligatorio e innegociable.
- `SHOULD`: Práctica recomendada por defecto; cualquier excepción requiere justificación en el diseño técnico (`design.md`).
- `MAY`: Opcional según criterio.

## Principles

### P-001: Privacidad y Confidencialidad Absoluta de Datos
- **Nivel:** MUST
- **Regla:** Ningún dato personal (nombres, identificadores, números de contacto, calificaciones de alumnos) procesado por la extensión puede ser transmitido, sincronizado o expuesto fuera del contexto local del navegador.
- **Razón:** Los asistentes administrativos manejan datos sensibles y protegidos por políticas de privacidad de la Iglesia y normativas de protección de datos.
- **Aplica a:** PRD, SPEC, TASKS, EXEC, REVIEW.

### P-002: Modularidad e Independencia de Herramientas
- **Nivel:** MUST
- **Regla:** Cada herramienta del kit debe ser un módulo autocontenido. El fallo, desactivación o refactorización de una herramienta no debe afectar ni romper el funcionamiento del resto del kit.
- **Razón:** El kit crecerá de forma incremental agregando herramientas una por una.
- **Aplica a:** SPEC, TASKS, EXEC.

### P-003: Velocidad y Cero Fricción en el Flujo de Trabajo
- **Nivel:** SHOULD
- **Regla:** Las herramientas deben activarse con un solo clic o atajo, con tiempos de respuesta instantáneos (<100ms) y UI minimalista enfocada en la tarea.
- **Razón:** La extensión existe para ahorrar tiempo, no para añadir pasos burocráticos.
- **Aplica a:** PRD, DESIGN, REVIEW.

### P-004: Diseño Estético y Profesional (Design System Cohesivo)
- **Nivel:** SHOULD
- **Regla:** Todas las herramientas deben compartir un sistema visual coherente, moderno (tokens de color, tipografía legible, modo oscuro/claro y microanimaciones suaves).
- **Razón:** Proporcionar una experiencia de usuario placentera, profesional y de alta calidad.
- **Aplica a:** DESIGN, EXEC, REVIEW.

### P-005: Permisos Mínimos Declarativos
- **Nivel:** MUST
- **Regla:** No solicitar permisos amplios de Chrome (`<all_urls>`, etc.) a menos que una herramienta aprobada justifique técnicamente su necesidad estricta y delimitada.
- **Razón:** Seguridad del navegador y confianza del usuario institucional.
- **Aplica a:** SPEC, REVIEW.

## Decision Rules

1. La privacidad y seguridad de los datos de SEI prevalecen sobre cualquier conveniencia de integración externa.
2. La simpleza operativa prevalece sobre la complejidad funcional innecesaria.
3. Si una propuesta genera dudas de compliance o de permisos en el navegador, consultar inmediatamente con el usuario antes de implementar.
