# SDD Index — Multiherramientas SEI

> Status: Active
> Language: es
> Last Updated: 2026-10-23

## Steering

| Documento | Ruta | Estado | Notas |
|-----------|------|--------|-------|
| Product | `.ai/steering/product.md` | draft | Visión, usuario objetivo (Asistente SEI) y alcance |
| Tech Stack | `.ai/steering/tech-stack.md` | draft | Chrome Extension Manifest V3, Side Panel, Vanilla CSS |
| Conventions | `.ai/steering/conventions.md` | draft | Modularidad de herramientas, seguridad, estilo de código |
| Principles | `.ai/steering/principles.md` | draft | Privacidad de datos, permisos mínimos, diseño cohesivo |

## Upstream Handoffs

| Artefacto | Ruta | Estado | Notas |
|-----------|------|--------|-------|
| Strategy Brief | `.ai/strategy/handoff/strategy-brief.md` | missing | Opcional, no requerido para este proyecto |

## Plan

| Artefacto | Ruta | Estado | Notas |
|-----------|------|--------|-------|
| Plan | `.ai/sdd/PLAN.md` | missing | Se puede crear mediante `/sdd-plan` |

## Ideas

| ID | Nombre | Estado | Ruta | Recomendación |
|----|--------|--------|------|---------------|

## Feature Workspace

> Fuente de numeración: directorios reales bajo `.ai/sdd/specs/`.

| Campo | Valor | Notas |
|-------|-------|-------|
| Next Feature ID | 002 | Próximo feature disponible para especificación |
| Numbering Issues | none | |

## Specs

| ID | Feature | Estado | Requisitos | Diseño | Tareas | Review | Próxima Acción |
|----|---------|--------|------------|--------|--------|--------|----------------|
| 001 | 001-validador-egreso | review:done | approved | approved | approved | done | Abrir PR hacia develop con `/sdd-gh-pr` |

## Handoff Output

| Artefacto | Ruta | Estado / Preparación | Notas |
|-----------|------|----------------------|-------|
| SDD Brief | `.ai/sdd/handoff/sdd-brief.md` | missing | Se generará automáticamente tras tareas aprobadas o review |

## In Progress

| Feature | Tarea | Estado | Owner/Agent | Bloqueador |
|---------|-------|--------|-------------|------------|

## Blocked / Attention Needed

- Ninguno. El feature 001 ha completado la fase de revisión técnica con veredicto Approved.

## Next Actions

- [ ] Abrir Pull Request hacia `develop` mediante `/sdd-gh-pr`
- [ ] Opcional: Validación E2E en navegador mediante `/sdd-e2e`
- [ ] Revisión por pares y merge hacia `develop` mediante `/sdd-gh-merge`

