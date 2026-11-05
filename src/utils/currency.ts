const MAXIMO_DIGITOS = 9; // até R$ 9.999.999,99

function agruparMilhares(valor: number): string {
  return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Converte o que foi digitado no input em centavos, ignorando caracteres não numéricos. */
export function digitosParaCentavos(digitos: string): number {
  const somenteDigitos = digitos.replace(/\D/g, '').slice(0, MAXIMO_DIGITOS);

  return somenteDigitos ? Number(somenteDigitos) : 0;
}

/** Formata um valor em centavos no padrão brasileiro: 1234 -> "R$ 12,34". */
export function centavosParaTexto(centavos: number): string {
  const valorSeguro = Math.max(0, Math.trunc(centavos));
  const reais = Math.floor(valorSeguro / 100);
  const resto = valorSeguro % 100;

  return `R$ ${agruparMilhares(reais)},${resto.toString().padStart(2, '0')}`;
}
