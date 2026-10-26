// src/shared/date-utils.js
// Utilidades de normalización y parsing inteligente de fechas

/**
 * Parsea una cadena de fecha flexible y extrae día, mes y año normalizados.
 * Soporta formatos DD/MM/AAAA, DD-MM-AAAA, AAAA-MM-DD y detecta ambigüedad.
 * 
 * @param {string} input - Cadena de fecha a parsear
 * @param {'DMY' | 'MDY'} formatPriority - Preferencia regional ('DMY' = Día/Mes/Año)
 * @returns {{ valid: boolean, day?: number, month?: number, year?: number, isAmbiguous?: boolean, error?: string }}
 */
export function parseDateString(input, formatPriority = 'DMY') {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Entrada vacía o no válida' };
  }

  const clean = input.trim();
  if (!clean) {
    return { valid: false, error: 'Fecha vacía' };
  }

  // 1. Detectar formato ISO: AAAA-MM-DD o AAAA/MM/DD
  const isoMatch = clean.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);

    if (isValidDate(day, month, year)) {
      return { valid: true, day, month, year, isAmbiguous: false };
    }
    return { valid: false, error: 'Fecha ISO inválida en calendario' };
  }

  // 2. Detectar formato tradicional: DD/MM/AAAA o MM/DD/AAAA
  const stdMatch = clean.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/);
  if (stdMatch) {
    const p1 = parseInt(stdMatch[1], 10);
    const p2 = parseInt(stdMatch[2], 10);
    let year = parseInt(stdMatch[3], 10);

    // Ajuste de años de 2 dígitos (ej. 10 -> 2010, 95 -> 1995)
    if (year < 100) {
      year = year < 50 ? 2000 + year : 1900 + year;
    }

    let day, month;
    let isAmbiguous = false;

    // Si ambos son <= 12 y no son iguales, hay ambigüedad entre día y mes
    if (p1 <= 12 && p2 <= 12 && p1 !== p2) {
      isAmbiguous = true;
      if (formatPriority === 'MDY') {
        month = p1;
        day = p2;
      } else {
        day = p1;
        month = p2;
      }
    } else if (p1 > 12) {
      // p1 solo puede ser día (DD/MM)
      day = p1;
      month = p2;
    } else if (p2 > 12) {
      // p2 solo puede ser día (MM/DD)
      month = p1;
      day = p2;
    } else {
      // p1 === p2 (ej. 05/05/2010)
      day = p1;
      month = p2;
    }

    if (isValidDate(day, month, year)) {
      return { valid: true, day, month, year, isAmbiguous };
    }
    return { valid: false, error: 'Día o mes fuera de rango de calendario' };
  }

  return { valid: false, error: 'Formato de fecha no reconocido' };
}

/**
 * Valida si los componentes corresponden a una fecha de calendario real.
 */
export function isValidDate(day, month, year) {
  if (year < 1900 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const daysInMonth = new Date(year, month, 0).getDate();
  return day <= daysInMonth;
}

/**
 * Formatea componentes numéricos a DD/MM/AAAA con ceros a la izquierda.
 */
export function formatDateDMY(day, month, year) {
  const d = String(day).padStart(2, '0');
  const m = String(month).padStart(2, '0');
  return `${d}/${m}/${year}`;
}
