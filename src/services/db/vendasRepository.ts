import type { NovaVenda, TipoPagamento } from '@/@types/venda';
import { obterBanco } from './database';

type TipoPagamentoRow = {
  id_tipo_pagamento: number;
  nome: string;
  descricao: string | null;
  ativo: number;
};

export async function listarTiposPagamento(): Promise<TipoPagamento[]> {
  const db = await obterBanco();

  const rows = await db.getAllAsync<TipoPagamentoRow>(
    `SELECT id_tipo_pagamento, nome, descricao, ativo
       FROM tb_tipos_pagamentos
      WHERE ativo = 1
      ORDER BY nome COLLATE NOCASE`
  );

  return rows.map((row) => ({
    idTipoPagamento: row.id_tipo_pagamento,
    nome: row.nome,
    descricao: row.descricao,
    ativo: row.ativo === 1,
  }));
}

export async function registrarVenda({
  idTipoPagamento,
  valorCentavos,
}: NovaVenda): Promise<number> {
  if (!Number.isInteger(valorCentavos) || valorCentavos <= 0) {
    throw new Error('O valor da venda deve ser maior que zero.');
  }

  if (!Number.isInteger(idTipoPagamento) || idTipoPagamento <= 0) {
    throw new Error('Selecione um tipo de pagamento.');
  }

  const db = await obterBanco();

  const resultado = await db.runAsync(
    `INSERT INTO tb_vendas (valor_total_centavos, id_tipo_pagamento)
     VALUES (?, ?)`,
    [valorCentavos, idTipoPagamento]
  );

  return resultado.lastInsertRowId;
}
