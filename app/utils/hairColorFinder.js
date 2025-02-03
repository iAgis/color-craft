function calculateToneHeight(tones) {
  const calculatePairAverage = (tones) => {
    return tones.reduce((acc, tone, index, array) => {
      if (index % 2 === 0) {
        const nextTone = array[index + 1];
        if (nextTone !== undefined) {
          const avgTone = (Math.floor(tone) + Math.floor(nextTone)) / 2;
          acc.push(avgTone);
        } else {
          acc.push(tone);
        }
      }
      return acc;
    }, []);
  };

  return tones.length === 1
    ? tones[0]
    : calculateToneHeight(calculatePairAverage(tones));
}

function extractColors(tones) {
  return tones.map((tone) => {
    const strTone = tone.toString();
    const [_, decimals] = strTone.split(".");
    const primary = decimals?.[0] || 0;
    const secondary = decimals?.[1] || 0;
    return { primary, secondary };
  });
}

/**
 *
 * @param {*} color1
 * @param {*} color2
 * @returns Calculated mixed color .YZ
 */
function mixColors(color1, color2) {
  const y = color1.primary;
  const y2 = color2.primary;
  const yRes = plusHighlights(y, y2);

  const z = color1.secondary;
  const z2 = color2.secondary;
  const zRes = plusHighlights(z, z2);

  return { primary: yRes, secondary: zRes };
}

const colores = [
  { numero: 0, color: "Marrón", grados: 0, profundidad: 0 }, // Neutro
  { numero: 1, color: "Azul", grados: 0, profundidad: 1 },
  { numero: 6, color: "Rojo", grados: 240, profundidad: 1 },
  { numero: 3, color: "Amarillo", grados: 120, profundidad: 1 },
  { numero: 7, color: "Verde", grados: 60, profundidad: 2 },
  { numero: 4, color: "Naranja", grados: 180, profundidad: 2 },
  { numero: 2, color: "Violeta", grados: 300, profundidad: 2 },
  { numero: 5, color: "Terciario", grados: 240, profundidad: 3 },
  { numero: 8, color: "Terciario", grados: 60, profundidad: 3 },
  { numero: 9, color: "Terciario", grados: 120, profundidad: 3 },
  // Se agregan los colores sumados en secuencia
  { numeros: 71, color: "17 cenizo mate", grados: 30, profundidad: 2.5 },
  { numero: 17, color: "17 cenizo mate", grados: 30, profundidad: 2.5 },
  { numero: 73, color: "31 beige", grados: 90, profundidad: 2.5 },
  { numero: 37, color: "31 beige", grados: 90, profundidad: 2.5 },
  { numero: 34, color: "4 naranja o cobre", grados: 150, profundidad: 2.5 },
  { numero: 43, color: "4 naranja o cobre", grados: 150, profundidad: 2.5 },
  { numero: 46, color: "6 rojo", grados: 210, profundidad: 2.5 },
  { numero: 64, color: "6 rojo", grados: 210, profundidad: 2.5 },
  { numero: 62, color: "62 rojo violin", grados: 270, profundidad: 2.5 },
  { numero: 26, color: "62 rojo violin", grados: 270, profundidad: 2.5 },
  { numero: 21, color: "12 cenizo nacarado", grados: 330, profundidad: 2.5 },
  { numero: 12, color: "12 cenizo nacarado", grados: 330, profundidad: 2.5 },
  { numero: 13, color: "7 mate o verde", grados: 60, profundidad: 2.5 },
  { numero: 31, color: "7 mate o verde", grados: 60, profundidad: 2.5 },
  { numero: 16, color: "2 nacarado o violeta", grados: 300, profundidad: 2.5 },
  { numero: 61, color: "2 nacarado o violeta", grados: 300, profundidad: 2.5 },
  { numero: 36, color: "4 naranja o cobre", grados: 180, profundidad: 2.5 },
  { numero: 63, color: "4 naranja o cobre", grados: 180, profundidad: 2.5 },
  { numero: 72, color: "8 moka o marrón cenizo", grados: 0, profundidad: 2.5 },
  { numero: 27, color: "8 moka o marrón cenizo", grados: 0, profundidad: 2.5 },
  {
    numero: 24,
    color: "5 caoba o marron rojizo",
    grados: 240,
    profundidad: 2.5,
  },
  {
    numero: 42,
    color: "5 caoba o marron rojizo",
    grados: 240,
    profundidad: 2.5,
  },
];

// Función para obtener un color por su número
function getColor(numero) {
  return colores.find((c) => c.numero === numero);
}

// Función para sumar colores
function plusHighlights(highlights1, highlights2) {
  const hl1 = parseFloat(highlights1);
  const hl2 = parseFloat(highlights2);

  if (!hl1) return hl2;
  if (!hl2) return hl1;
  if (hl1 === hl2) return hl2;

  const color1 = getColor(hl1);
  const color2 = getColor(hl2);
  const neutro = getColor(0);

  // Caso: opuestos en grados (neutro)
  if (!color1) throw new Error("No se encontro el color para el: " + hl1);
  if (!color2) throw new Error("No se encontro el color para el: " + hl2);
  if (Math.abs(color1.grados - color2.grados) === 180) return neutro.numero;

  // Calcular la media de los grados (círculo)
  const gradosResultado = (color1.grados + color2.grados) / 2;

  // Resolver conflictos por profundidad
  const coloresCandidatos = colores.filter((c) => c.grados === gradosResultado);
  const colorResultado = coloresCandidatos.reduce((mejor, actual) => {
    return actual.profundidad > (mejor?.profundidad || 0) ? actual : mejor;
  }, null);

  if (!colorResultado) {
    console.log({
      numero: null,
      color: "Indefinido",
      grados: gradosResultado,
      profundidad: 0,
      coloresSumados: [color1, color2],
    });
    throw new Error("No se puede sumar estos colores");
  }

  return colorResultado.numero;
}

/**
 * @param {number[]} tones
 * @returns {string} The ideal formula X.YZ
 * @description Given an array of tones, calculates the ideal formula on pairs of tones
 * - X = Average plus before the decimal point
 *        = (Tone1 + Tone2) / 2 = res -> floor(res)
 *        = (res + Tone3) / 2 = res -> floor(res)
 *        = +,...,+
 *        = (res + ToneN) / 2 = res -> floor(res)
 *
 * - Y = First decimal are plus with Y2 using mixColors, and same for Z
 * Result is the ideal formula = X.YZ = (Tone1 + ToneN) / 2 + mixColors(Tone1, ToneN)
 */
function processPairs(tones) {
  if (tones.length <= 1) return String(tones[0]);

  const [tone1, tone2, ...rest] = tones.map(String);
  const baseAvg =
    (Math.floor(parseFloat(tone1)) + Math.floor(parseFloat(tone2))) / 2;
  const [color1, color2] = extractColors([tone1, tone2]);
  const mixedColor = mixColors(color1, color2);

  const newToneStr = `${baseAvg}.${mixedColor.primary}${mixedColor.secondary}`;

  if (rest.length) {
    return processPairs([newToneStr, ...rest]);
  }

  return Number(newToneStr);
}

function processFormula(userInput) {
  const finalTone = processPairs(userInput);
  return `Ideal Formula: ${finalTone}`;
}

// Example usage:
function test(expected, arr) {
  const result = processFormula(arr);
  let msg = result + " = " + expected;
  msg += " " + (result === expected ? "✅" : "❌");
  console.log(msg);
}

test("Ideal Formula: 7.02", [6.32, 8.2]);
test("Ideal Formula: 5", [4, 6]);
test("Ideal Formula: 7", [4, 6, 9]);
test("Ideal Formula: 7.12", [6.32, 8.2, 7.1]);

test("Ideal Formula: 0.1", [0.1, 0.1]);
test("Ideal Formula: 0.1", [0.1, 0.8]); // TODO: Que deberia de dar? es cuestion de ratio de formula 2:1 = .18 y ratio 1:2 .81
test("Ideal Formula: 0.8", [0.8, 0.1]); // TODO: Que deberia de dar?

test("Ideal Formula: 0.5", [0.5]);
test("Ideal Formula: 0.5", [0.5, 0.5]);

test("Ideal Formula: 0.2", [0.5, 0.7]); // TODO: El orden de suma altera el producto //  es cuestion de ratio de formula
test("Ideal Formula: 0.3", [0.7, 0.5]); // TODO: El orden de suma altera el producto //  es cuestion de ratio de formula

test("Ideal Formula: 0.17", [0.1, 0.7]); // TODO: El orden de suma altera el producto   // es cuestion de ratio de formula
test("Ideal Formula: 0.71", [0.7, 0.1]); // TODO: El orden de suma altera el producto   // es cuestion de ratio de formula

test("Ideal Formula: 0.49", [0.4, 0.9]); // TODO: Es lo mismo si se suma al revez?   // es cuestion de ratio de formula
test("Ideal Formula: 0.94", [0.9, 0.4]); // TODO: Es lo mismo si se suma al revez?   // es cuestion de ratio de formula

test("Ideal Formula: 0.04", [0.8, 0.4]); // TODO: Que deberia de dar? .0 calido
test("Ideal Formula: 0.02", [0.9, 0.2]); // TODO: Que deberia de dar? .0 calido
test("Ideal Formula: 0.07", [0.5, 0.7]); // TODO: Que deberia de dar? .0 frio

test("Ideal Formula: 0.07", [0.5, 0.1]); // TODO: Que deberia de dar? .5 frio

export default {
  colores,
  processPairs,
  getColor,
};
