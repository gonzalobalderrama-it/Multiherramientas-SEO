// src/tools/validador-egreso/validador.js
// Controlador de interfaz para el Validador de Egreso e integración con WISE2

import { parseDateString, formatDateDMY } from '../../shared/date-utils.js';
import { calculateSeminarGraduation } from './calculator.js';
import { extractWiseBirthdateScript, applyWiseGraduationYearScript } from '../../content/wise-connector.js';

let currentFormatPriority = 'DMY'; // 'DMY' o 'MDY'
let lastParsedDate = null;
let currentCalculation = null;

/**
 * Inicializa y monta el widget del Validador de Egreso dentro del contenedor provisto.
 * @param {HTMLElement} container - Contenedor del Side Panel
 */
export async function initValidadorEgreso(container) {
  if (!container) return;

  // Cargar plantilla HTML
  try {
    const response = await fetch(new URL('./validador.html', import.meta.url));
    const html = await response.text();
    container.innerHTML = html;
  } catch (err) {
    console.error('[Validador Egreso] Error cargando plantilla HTML:', err);
    return;
  }

  // Elementos del DOM
  const inputBirthdate = container.querySelector('#input-birthdate');
  const inputDatePicker = container.querySelector('#input-date-picker');
  const btnOpenPicker = container.querySelector('#btn-open-picker');
  const btnClearDate = container.querySelector('#btn-clear-date');
  const ambiguityBanner = container.querySelector('#ambiguity-banner');
  const btnToggleFormat = container.querySelector('#btn-toggle-format');

  const stateEmpty = container.querySelector('#state-empty');
  const resultContainer = container.querySelector('#result-container');
  const resultCard = container.querySelector('#result-card');

  const displayGradYear = container.querySelector('#display-grad-year');
  const displayStatusBadge = container.querySelector('#display-status-badge');
  const displayAge = container.querySelector('#display-age');
  const displayIntake = container.querySelector('#display-intake');
  const displayCohort = container.querySelector('#display-cohort');
  const displayMessage = container.querySelector('#display-message');

  const btnCopyYear = container.querySelector('#btn-copy-year');
  const copyText = container.querySelector('#copy-text');
  const copyIcon = container.querySelector('#copy-icon');

  const btnWiseCapture = container.querySelector('#btn-wise-capture');
  const btnWiseApply = container.querySelector('#btn-wise-apply');

  /**
   * Muestra un mensaje de notificación temporal (toast o alert)
   */
  function showFeedback(text, isError = false) {
    let toast = container.querySelector('.sei-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'sei-toast';
      container.appendChild(toast);
    }
    toast.textContent = text;
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 32px);
      max-width: 320px;
      box-sizing: border-box;
      background-color: ${isError ? '#DC2626' : '#059669'};
      color: #FFFFFF;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 12px;
      line-height: 1.4;
      text-align: center;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      z-index: 100;
      animation: fadeIn 0.2s ease-out;
    `;
    setTimeout(() => {
      if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
    }, 4500);
  }

  /**
   * Procesa y valida la fecha ingresada
   */
  function processInput(val) {
    if (!val || !val.trim()) {
      stateEmpty.classList.remove('hidden');
      resultContainer.classList.add('hidden');
      ambiguityBanner.classList.add('hidden');
      btnClearDate.classList.add('hidden');
      currentCalculation = null;
      lastParsedDate = null;
      return;
    }

    btnClearDate.classList.remove('hidden');

    const parsed = parseDateString(val, currentFormatPriority);
    if (!parsed.valid) {
      ambiguityBanner.classList.add('hidden');
      return;
    }

    lastParsedDate = parsed;

    // Mostrar u ocultar banner de ambigüedad
    if (parsed.isAmbiguous) {
      ambiguityBanner.classList.remove('hidden');
    } else {
      ambiguityBanner.classList.add('hidden');
    }

    // Calcular cohorte oficial
    currentCalculation = calculateSeminarGraduation(parsed.day, parsed.month, parsed.year);
    renderResults(currentCalculation);
  }

  /**
   * Renderiza los resultados en el DOM
   */
  function renderResults(res) {
    displayGradYear.textContent = res.graduationYear;
    displayAge.textContent = `${res.currentAge} años cumplidos`;
    displayIntake.textContent = `${res.intakeYear} (${res.ageAtIntake} años)`;
    displayCohort.textContent = `${res.intakeYear} — ${res.graduationYear}`;
    displayMessage.textContent = res.message;

    // Limpiar clases de estado previas
    resultCard.className = 'result-card';

    if (res.status === 'ELIGIBLE') {
      resultCard.classList.add('status-eligible');
      displayStatusBadge.textContent = `Elegible (${res.currentGrade}° Año)`;
    } else if (res.status === 'TOO_YOUNG') {
      resultCard.classList.add('status-too-young');
      displayStatusBadge.textContent = 'Aún es muy joven';
    } else if (res.status === 'EXPIRED') {
      resultCard.classList.add('status-expired');
      displayStatusBadge.textContent = 'Ciclo superado';
    } else {
      resultCard.classList.add('status-over-age');
      displayStatusBadge.textContent = 'Exceso de edad';
    }

    stateEmpty.classList.add('hidden');
    resultContainer.classList.remove('hidden');
  }

  // 1. Escuchar cambios manuales de texto
  inputBirthdate.addEventListener('input', (e) => {
    processInput(e.target.value);
  });

  // 2. Selector nativo de fecha (calendario)
  btnOpenPicker.addEventListener('click', () => {
    if (typeof inputDatePicker.showPicker === 'function') {
      inputDatePicker.showPicker();
    } else {
      inputDatePicker.focus();
    }
  });

  inputDatePicker.addEventListener('change', (e) => {
    if (e.target.value) {
      const [y, m, d] = e.target.value.split('-').map(Number);
      const formatted = formatDateDMY(d, m, y);
      inputBirthdate.value = formatted;
      processInput(formatted);
    }
  });

  // 3. Botón para limpiar entrada
  btnClearDate.addEventListener('click', () => {
    inputBirthdate.value = '';
    inputDatePicker.value = '';
    inputBirthdate.focus();
    processInput('');
  });

  // 4. Conmutar formato en ambigüedad
  btnToggleFormat.addEventListener('click', () => {
    currentFormatPriority = currentFormatPriority === 'DMY' ? 'MDY' : 'DMY';
    btnToggleFormat.textContent = currentFormatPriority === 'DMY' ? 'Intercambiar Día/Mes' : 'Restablecer a Día/Mes';
    processInput(inputBirthdate.value);
  });

  // 5. Copiar Año de Graduación al Portapapeles
  btnCopyYear.addEventListener('click', async () => {
    if (!currentCalculation || !currentCalculation.graduationYear) return;

    const yearStr = String(currentCalculation.graduationYear);
    try {
      await navigator.clipboard.writeText(yearStr);
      btnCopyYear.classList.add('copied');
      copyText.textContent = '¡Copiado!';
      copyIcon.textContent = '✓';

      setTimeout(() => {
        btnCopyYear.classList.remove('copied');
        copyText.textContent = 'Copiar';
        copyIcon.textContent = '📋';
      }, 1800);
    } catch (err) {
      console.warn('[Validador] Error usando Clipboard API:', err);
      showFeedback('No se pudo acceder al portapapeles', true);
    }
  });

  // 6. Botón Capturar de WISE2
  if (btnWiseCapture) {
    btnWiseCapture.addEventListener('click', async () => {
      if (!chrome.tabs || !chrome.scripting) {
        showFeedback('APIs de Chrome no disponibles en este contexto.', true);
        return;
      }

      btnWiseCapture.disabled = true;
      const originalText = btnWiseCapture.querySelector('span').textContent;
      btnWiseCapture.querySelector('span').textContent = 'Leyendo...';

      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) {
          showFeedback('No se detectó una pestaña activa.', true);
          return;
        }

        if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://'))) {
          showFeedback('No se puede interactuar con páginas internas del navegador.', true);
          return;
        }

        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: extractWiseBirthdateScript
        });

        const res = results?.[0]?.result;
        if (res && res.success && res.value) {
          inputBirthdate.value = res.value;
          processInput(res.value);
          showFeedback(`✓ Fecha capturada: ${res.value}`);
        } else {
          showFeedback(res?.error || 'No se localizó la fecha en la página activa.', true);
        }
      } catch (err) {
        const msg = err.message || '';
        if (msg.includes('host') || msg.includes('access')) {
          showFeedback('Permiso requerido: Si estás probando un archivo local, activa "Permitir acceso a URL de archivo" en chrome://extensions. Si estás en WISE, recarga la extensión.', true);
        } else {
          showFeedback('No se pudo acceder a la pestaña: ' + msg, true);
        }
      } finally {
        btnWiseCapture.disabled = false;
        btnWiseCapture.querySelector('span').textContent = originalText;
      }
    });
  }

  // 7. Botón Aplicar en WISE2
  if (btnWiseApply) {
    btnWiseApply.addEventListener('click', async () => {
      if (!currentCalculation || !currentCalculation.graduationYear) return;

      if (!chrome.tabs || !chrome.scripting) {
        showFeedback('APIs de Chrome no disponibles en este contexto.', true);
        return;
      }

      btnWiseApply.disabled = true;
      const originalText = btnWiseApply.querySelector('span').textContent;
      btnWiseApply.querySelector('span').textContent = 'Aplicando...';

      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) {
          showFeedback('No se detectó una pestaña activa.', true);
          return;
        }

        if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://'))) {
          showFeedback('No se puede interactuar con páginas internas del navegador.', true);
          return;
        }

        const targetYear = currentCalculation.graduationYear;
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: applyWiseGraduationYearScript,
          args: [targetYear]
        });

        const res = results?.[0]?.result;
        if (res && res.success) {
          showFeedback(`✓ Graduation Year seleccionado: ${targetYear}`);
          btnWiseApply.querySelector('span').textContent = '✓ ¡Aplicado en WISE2!';
          setTimeout(() => {
            btnWiseApply.querySelector('span').textContent = originalText;
          }, 2000);
        } else {
          showFeedback(res?.error || 'No se pudo aplicar el año en el formulario.', true);
          btnWiseApply.querySelector('span').textContent = originalText;
        }
      } catch (err) {
        const msg = err.message || '';
        if (msg.includes('host') || msg.includes('access')) {
          showFeedback('Permiso requerido: Si estás probando un archivo local, activa "Permitir acceso a URL de archivo" en chrome://extensions. Si estás en WISE, recarga la extensión.', true);
        } else {
          showFeedback('Error comunicando con WISE2: ' + msg, true);
        }
        btnWiseApply.querySelector('span').textContent = originalText;
      } finally {
        btnWiseApply.disabled = false;
      }
    });
  }

  // Helper para pruebas e integraciones programáticas
  window.__seiSetBirthdate = (dateStr) => {
    inputBirthdate.value = dateStr;
    processInput(dateStr);
  };
}
