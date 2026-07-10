export function pricePerMl(fullBottlePrice: number, actualBottleMl: number) {
  return fullBottlePrice / actualBottleMl;
}

export function customDecantPrice(
  fullBottlePrice: number,
  actualBottleMl: number,
  ml: number,
) {
  return Math.round(pricePerMl(fullBottlePrice, actualBottleMl) * ml);
}