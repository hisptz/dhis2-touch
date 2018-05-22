export function sample(d: string = '', fn = Math.random) {
  if (d.length === 0) {
    return;
  }
  return d[Math.round(fn() * (d.length - 1))];
}

export function generateCode(limit: number = 11, fn = Math.random) {
  const allowedLetters = [
    'abcdefghijklmnopqrstuvwxyz',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  ].join('');
  const allowedChars = ['0123456789', allowedLetters].join('');

  const arr = [sample(allowedLetters, fn)];

  for (let i = 0; i < limit - 1; i++) {
    arr.push(sample(allowedChars, fn));
  }

  return arr.join('');
}

export function generateCodes(
  n: number = 10,
  limit: number = 11,
  fn = Math.random
) {
  const arr = [];

  for (let i = 0; i < n; i++) {
    arr.push(generateCode(limit, fn));
  }

  return arr;
}
