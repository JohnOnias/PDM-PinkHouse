import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('pinkhouse.db');

export function inicializarBanco() {
  db.execSync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS tb_tipos_pagamentos (
      id_tipo_pagamento INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      descricao TEXT,
      ativo INTEGER NOT NULL DEFAULT 1
        CHECK (ativo IN (0, 1)),
      criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tb_vendas (
      id_venda INTEGER PRIMARY KEY AUTOINCREMENT,
      valor_total NUMERIC NOT NULL,
      data_venda TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      id_tipo_pagamento INTEGER,
      criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (id_tipo_pagamento)
        REFERENCES tb_tipos_pagamentos(id_tipo_pagamento)
    );

    CREATE INDEX IF NOT EXISTS idx_vendas_data
      ON tb_vendas(data_venda);

    CREATE INDEX IF NOT EXISTS idx_vendas_tipo_pagamento
      ON tb_vendas(id_tipo_pagamento);

    CREATE TABLE IF NOT EXISTS tb_despesas (
      id_despesa INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      categoria TEXT,
      valor NUMERIC NOT NULL CHECK (valor > 0),
      data_despesa TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status_pagamento TEXT NOT NULL DEFAULT 'PAGO'
        CHECK (
          status_pagamento IN ('PENDENTE', 'PAGO', 'CANCELADO')
        ),
      id_tipo_pagamento INTEGER,
      observacoes TEXT,
      criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (id_tipo_pagamento)
        REFERENCES tb_tipos_pagamentos(id_tipo_pagamento)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
    );

    CREATE INDEX IF NOT EXISTS idx_despesas_data
      ON tb_despesas(data_despesa);

    CREATE INDEX IF NOT EXISTS idx_despesas_categoria
      ON tb_despesas(categoria);

    CREATE INDEX IF NOT EXISTS idx_despesas_status
      ON tb_despesas(status_pagamento);

    CREATE INDEX IF NOT EXISTS idx_despesas_tipo_pagamento
      ON tb_despesas(id_tipo_pagamento);

    INSERT OR IGNORE INTO tb_tipos_pagamentos
      (nome, descricao)
    VALUES
      ('Dinheiro', 'Pagamento em especie'),
      ('Pix', 'Transferencia Pix'),
      ('Cartao de debito', 'Pagamento no debito'),
      ('Cartao de credito', 'Pagamento no credito');
  `);
}
