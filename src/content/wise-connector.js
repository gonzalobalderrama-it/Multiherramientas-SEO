// src/content/wise-connector.js
// Conector contextual para la plataforma WISE2 (Seminarios e Institutos)

/**
 * Función inyectable en la pestaña activa para extraer el valor del campo Birthdate.
 * @returns {{ success: boolean, value?: string, error?: string }}
 */
export function extractWiseBirthdateScript() {
  try {
    // 1. Si el usuario tiene un input enfocado actualmente
    const active = document.activeElement;
    if (active && active.tagName === 'INPUT' && active.value) {
      const isDateLike = /^\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}$/.test(active.value.trim()) ||
                         /^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}$/.test(active.value.trim());
      if (isDateLike) {
        return { success: true, value: active.value.trim() };
      }
    }

    // 2. Búsqueda por selectores de atributos comunes en WISE2
    const selectors = [
      'input[name*="birth" i]',
      'input[id*="birth" i]',
      'input[aria-label*="birth" i]',
      'input[formcontrolname*="birth" i]',
      'input[data-testid*="birth" i]',
      'input[placeholder*="birth" i]',
      'input[name*="nacimiento" i]',
      'input[id*="nacimiento" i]',
      'input[type="date"]'
    ];

    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const val = el.value ? el.value.trim() : '';
        if (val) {
          return { success: true, value: val };
        }
        return { success: false, error: 'Se encontró el campo de nacimiento en WISE2, pero está vacío.' };
      }
    }

    // 3. Búsqueda por texto en etiquetas (<label> o encabezados de campo)
    const labels = Array.from(document.querySelectorAll('label, span, div'));
    const birthLabel = labels.find(l => {
      const txt = l.textContent ? l.textContent.trim().toLowerCase() : '';
      return (txt === 'birthdate' || txt === 'fecha de nacimiento' || txt.startsWith('birthdate'));
    });

    if (birthLabel) {
      // Buscar input asociado por for="..."
      const forId = birthLabel.getAttribute('for');
      if (forId) {
        const input = document.getElementById(forId);
        if (input && input.value) return { success: true, value: input.value.trim() };
      }

      // Buscar input dentro del mismo contenedor o contenedor hermano
      const container = birthLabel.closest('div') || birthLabel.parentElement;
      if (container) {
        const input = container.querySelector('input') || container.nextElementSibling?.querySelector('input');
        if (input) {
          if (input.value) return { success: true, value: input.value.trim() };
          return { success: false, error: 'El campo Birthdate en WISE2 no tiene una fecha cargada aún.' };
        }
      }
    }

    // 4. Fallback: buscar cualquier input que contenga una fecha válida
    const allInputs = Array.from(document.querySelectorAll('input[type="text"]'));
    for (const inp of allInputs) {
      if (inp.value && /^\d{1,2}[-/.]\d{1,2}[-/.]\d{4}$/.test(inp.value.trim())) {
        return { success: true, value: inp.value.trim() };
      }
    }

    return {
      success: false,
      error: 'No se detectó el campo de fecha de nacimiento en esta página. Asegúrate de estar en la ficha de alumno de WISE2.'
    };
  } catch (err) {
    return { success: false, error: 'Error al inspeccionar la página: ' + err.message };
  }
}

/**
 * Función inyectable para autoseleccionar el año en el dropdown Graduation Year de WISE2.
 * @param {number|string} graduationYear - Año de graduación a seleccionar (ej. 2027)
 * @returns {{ success: boolean, selectedYear?: string, error?: string }}
 */
export function applyWiseGraduationYearScript(graduationYear) {
  try {
    const yearStr = String(graduationYear).trim();

    // 1. Buscar selectores nativos por atributos
    const selectors = [
      'select[name*="graduation" i]',
      'select[id*="graduation" i]',
      'select[aria-label*="graduation" i]',
      'select[formcontrolname*="graduation" i]',
      'select[name*="egreso" i]',
      'select[id*="egreso" i]'
    ];

    let selectEl = null;
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        selectEl = el;
        break;
      }
    }

    // 2. Si no se halló por atributos directos, buscar por etiqueta contenedora
    if (!selectEl) {
      const labels = Array.from(document.querySelectorAll('label, span, div'));
      const gradLabel = labels.find(l => {
        const txt = l.textContent ? l.textContent.trim().toLowerCase() : '';
        return (txt === 'graduation year' || txt.includes('año de graduación') || txt === 'graduation');
      });

      if (gradLabel) {
        const forId = gradLabel.getAttribute('for');
        if (forId) selectEl = document.getElementById(forId);

        if (!selectEl) {
          const container = gradLabel.closest('div') || gradLabel.parentElement;
          if (container) {
            selectEl = container.querySelector('select') || container.nextElementSibling?.querySelector('select');
          }
        }
      }
    }

    // 3. Aplicar valor en elemento <select>
    if (selectEl && selectEl.tagName === 'SELECT') {
      const options = Array.from(selectEl.options);
      const match = options.find(opt => {
        return opt.value === yearStr || (opt.textContent && opt.textContent.includes(yearStr));
      });

      if (match) {
        selectEl.value = match.value;
        selectEl.dispatchEvent(new Event('input', { bubbles: true }));
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        return { success: true, selectedYear: yearStr };
      } else {
        return {
          success: false,
          error: `El selector en WISE2 no contiene la opción del año ${yearStr}.`
        };
      }
    }

    // 4. Soporte para selectores personalizados (tipo Angular Material / custom dropdown)
    const customDropdown = document.querySelector('[role="combobox"], [aria-haspopup="listbox"], mat-select');
    if (customDropdown) {
      customDropdown.focus();
      return {
        success: false,
        error: `Se detectó el selector interactivo. Selecciona la opción ${yearStr} en el menú desplegable abierto.`
      };
    }

    return {
      success: false,
      error: 'No se encontró el selector de "Graduation Year" en la página activa.'
    };
  } catch (err) {
    return { success: false, error: 'Error al aplicar en el formulario: ' + err.message };
  }
}
