import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const DATABASE_VERSION = 1;

const ESQUEMA_V1 = `
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
    valor_total_centavos INTEGER NOT NULL
      CHECK (valor_total_centavos > 0),
    data_venda TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_tipo_pagamento INTEGER NOT NULL,
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
`;

let bancoPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Abre o banco uma única vez e reaproveita a mesma conexão.
 * Usa a API assíncrona porque operações síncronas do expo-sqlite
 * não funcionam na thread principal do navegador (web).
 */
export function obterBanco(): Promise<SQLite.SQLiteDatabase> {
  if (!bancoPromise) {
    bancoPromise = SQLite.openDatabaseAsync('pinkhouse.db');
  }

  return bancoPromise;
}

export async function inicializarBanco(): Promise<void> {
  const db = await obterBanco();

  await db.execAsync('PRAGMA foreign_keys = ON;');

  if (Platform.OS !== 'web') {
    await db.execAsync('PRAGMA journal_mode = WAL;');
  }

  const resultado = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const versaoAtual = resultado?.user_version ?? 0;

  if (versaoAtual >= DATABASE_VERSION) {
    return;
  }

  if (versaoAtual === 0) {
    await db.execAsync(ESQUEMA_V1);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
}
