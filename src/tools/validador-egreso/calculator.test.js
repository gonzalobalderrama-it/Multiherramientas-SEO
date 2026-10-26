// src/tools/validador-egreso/calculator.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSeminarGraduation, isBornBeforeJuly1 } from './calculator.js';

describe('Calculator — isBornBeforeJuly1', () => {
  it('reconoce meses 1 a 6 como antes del 1 de julio', () => {
    assert.equal(isBornBeforeJuly1(1, 1), true);
    assert.equal(isBornBeforeJuly1(30, 6), true);
    assert.equal(isBornBeforeJuly1(15, 3), true);
  });

  it('reconoce meses 7 a 12 como a partir del 1 de julio', () => {
    assert.equal(isBornBeforeJuly1(1, 7), false);
    assert.equal(isBornBeforeJuly1(31, 12), false);
    assert.equal(isBornBeforeJuly1(15, 8), false);
  });
});

describe('Calculator — Corte estricto al 1 de Julio y Graduación', () => {
  const ref2026 = new Date(2026, 3, 15); // 15 de Abril de 2026

  it('alumno nacido el 30 de junio ingresa en año + 14 y egresa en año + 17', () => {
    const res = calculateSeminarGraduation(30, 6, 2010, ref2026);
    assert.equal(res.bornBeforeJuly, true);
    assert.equal(res.intakeYear, 2024);
    assert.equal(res.graduationYear, 2027);
    assert.equal(res.ageAtIntake, 14);
    assert.equal(res.ageAtGraduation, 17);
    assert.equal(res.status, 'ELIGIBLE');
    assert.equal(res.isEligible, true);
    assert.equal(res.currentGrade, 3); // 2024 = 1°, 2025 = 2°, 2026 = 3°
  });

  it('alumno nacido el 1 de julio ingresa al ciclo siguiente (año + 15)', () => {
    const res = calculateSeminarGraduation(1, 7, 2010, ref2026);
    assert.equal(res.bornBeforeJuly, false);
    assert.equal(res.intakeYear, 2025);
    assert.equal(res.graduationYear, 2028);
    assert.equal(res.ageAtIntake, 14);
    assert.equal(res.ageAtGraduation, 18);
    assert.equal(res.status, 'ELIGIBLE');
    assert.equal(res.isEligible, true);
    assert.equal(res.currentGrade, 2); // 2025 = 1°, 2026 = 2°
  });

  it('caso real de WISE2 (Pepe Sanchez): 01/01/2010 egresa en 2027', () => {
    const res = calculateSeminarGraduation(1, 1, 2010, ref2026);
    assert.equal(res.intakeYear, 2024);
    assert.equal(res.graduationYear, 2027);
    assert.equal(res.isEligible, true);
  });

  it('alumno nacido en 2012 que cumple 14 el 1 de julio ingresa en 2027 (TOO_YOUNG en 2026)', () => {
    const res = calculateSeminarGraduation(1, 7, 2012, ref2026);
    assert.equal(res.status, 'TOO_YOUNG');
    assert.equal(res.isEligible, false);
    assert.equal(res.intakeYear, 2027); // 2012 + 15
    assert.equal(res.graduationYear, 2030);
  });

  it('alumno nacido en 2012 antes de julio ingresa en 2026 (ELIGIBLE en 2026 - 1° Año)', () => {
    const res = calculateSeminarGraduation(30, 6, 2012, ref2026);
    assert.equal(res.status, 'ELIGIBLE');
    assert.equal(res.isEligible, true);
    assert.equal(res.intakeYear, 2026);
    assert.equal(res.graduationYear, 2029);
    assert.equal(res.currentGrade, 1);
  });

  it('alumno cuyo ciclo ya terminó (nacido 2004 o 2008) es marcado como EXPIRED', () => {
    const res2004 = calculateSeminarGraduation(15, 2, 2004, ref2026);
    assert.equal(res2004.status, 'EXPIRED');
    assert.equal(res2004.isEligible, false);
    assert.equal(res2004.intakeYear, 2018);
    assert.equal(res2004.graduationYear, 2021);

    const res2008 = calculateSeminarGraduation(10, 3, 2008, ref2026);
    assert.equal(res2008.status, 'EXPIRED');
    assert.equal(res2008.isEligible, false);
    assert.equal(res2008.intakeYear, 2022);
    assert.equal(res2008.graduationYear, 2025);
  });
});
