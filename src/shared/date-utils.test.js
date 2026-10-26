// src/shared/date-utils.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseDateString, isValidDate, formatDateDMY } from './date-utils.js';

describe('Date Utilities — parseDateString', () => {
  it('parsea correctamente formato DD/MM/AAAA sin ambigüedad', () => {
    const res = parseDateString('25/08/2010');
    assert.equal(res.valid, true);
    assert.equal(res.day, 25);
    assert.equal(res.month, 8);
    assert.equal(res.year, 2010);
    assert.equal(res.isAmbiguous, false);
  });

  it('detecta ambigüedad cuando día y mes son ambos <= 12', () => {
    const resDMY = parseDateString('03/07/2010', 'DMY');
    assert.equal(resDMY.valid, true);
    assert.equal(resDMY.day, 3);
    assert.equal(resDMY.month, 7);
    assert.equal(resDMY.isAmbiguous, true);

    const resMDY = parseDateString('03/07/2010', 'MDY');
    assert.equal(resMDY.valid, true);
    assert.equal(resMDY.day, 7);
    assert.equal(resMDY.month, 3);
    assert.equal(resMDY.isAmbiguous, true);
  });

  it('no marca ambigüedad si día y mes son idénticos', () => {
    const res = parseDateString('05/05/2010');
    assert.equal(res.valid, true);
    assert.equal(res.day, 5);
    assert.equal(res.month, 5);
    assert.equal(res.isAmbiguous, false);
  });

  it('parsea formato ISO AAAA-MM-DD correctamente', () => {
    const res = parseDateString('2010-06-30');
    assert.equal(res.valid, true);
    assert.equal(res.day, 30);
    assert.equal(res.month, 6);
    assert.equal(res.year, 2010);
    assert.equal(res.isAmbiguous, false);
  });

  it('soporta delimitadores con guión o punto (ej. 15-09-2010)', () => {
    const res = parseDateString('15-09-2010');
    assert.equal(res.valid, true);
    assert.equal(res.day, 15);
    assert.equal(res.month, 9);
    assert.equal(res.year, 2010);
  });

  it('rechaza fechas con mes o día fuera de rango', () => {
    assert.equal(parseDateString('32/01/2010').valid, false);
    assert.equal(parseDateString('29/02/2011').valid, false); // No bisiesto
    assert.equal(parseDateString('29/02/2012').valid, true);  // Bisiesto
    assert.equal(parseDateString('').valid, false);
    assert.equal(parseDateString('texto-invalido').valid, false);
  });
});

describe('Date Utilities — formatDateDMY', () => {
  it('formatea con ceros a la izquierda', () => {
    assert.equal(formatDateDMY(1, 1, 2010), '01/01/2010');
    assert.equal(formatDateDMY(15, 11, 2010), '15/11/2010');
  });
});
