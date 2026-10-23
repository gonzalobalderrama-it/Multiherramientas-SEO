# Product Steering — Multiherramientas SEI

> Status: Draft
> Last Updated: 2026-10-23

## Product Vision

Multiherramientas SEI es una extensión para Google Chrome (Manifest V3) concebida como una suite modular de utilidades y asistentes diseñada específicamente para optimizar la productividad diaria del Asistente Administrativo de Seminarios e Institutos de Religión (SEI). Centraliza automatizaciones, validadores y atajos para agilizar tareas repetitivas en plataformas institucionales y gestión de datos.

## Problem We Solve

- **Tareas manuales y repetitivas:** Carga, verificación y formateo manual de datos de alumnos, clases, asistencia y registros administrativos.
- **Dispersión de herramientas:** Necesidad de alternar entre múltiples pestañas, hojas de cálculo y utilidades externas mientras se opera en los sistemas de SEI.
- **Riesgo de error humano:** Errores tipográficos o de formato en identificadores, registros y reportes rutinarios.

## Target Users / Personas

### Asistente Administrativo de Seminarios e Institutos (SEI)

- **Rol:** Gestión operativa, soporte administrativo a coordinadores, directores y maestros, actualización de registros en plataformas institucionales (ej. WISE y portales asociados).
- **Necesidades:** Agilidad en tareas operativas, rapidez para procesar listas de alumnos, atajos para acciones frecuentes.
- **Dolores:** Procesos manuales lentos, copiado y pegado recurrente, validación visual propensa a fatiga.
- **Objetivos:** Reducir tiempos en tareas rutinarias, asegurar precisión de datos y mantener el foco en la atención y servicio.

## Value Proposition

Una herramienta integrada directamente en el navegador Chrome que acompaña el flujo de trabajo del usuario en tiempo real (mediante Side Panel / Popup), aportando herramientas modulares creadas a medida para la realidad administrativa de SEI, sin depender de software de terceros ni comprometer la privacidad.

## Core Use Cases

| Caso de Uso | Persona Primaria | Valor | Notas |
|-------------|------------------|-------|-------|
| Automatización / atajos en portales SEI | Asistente Administrativo | Ahorro de tiempo en clics y navegación repetitiva | Inyección segura o lectura contextual |
| Formateo y transformación de listas/datos | Asistente Administrativo | Conversión rápida de datos para reportes o cargas masivas | Procesamiento local en memoria |
| Verificación rápida de registros | Asistente Administrativo | Detección inmediata de anomalías o campos faltantes | Validación previa a guardado |
| Utilidades auxiliares (fechas, plantillas, notas) | Asistente Administrativo | Acceso inmediato a recursos de uso constante | Almacenamiento local |

## Product Boundaries

### In Scope

- Arquitectura de extensión de Chrome bajo estándar Manifest V3.
- Enfoque modular donde cada utilidad puede habilitarse, probarse y versionarse como un módulo independiente.
- Interfaz integrada (preferentemente Chrome Side Panel y/o Popup) accesible durante la navegación.
- Procesamiento 100% del lado del cliente (client-side) en navegador con `chrome.storage.local`.

### Out of Scope (v1)

- Servidores de backend propietarios o almacenamiento en la nube de terceros.
- Manipulación no autorizada de credenciales o bypass de mecanismos de seguridad institucional.
- Recolección de telemetría analítica o rastreo de usuarios.

## Success Metrics

| Métrica | Señal / Objetivo | Por qué importa |
|---------|------------------|-----------------|
| Reducción de tiempo en tareas repetitivas | Ahorro cualitativo perceptible en flujos rutinarios | Principal valor de productividad |
| Cero incidentes de pérdida o filtración de datos | 100% de operaciones locales y seguras | Cumplimiento y privacidad institucional |
| Modularidad y facilidad de adición | Incorporar una nueva herramienta requiere <1 sprint SDD | Escalabilidad del kit de herramientas |

## Domain Glossary

- **SEI:** Seminarios e Institutos de Religión (The Church of Jesus Christ of Latter-day Saints).
- **WISE:** Sistema institucional web para la administración de alumnos, cursos, asistencias y graduaciones de SEI.
- **Manifest V3:** Especificación moderna para extensiones de Google Chrome basada en Service Workers y permisos declarativos.
- **Side Panel:** Panel lateral nativo del navegador Chrome que permite mantener abierta la extensión mientras se interactúa con las páginas web.

## Open Questions

- ¿Cuáles son las 2 o 3 primeras tareas repetitivas concretas que causan mayor fricción hoy en día? (Para priorizar en `/sdd-plan` o `/sdd-idea`).
- ¿Las utilidades interactuarán directamente con el DOM de las páginas institucionales mediante Content Scripts o serán principalmente herramientas independientes de apoyo (calculadoras, convertidores, portapapeles, plantillas) ejecutadas en el panel?
