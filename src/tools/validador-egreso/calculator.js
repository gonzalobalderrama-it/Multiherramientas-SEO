// src/tools/validador-egreso/calculator.js
// Motor matemático y reglas de elegibilidad para Seminario de Religión (Área SAS / Mendoza)

/**
 * Determina si el nacimiento ocurrió antes del 1 de julio (hasta el 30 de junio inclusive).
 * @param {number} day - Día del mes (1-31)
 * @param {number} month - Mes del año (1-12)
 * @returns {boolean}
 */
export function isBornBeforeJuly1(day, month) {
  return month < 7;
}

/**
 * Calcula la cohorte oficial, el año de graduación y el estado de elegibilidad de un alumno.
 * 
 * Reglas certificadas:
 * 1. Corte estricto al 1 de Julio: Tener 14 años cumplidos antes del 1 de Julio del año de ingreso.
 * 2. Si nació de enero a junio (meses 1 a 6): ingresa en (año + 14).
 * 3. Si nació de julio a diciembre (meses 7 a 12): ingresa en (año + 15).
 * 4. Duración: 4 años lectivos exactos (Año 1, 2, 3 y 4 de egreso) -> Graduación = ingreso + 3.
 * 
 * @param {number} day - Día de nacimiento (1-31)
 * @param {number} month - Mes de nacimiento (1-12)
 * @param {number} year - Año de nacimiento (ej. 2010)
 * @param {Date} [referenceDate=new Date()] - Fecha de referencia para el cálculo de edad actual y ciclo lectivo
 * @returns {object} Resultado completo con cohorte, estado y mensajes
 */
export function calculateSeminarGraduation(day, month, year, referenceDate = new Date()) {
  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth() + 1; // 1-12
  const currentDay = referenceDate.getDate();

  // 1. Calcular Edad Actual Exacta cumplida a la fecha de referencia
  let currentAge = currentYear - year;
  if (currentMonth < month || (currentMonth === month && currentDay < day)) {
    currentAge--;
  }

  // 2. Determinar Año de Ingreso Oficial (Año 1 de Seminario)
  const bornBeforeJuly = isBornBeforeJuly1(day, month);
  const intakeYear = bornBeforeJuly ? (year + 14) : (year + 15);

  // 3. Duración del Programa: 4 años lectivos continuos
  const graduationYear = intakeYear + 3;
  const ageAtIntake = 14;
  const ageAtGraduation = graduationYear - year;

  // 4. Verificación de elegibilidad para el ciclo lectivo actual
  let status = 'ELIGIBLE';
  let isEligible = false;
  let title = '';
  let message = '';
  let currentGrade = null;

  if (currentYear > graduationYear) {
    status = 'EXPIRED';
    isEligible = false;
    title = 'No entra en el programa (Fuera de edad)';
    message = `El alumno ya superó el rango de edad para Seminario. Su ciclo de cursado de 4 años correspondió al periodo ${intakeYear} — ${graduationYear}.`;
  } else if (currentYear < intakeYear) {
    status = 'TOO_YOUNG';
    isEligible = false;
    title = 'No entra este año (Aún es muy joven)';
    message = `No cumple 14 años antes del 1 de julio de ${currentYear}. Podrá ingresar oficialmente al Seminario en el año lectivo ${intakeYear}.`;
  } else {
    // Verificar límite superior de edad: cumplir 18 años antes del 1 de julio lo deja fuera
    const age18Year = bornBeforeJuly ? (year + 18) : (year + 19);

    if (currentYear >= age18Year) {
      status = 'OVER_AGE';
      isEligible = false;
      title = 'No entra en el programa (Exceso de edad)';
      message = 'Cumplió o cumple 18 años antes del 1 de julio de este ciclo lectivo, por lo que excede el límite de edad para ingresar o continuar en Seminario.';
    } else {
      status = 'ELIGIBLE';
      isEligible = true;
      currentGrade = (currentYear - intakeYear) + 1;
      title = '¡Sí entra en el programa!';
      message = `El alumno cumple con los requisitos (tiene entre 14 y 17 años al 1 de julio). Actualmente le corresponde cursar el ${currentGrade}° Año de Seminario.`;
    }
  }

  return {
    day,
    month,
    year,
    currentAge,
    bornBeforeJuly,
    intakeYear,
    graduationYear,
    ageAtIntake,
    ageAtGraduation,
    status,
    isEligible,
    currentGrade,
    title,
    message
  };
}
