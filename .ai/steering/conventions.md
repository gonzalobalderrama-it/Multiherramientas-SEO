# Conventions Steering — Multiherramientas SEI

> Status: Draft
> Last Updated: 2026-10-23

## Code Style

- **Lenguaje:** JavaScript moderno (ES2022+) / TypeScript.
- **Formato:** 2 espacios de indentación, punto y coma explícito, comillas simples para strings, trailing commas donde aplique.
- **Comentarios:** JSDoc explicativo en funciones públicas y módulos; preservar comentarios funcionales existentes.
- **Manejo de Errores:** Bloques `try/catch` explícitos en llamadas a Chrome APIs; feedback visual comprensible para el usuario, nunca fallar silenciosamente en consola.

## Architecture Patterns

- **Estructura de Directorios Propuesta:**
  ```text
  src/
    manifest.json
    background/
      service-worker.js
    sidepanel/
      index.html
      sidepanel.css
      sidepanel.js
    tools/                     # Cada micro-herramienta aislada
      [tool-name]/
        tool.html (o componente)
        tool.css
        tool.js
        tool.test.js
    shared/                    # Utilidades comunes (storage, dom, formatting)
      storage.js
      ui-utils.js
  ```
- **Modularidad:** Cada herramienta (`tool`) debe declarar:
  - Nombre, icono, descripción.
  - Interfaz de entrada/salida desacoplada.
  - Sin dependencias directas de otras herramientas hermanas.

## Naming Conventions

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Carpetas de herramientas | kebab-case | `tools/attendance-calculator/` |
| Archivos JS/CSS | kebab-case | `list-formatter.js`, `sidepanel.css` |
| Clases | PascalCase | `StorageService`, `DataTransformer` |
| Funciones / Variables | camelCase | `formatStudentList`, `currentSession` |
| Constantes | UPPER_SNAKE_CASE | `STORAGE_KEYS`, `DEFAULT_THEME` |

## Testing Rules

- Lógica de transformación y formateo debe tener pruebas unitarias automatizadas.
- La interfaz visual se valida mediante pruebas de navegador (E2E o inspección con DevTools).

## Security & Privacy Rules

- **No CSP Violations:** Prohibido `unsafe-inline` o `unsafe-eval`.
- **Sanitización:** Todo contenido renderizado dinámicamente en el DOM debe sanitizarse contra XSS (usar `textContent` o plantillas DOM seguras en vez de `innerHTML` arbitrario).
- **Aislamiento de Datos:** La información ingresada en una herramienta no se comparte ni exporta a servicios externos.

## Workflow Rules

- **SDD Lifecycle Invariant:** No escribir código de producción sin spec y tareas aprobadas (`tasks:approved`).
- **Verificación:** Todo cambio debe acompañarse de evidencia observable (comandos de prueba / linter o inspección con DevTools).
- **Commits:** Conventional Commits estructurados (`feat:`, `fix:`, `docs:`, etc.).
