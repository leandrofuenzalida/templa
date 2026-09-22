export function slugify(text) {
  const base = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24)

  return base || 'variable'
}

export function uniqueKey(baseKey, existingKeys) {
  if (!existingKeys.includes(baseKey)) return baseKey
  let n = 2
  while (existingKeys.includes(`${baseKey}_${n}`)) n += 1
  return `${baseKey}_${n}`
}
