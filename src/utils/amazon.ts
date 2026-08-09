const AMAZON_TAG = 'dirtoverreach-20'

export function amazonSearchUrl(query: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`
}

const LEADING_QTY = /^[\d¼½¾⅓⅔⅕⅖⅗⅛⅜⅝⅞\s\-–./]+/
const UNIT_WORDS =
  /^(lbs?|oz|ounces?|g|kg|grams?|kilograms?|ml|milliliters?|l|liters?|cups?|tbsp|tablespoons?|tsp|teaspoons?|cloves?|cans?|packages?|bunche?s?|pieces?|slices?|sprigs?|stalks?|heads?|pinch(?:es)?|dash(?:es)?)\s+/i
const SIZE_WORDS = /^(extra[- ]large|large|medium|small|whole|fresh|ripe|thin|thick)\s+/i

// Strips quantities, units, and prep notes so ingredient text reads as a
// reasonable Amazon product search, e.g. "3 cups (600g) long-grain basmati
// rice" -> "long-grain basmati rice".
export function cleanIngredientQuery(raw: string): string {
  let s = raw.replace(/\([^)]*\)/g, ' ')
  s = s.split(',')[0].trim()
  s = s.replace(LEADING_QTY, '').trim()
  s = s.replace(UNIT_WORDS, '').trim()
  s = s.replace(SIZE_WORDS, '').trim()
  s = s.replace(UNIT_WORDS, '').trim()
  return s || raw
}
