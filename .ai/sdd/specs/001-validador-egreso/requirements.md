# Feature: 001 — Validador de Año de Egreso para Seminario

> Status: Draft  
> Source: Solicitud directa del Asistente Administrativo de SEI y migración mejorada de [Verificador seminario.html](file:///c:/Users/GonzaloNicolasBalder/OneDrive%20-%20Church%20of%20Jesus%20Christ/Aplicaciones/Multiherramientas%20SEI/Verificador%20seminario.html)  
> Last Updated: 2026-10-23  

## Overview

El **Validador de Año de Egreso para Seminario** es la primera micro-herramienta modular del complemento para Google Chrome Multiherramientas SEI. Permite a los Asistentes Administrativos de Seminarios e Institutos calcular de manera instantánea el año oficial de ingreso, el año de graduación/egreso y el estado de elegibilidad de un alumno en base a su fecha de nacimiento, integrándose fluidamente con la plataforma de registro institucional **WISE2** mediante captura automática de fecha y asistencia en el Side Panel.

## Business Context

- **Problema:** Al completar el perfil de un alumno en WISE2 (pantalla *"Complete the student profile"*), el sistema solicita obligatoriamente el campo **Graduation Year**, mientras que en la ficha del alumno solo figura la fecha de nacimiento (**Birthdate**). Actualmente el usuario debe calcular mentalmente el año de egreso o abrir una herramienta HTML externa en otra ventana, seleccionar día/mes/año en tres menús desplegables separados y luego volver a WISE2 a buscar el año correspondiente.
- **Usuarios:** Asistentes Administrativos y personal de apoyo de Seminarios e Institutos de Religión (Área SAS / Mendoza y afines).
- **Valor:** Reduce drásticamente el tiempo de registro por alumno, elimina el riesgo de error humano en el cálculo del corte de edad y permite completar registros en WISE2 en segundos sin salir de la misma pantalla.
- **Señal de éxito:** El usuario puede obtener el año de graduación con un solo clic o selección en WISE2 y registrar al alumno sin fricción.

## Goals

- Automatizar el cálculo de elegibilidad, año de ingreso y año de graduación aplicando las reglas oficiales de Seminarios (corte estricto al 1 de Julio).
- Proveer un método de captura con 1 solo clic desde el campo de fecha de nacimiento (`Birthdate`) de la pestaña activa en WISE2.
- Ofrecer una interfaz minimalista, ágil y visualmente agradable integrada en el **Side Panel** de Chrome que no obstaculice la navegación.
- Permitir la copia inmediata del año de graduación o su autoselección directa en el campo desplegable `Graduation Year` de WISE2.

## Non-Goals / Out of Scope

- No se realizarán envíos automáticos del formulario en WISE2 (el guardado final siempre es ejecutado manualmente por el usuario).
- No se almacenarán nombres, documentos ni fechas de nacimiento de los alumnos en bases de datos o almacenamiento persistente (`P-001: Privacidad Absoluta`).
- No se soporta en este feature la modificación de otros campos de WISE2 (género, tipo de alumno, fotos de perfil).
- No se implementarán reglas de otros programas (como Instituto o cursos avanzados) en este validador específico de Seminario.

---

## User Stories

### US-001: Captura automática y cálculo desde WISE2
**Como** Asistente Administrativo de SEI  
**Quiero** capturar la fecha de nacimiento directamente desde la página activa de WISE2 con un clic o al interactuar con el campo `Birthdate`  
**Para** que la extensión determine de inmediato el año de egreso sin tener que reescribir la fecha manualmente.

**Criterios de Aceptación:**
- [ ] La extensión detecta si la pestaña activa corresponde a WISE2 o un formulario web compatible.
- [ ] Al presionar un botón *"Capturar de WISE"* o enfocar el campo de nacimiento en WISE2, se extrae la fecha (`DD/MM/AAAA` o equivalente).
- [ ] El año de graduación, año de ingreso y elegibilidad se computan y muestran en el Side Panel en menos de 50 milisegundos.

### US-002: Cálculo manual rápido en Side Panel
**Como** Asistente Administrativo de SEI  
**Quiero** poder ingresar o pegar una fecha de nacimiento directamente en el Side Panel  
**Para** verificar la cohorte y elegibilidad de un alumno proveniente de correos, planillas Excel o consultas telefónicas sin depender de tener WISE2 abierto.

**Criterios de Aceptación:**
- [ ] Dispone de un campo de entrada único y ágil (con soporte para selector de fecha nativo y pegado de texto libre en formatos `DD/MM/AAAA`, `DD-MM-AAAA` o `AAAA-MM-DD`).
- [ ] El resultado se actualiza de forma reactiva al completar o cambiar la fecha, sin necesidad de pulsar un botón de enviar.
- [ ] Muestra de forma clara: Edad actual calculada, Estado de elegibilidad (Apto / Fuera de edad / Aún no tiene edad), Año de Ingreso y Año de Graduación destacado.

### US-003: Aplicación rápida en WISE2 y Copiado
**Como** Asistente Administrativo de SEI  
**Quiero** copiar el año de egreso al portapapeles o seleccionarlo automáticamente en el desplegable de WISE2 con un solo botón  
**Para** completar el campo obligatorio *Graduation Year* en un instante.

**Criterios de Aceptación:**
- [ ] El año de graduación se muestra con tipografía destacada y un botón de "Copiar año".
- [ ] Si la pestaña activa tiene el selector `Graduation Year` de WISE2, se ofrece un botón *"Aplicar en WISE2"* que selecciona automáticamente el año calculado en el desplegable.

---

## Functional Requirements

### FR-001: Cálculo de Año de Ingreso y Graduación (Regla del 1 de Julio) — Must Have

- **Regla de Negocio:**
  - `bornBeforeJuly`: El alumno nació entre el 1 de enero y el 30 de junio inclusive (mes < 7).
  - Si `bornBeforeJuly == true`: `intakeYear = añoNacimiento + 14`.
  - Si `bornBeforeJuly == false`: `intakeYear = añoNacimiento + 15` (cumple 14 años del 1 de julio en adelante, ingresa al ciclo lectivo siguiente).
  - Duración del programa: 4 años lectivos exactos.
  - `graduationYear = intakeYear + 3`.

- **Sintaxis EARS:**
  - `WHEN una fecha de nacimiento válida es provista, THE SYSTEM SHALL calcular el año de ingreso oficial aplicando el corte de edad al 1 de Julio y proyectar el año de graduación sumando 3 años lectivos al año de ingreso.`

### FR-002: Evaluación de Elegibilidad para el Ciclo Lectivo Actual — Must Have

- **Sintaxis EARS:**
  - `WHILE se procesa el cálculo para el año en curso (currentYear):`
    - `IF currentYear > graduationYear, THEN THE SYSTEM SHALL marcar al alumno como "Fuera de edad (Ciclo superado)", informando la cohorte teórica que le correspondía.`
    - `IF currentYear < intakeYear, THEN THE SYSTEM SHALL marcar al alumno como "Aún no entra (Muy joven)", indicando que podrá ingresar en el ciclo lectivo oficial intakeYear.`
    - `IF el alumno cumple 18 años antes del 1 de julio del año lectivo (currentYear >= añoNacimiento + 18 cuando nació antes del 1/jul, o currentYear >= añoNacimiento + 19 cuando nació de julio en adelante), THEN THE SYSTEM SHALL marcarlo como "Exceso de edad reglamentaria".`
    - `IF el alumno tiene entre 14 y 17 años cumplidos al 1 de julio del año actual, THEN THE SYSTEM SHALL marcar al alumno como "Elegible / En edad", mostrando además el grado de cursado actual ((currentYear - intakeYear) + 1).`

### FR-003: Captura Contextual de Fecha desde WISE2 — Must Have

- **Sintaxis EARS:**
  - `WHEN el usuario presiona "Capturar de WISE" en el Side Panel o selecciona el campo de fecha de nacimiento en la pestaña activa de WISE2, THE SYSTEM SHALL leer el valor del input de fecha (birthdate), normalizar el formato a día, mes y año, y ejecutar el cálculo automáticamente sin recargar la página.`
  - `IF el campo de fecha en WISE2 está vacío o no contiene una fecha válida, THEN THE SYSTEM SHALL mostrar un mensaje de estado informativo ("Selecciona o ingresa una fecha en WISE2") sin arrojar errores en consola.`

### FR-004: Entrada Manual y Normalización de Formatos — Must Have

- **Sintaxis EARS:**
  - `THE SYSTEM SHALL proveer en el Side Panel un control de fecha de fácil acceso que permita tanto la selección visual mediante calendario como la escritura o pegado de fechas en formatos DD/MM/AAAA, DD-MM-AAAA o AAAA-MM-DD.`
  - `IF la fecha ingresada es inválida o incompleta, THEN THE SYSTEM SHALL mantener oculto o deshabilitado el panel de resultados hasta contar con día, mes y año válidos.`

### FR-005: Copia Rápida al Portapapeles — Should Have

- **Sintaxis EARS:**
  - `WHEN el usuario hace clic en el botón o tarjeta del año de graduación en el Side Panel, THE SYSTEM SHALL copiar el número de 4 dígitos del año de egreso al portapapeles del sistema operativo y mostrar una confirmación visual temporal ("¡Copiado!").`

### FR-006: Autoselección en el Formulario de WISE2 — Should Have

- **Sintaxis EARS:**
  - `WHERE la pestaña activa de Chrome contiene el selector de "Graduation Year" de WISE2, THE SYSTEM SHALL habilitar la opción de seleccionar automáticamente dicho año en el desplegable web al hacer clic en "Aplicar en WISE2", disparando los eventos de cambio (change/input) requeridos por el framework de WISE2.`

### FR-007: Detección y Conmutación de Formato Regional — Could Have

- **Sintaxis EARS:**
  - `IF una fecha capturada de WISE2 contiene valores de día y mes donde ambos son <= 12 (ej. 03/05/2010), THE SYSTEM SHALL aplicar por defecto DD/MM/AAAA y ofrecer un interruptor sutil para alternar a MM/DD/AAAA si el usuario advierte una inversión de mes y día.`

---

## Non-Functional Requirements

### NFR-001: Usabilidad e Integración
- La herramienta debe residir en el Side Panel de Google Chrome, permitiendo al usuario ver y operar WISE2 simultáneamente en la ventana principal.
- El tiempo entre la captura/ingreso de la fecha y la presentación del año de graduación debe ser inferior a **50 milisegundos**.

### NFR-002: Privacidad y Confidencialidad (Principio P-001)
- La extensión procesará las fechas exclusivamente en la memoria volátil de la sesión.
- Ningún dato de alumnos (fecha de nacimiento, nombre, ID de WISE) será transmitido a servidores externos ni guardado en cookies o analíticas.

### NFR-003: Confiabilidad y Fidelidad de Reglas
- Los resultados de cálculo de ingreso, graduación y grado de cursado deben coincidir al 100% con los resultados matemáticos certificados en el archivo [Verificador seminario.html](file:///c:/Users/GonzaloNicolasBalder/OneDrive%20-%20Church%20of%20Jesus%20Christ/Aplicaciones/Multiherramientas%20SEI/Verificador%20seminario.html).

### NFR-004: Estética Visual y Calidad de UI
- Interfaz moderna, limpia y elegante basada en Vanilla CSS con tipografía Inter.
- Tarjetas de resultado con colores semánticos claros: Verde esmeralda para elegibles con año destacado, y tonos cálidos/neutros para casos fuera de edad.

---

## Decisions

### D-001: Modalidad de Operación Híbrida (Side Panel + Integración Contextual)
- **Decisión:** La herramienta vivirá como vista en el Side Panel de Chrome con capacidades bidireccionales con la página de WISE2 (lectura de `Birthdate` y escritura/selección en `Graduation Year`), complementada con entrada manual independiente.
- **Razón:** Ofrece la máxima ergonomía de trabajo al no tener que alternar entre ventanas ni cubrir la pantalla con popups emergentes efímeros.
- **Fuente:** Elección explícita del usuario en clarificación guiada Q-001.
- **Impacta:** US-001, US-002, US-003, FR-003, FR-006.

### D-002: Parsing Inteligente con Prioridad Regional
- **Decisión:** El parser de fecha priorizará el estándar regional latinoamericano `DD/MM/AAAA`, incorporando detección de ambigüedad cuando día y mes sean ambos $\le 12$.
- **Razón:** WISE2 en el Área Sudamérica Sur (Argentina, Chile, Uruguay, Paraguay) opera usualmente con formato día/mes/año, pero el sistema base de Church of Jesus Christ a veces refleja configuraciones de navegador en inglés.
- **Fuente:** Elección explícita del usuario en clarificación guiada Q-002.
- **Impacta:** FR-004, FR-007.

---

## Questions

### Q-001: Modo de interacción con WISE2
- **Estado:** answered  
- **Respuesta:** Enfoque híbrido: Side Panel con botón 'Capturar de WISE' / entrada manual + botón para copiar o autoseleccionar en WISE2.  
- **Decisión:** D-001.

### Q-002: Formato de fecha en campo de nacimiento
- **Estado:** answered  
- **Respuesta:** Detección automática inteligente priorizando DD/MM/AAAA por la región, con opción de alternar en ambigüedad.  
- **Decisión:** D-002.

---

## Success Metrics

| Métrica | Señal / Objetivo | Notas |
|---------|------------------|-------|
| Tiempo de determinación de año de egreso | < 3 segundos por alumno | Ahorro considerable frente al cálculo manual o herramienta externa |
| Precisión de cohorte y graduación | 100% de coincidencia con la norma de SEI | Cero errores de asignación de cohorte |
| Facilidad de uso percibida | 1 solo clic para capturar y 1 clic para aplicar/copiar | Flujo continuo |

## Risks and Mitigations

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Cambios en los nombres de selectores o DOM de WISE2 en futuras actualizaciones | Medio | Usar selectores resilientes (por etiqueta `Birthdate`, tipo `input[type="date"]` o atributos semánticos) y mantener siempre disponible el modo manual en el Side Panel. |
| Permisos de extensión invasivos | Bajo | Limitar los permisos en `manifest.json` a `activeTab`, `sidePanel` y `scripting`, sin solicitar acceso amplio e innecesario a todo el historial o sitios web ajenos. |

## Glossary

- **WISE2:** Sistema web de administración y registro escolar de Seminarios e Institutos de Religión.
- **Birthdate:** Campo de fecha de nacimiento en el perfil del alumno en WISE2.
- **Graduation Year:** Campo obligatorio en WISE2 que indica el año calendario en el que el alumno completa su 4° año de Seminario.
- **Corte del 1 de Julio:** Norma oficial de edad para Seminario: el estudiante debe cumplir 14 años antes del 1 de julio del ciclo lectivo para poder iniciar el año 1 de Seminario en ese periodo.
