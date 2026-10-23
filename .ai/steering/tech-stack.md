# Tech Stack Steering — Multiherramientas SEI

> Status: Draft
> Last Updated: 2026-10-23

## Runtime / Platform

- **Plataforma:** Google Chrome Extension (Manifest V3)
- **Runtime:** Chromium Browser Engine / V8
- **Package Manager:** npm (Node.js LTS para tooling, tests y empaquetado)
- **Deployment / Distribución:** Carga desempaquetada en modo desarrollador (`chrome://extensions`) y eventual empaquetado `.zip` para distribución o Chrome Web Store.

## Frontend / UI

- **Estructura:** HTML5 semántico
- **Estilos:** Vanilla CSS moderno (Custom Properties / Design Tokens, diseño responsive, soporte Dark/Light mode, transiciones fluidas, tipografía Inter/Roboto). Sin frameworks CSS pesados innecesarios.
- **Lógica UI:** JavaScript modular (ES Modules) o TypeScript según se decida en el primer feature.
- **Superficie de Extensión:**
  - `side_panel` (Chrome Side Panel API): Vista principal para trabajo continuo junto a la web activa.
  - `action` / Popup: Acceso rápido o selector de herramientas.
  - `options_ui`: Configuración general de módulos y preferencias.
  - `content_scripts`: Inyección contextual en URLs específicas cuando sea estrictamente necesario.

## Storage / State

- **Almacenamiento:** `chrome.storage.local` para persistencia de configuraciones, plantillas y estados locales.
- **Sincronización:** Sin sincronización en nube externa en v1.

## Testing / Verification Commands

| Propósito | Comando | Notas |
|-----------|---------|-------|
| Instalación | `npm install` | Solo dependencias de tooling y pruebas |
| Linter | `npm run lint` | ESLint para estándares de código y seguridad |
| Test Unitarios | `npm test` | Vitest / Jest para lógica pura de las herramientas |
| Build / Pack | `npm run build` | Verificación de empaquetado y manifest válido |
| Verificación E2E | `/sdd-e2e` | Pruebas automáticas en Chromium vía Chrome DevTools MCP |

## Architectural Constraints

- **Manifest V3 Obligatorio:** Service worker de background (`background.js`), sin código remoto ejecutable (`eval` o scripts externos bloqueados por CSP).
- **Principio de Mínimo Privilegio (Permissions):** Declarar exclusivamente los permisos (`tabs`, `storage`, `activeTab`, `sidePanel`) estrictamente indispensables para los módulos activos.
- **Privacidad Absoluta:** Ningún dato personal identificable (PII) de alumnos o maestros debe salir del navegador local.
- **Sin Tailwind a menos que se solicite:** Cumplir con la regla de diseño del workspace priorizando Vanilla CSS rico, moderno y liviano.

## Technical Decisions

| ID | Decisión | Razón | Enlace |
|----|----------|-------|--------|
| TD-001 | Chrome Manifest V3 con Side Panel API | Permite usar las herramientas en paralelo sin cerrar el popup al interactuar con el sistema web | `.ai/steering/tech-stack.md` |
| TD-002 | Arquitectura Modular de Herramientas | Cada herramienta se encapsula como un módulo aislado con su propia vista/lógica para agregarlas gradualmente sin romper las existentes | `.ai/steering/tech-stack.md` |

## Open Questions

- ¿Se prefiere TypeScript con un bundler ligero (ej. Vite / Rollup) o Vanilla JavaScript con ES Modules nativos sin paso de compilación obligatorio?
