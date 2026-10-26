# SDD Handoff Brief: 001 — Validador de Año de Egreso para Seminario

> Status: Active  
> Readiness: Ready for implementation  
> Updated: 2026-10-23  

## Metadata

- **Spec ID:** `001-validador-egreso`
- **Spec Path:** `.ai/sdd/specs/001-validador-egreso/`
- **Current .status:** `implementation:in-progress`
- **Source Inputs:**
  - `requirements.md` (Approved)
  - `design.md` (Approved)
  - `tasks.md` (Approved)

## Product / Feature Summary

- **User / Audience:** Asistente Administrativo de Seminarios e Institutos (SEI).
- **Problem:** Cálculo manual lento y propenso a errores del año de graduación requerido por WISE2.
- **Outcome:** Automatización del cálculo con corte al 1/Julio, captura con 1 clic en WISE2 y selección automática del año en el formulario.
- **Scope:** Extensión Chrome Manifest V3 con Side Panel, motor determinista `calculator.js`, normalizador `date-utils.js` y conector `wise-connector.js`.
- **Out of Scope:** Almacenamiento en nube, envío automático de formularios o alteración de otros campos de WISE2.

## Requirements Summary

- **Key User Stories:** `US-001` (Captura WISE2), `US-002` (Cálculo directo), `US-003` (Copiado y autoselección).
- **Must Have Functional Requirements:** `FR-001`, `FR-002`, `FR-003`, `FR-004`.
- **Important NFRs:** `NFR-001` (Side Panel), `NFR-002` (Privacidad P-001), `NFR-003` (Confiabilidad y fidelidad).

## Implementation Plan

- **Task Source:** `.ai/sdd/specs/001-validador-egreso/tasks.md`
- **Recommended Order:** `T1 -> T2 -> T3 -> T4 -> T5`
- **Key Tasks:**
  - `T1` — Manifest V3 Shell, Service Worker y Configuración Base (P0)
  - `T2` — Motor de Cálculo Puro, Normalizador de Fechas y Tests Unitarios (P0)
  - `T3` — Interfaz del Validador en Side Panel con Copiado Rápido (P0)
  - `T4` — Conector de WISE2 (Captura de Fecha y Autoselección en Formulario) (P1)
  - `T5` — Integración Final, Estética Visual y Verificación E2E (P1)

## Verification Plan

```text
Command: npm test
Expected: 100% de tests unitarios de fecha, corte al 1/Julio y elegibilidad pasando.
```

- **Required Evidence:** Pruebas unitarias automatizadas (`npm test`), verificación de sintaxis (`node --check`) y validación en navegador Chrome.

## Handoff Readiness

- **Ready for Implementation:** yes
- **Ready for QA:** no (in progress)
- **Ready for Release:** no (in progress)
- **Blockers:** Ninguno
- **Recommended Next Action:** Ejecutar `T1`
