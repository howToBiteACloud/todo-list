export function randomHexColor() {
  const h = getRandomNumber(0, 360);
  const s = getRandomNumber(0, 90);
  const l = getRandomNumber(50, 97);

  return hslToHex(h, s, l);
}

export function paleRandomHexColor() {
  const h = getRandomNumber(0, 360);
  const s = getRandomNumber(0, 85);
  const l = getRandomNumber(60, 97);

  return hslToHex(h, s, l);
}

export function getRandomNumber(from, to) {
  // Должна вернуть случайное число от 'from' до 'to'
  return Math.floor(Math.random() * (to - from + 1) + from);
}

export function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}