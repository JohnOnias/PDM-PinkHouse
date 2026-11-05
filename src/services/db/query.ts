import { db } from './database';

export async function listarTiposPagamentos() {
  const pagamentos = await db.getAllAsync(
    'SELECT * FROM tb_tipos_pagamentos;'
  );

  return pagamentos;
}

export async function listarVendas() {
  const vendas = await db.getAllAsync(
    'SELECT * FROM tb_vendas;'
  );

  return vendas;
}

export async function listarDespesasPendentes(){
  const despesasPendentes = await db.getAllAsync(
    `SELECT * FROM tb_despesas
     WHERE status_pagamento = 'PENDENTE';`
  );

  return despesasPendentes;
}
export async function criarVenda(valorTotal: number, idTipoPagamento: number) {
  const resultado = await db.runAsync(
    `INSERT INTO tb_vendas (valor_total, id_tipo_pagamento) VALUES (?, ?);`,
    [valorTotal, idTipoPagamento]
  );

  return resultado.lastInsertRowId;
}