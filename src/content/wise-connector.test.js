// src/content/wise-connector.test.js
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { extractWiseBirthdateScript, applyWiseGraduationYearScript } from './wise-connector.js';

describe('WISE Connector — Scripts de Inyección', () => {
  let originalDocument;

  beforeEach(() => {
    originalDocument = globalThis.document;
  });

  afterEach(() => {
    globalThis.document = originalDocument;
  });

  it('extractWiseBirthdateScript detecta input con nombre o id que contiene birth', () => {
    globalThis.document = {
      activeElement: null,
      querySelector: (selector) => {
        if (selector.includes('birth')) {
          return { value: '01/01/2010' };
        }
        return null;
      },
      querySelectorAll: () => []
    };

    const res = extractWiseBirthdateScript();
    assert.equal(res.success, true);
    assert.equal(res.value, '01/01/2010');
  });

  it('extractWiseBirthdateScript retorna error amigable si el campo está vacío', () => {
    globalThis.document = {
      activeElement: null,
      querySelector: (selector) => {
        if (selector.includes('birth')) {
          return { value: '' };
        }
        return null;
      },
      querySelectorAll: () => []
    };

    const res = extractWiseBirthdateScript();
    assert.equal(res.success, false);
    assert.match(res.error, /vacío/i);
  });

  it('applyWiseGraduationYearScript localiza select y selecciona la opción coincidente', () => {
    let dispatchedEvents = [];
    let selectedValue = null;

    const mockSelect = {
      tagName: 'SELECT',
      options: [
        { value: '', textContent: '-- Select --' },
        { value: '2026', textContent: '2026' },
        { value: '2027', textContent: '2027' },
        { value: '2028', textContent: '2028' }
      ],
      set value(v) { selectedValue = v; },
      get value() { return selectedValue; },
      dispatchEvent: (e) => { dispatchedEvents.push(e.type); }
    };

    globalThis.document = {
      querySelector: (selector) => {
        if (selector.includes('graduation')) return mockSelect;
        return null;
      },
      querySelectorAll: () => []
    };

    // Global Event polyfill si es necesario
    if (typeof globalThis.Event === 'undefined') {
      globalThis.Event = class { constructor(type) { this.type = type; } };
    }

    const res = applyWiseGraduationYearScript(2027);
    assert.equal(res.success, true);
    assert.equal(res.selectedYear, '2027');
    assert.equal(selectedValue, '2027');
    assert.equal(dispatchedEvents.includes('change'), true);
    assert.equal(dispatchedEvents.includes('input'), true);
  });
});
