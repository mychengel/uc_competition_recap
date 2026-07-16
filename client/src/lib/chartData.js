// Caps a sorted-desc {name, value}[] list to the categorical palette's slot
// budget, folding the remainder into "Lainnya" per the dataviz "past N, fold
// to Other" rule.
export function capTopN(data, n = 7) {
  if (data.length <= n) return data;
  const top = data.slice(0, n);
  const restTotal = data.slice(n).reduce((s, d) => s + d.value, 0);
  return restTotal > 0 ? [...top, { name: 'Lainnya', value: restTotal }] : top;
}
