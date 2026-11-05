export type TipoPagamento = {
  idTipoPagamento: number;
  nome: string;
  descricao: string | null;
  ativo: boolean;
};

export type NovaVenda = {
  idTipoPagamento: number;
  valorCentavos: number;
};

export type Venda = {
  idVenda: number;
  valorCentavos: number;
  dataVenda: string;
  idTipoPagamento: number;
};
