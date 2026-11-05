import { obterBanco } from './database';

export async function listarTiposPagamentos() {
  const db = await obterBanco();
  const pagamentos = await db.getAllAsync(
    'SELECT * FROM tb_tipos_pagamentos;'
  );
  return pagamentos;
}

export async function listarVendas() {
  const db = await obterBanco();
  const vendas = await db.getAllAsync(
    'SELECT * FROM tb_vendas;'
  );
  return vendas;
}

export async function listarDespesasPendentes() {
  const db = await obterBanco();
  const despesasPendentes = await db.getAllAsync(
    `SELECT * FROM tb_despesas
     WHERE status_pagamento = 'PENDENTE';`
  );
  return despesasPendentes;
}

export async function criarVenda(valorTotalCentavos: number, idTipoPagamento: number) {
  const db = await obterBanco();
  const resultado = await db.runAsync(
    `INSERT INTO tb_vendas (valor_total_centavos, id_tipo_pagamento) VALUES (?, ?);`,
    [valorTotalCentavos, idTipoPagamento]
  );

  return resultado.lastInsertRowId;
}

export async function listarVendasDetalhadas() {
  const db = await obterBanco();

  const vendas = await db.getAllAsync(`
    SELECT 
      v.id_venda,
      v.valor_total_centavos,
      v.data_venda,
      p.nome AS forma_pagamento
    FROM tb_vendas v
    INNER JOIN tb_tipos_pagamentos p 
      ON v.id_tipo_pagamento = p.id_tipo_pagamento
    ORDER BY v.data_venda DESC;
  `);

  return vendas;
}

export async function obterTotalVendasHoje(): Promise<number> {
  const db = await obterBanco();

  const resultado = await db.getFirstAsync<{ total_centavos: number | null }>(`
    SELECT 
      SUM(valor_total_centavos) AS total_centavos
    FROM tb_vendas
    WHERE date(data_venda) = date('now', 'localtime');
  `);

  
  return resultado?.total_centavos ?? 0;
}

export async function criarDespesa(
  descricao: string,
  categoria: string,
  valor: number,
  statusPagamento: 'PENDENTE' | 'PAGO',
  idTipoPagamento: number,
  observacoes: string = ''
) {
  const db = await obterBanco();
  const resultado = await db.runAsync(
    `INSERT INTO tb_despesas (
      descricao,
      categoria,
      valor,
      status_pagamento,
      id_tipo_pagamento,
      observacoes
    ) VALUES (?, ?, ?, ?, ?, ?);`,
    [descricao, categoria, valor, statusPagamento, idTipoPagamento, observacoes]
  );

  return resultado.lastInsertRowId;
}