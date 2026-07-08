export function pricePerMl(product: { actualBottleFullPriceBdt: number; actualBottleMl: number }) {
  return product.actualBottleFullPriceBdt / product.actualBottleMl;
}

export function customDecantPrice(
  product: { actualBottleFullPriceBdt: number; actualBottleMl: number },
  ml: number,
) {
  return Math.round(pricePerMl(product) * ml);
}