import type { TipoPagamento } from '@/@types/venda';
import {
  listarTiposPagamento,
  registrarVenda,
} from '@/services/db/vendasRepository';
import { centavosParaTexto, digitosParaCentavos } from '@/utils/currency';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Mensagem = {
  tipo: 'sucesso' | 'erro';
  texto: string;
};

export default function RegistrarVenda() {
  const [digitos, setDigitos] = useState('');
  const [tipos, setTipos] = useState<TipoPagamento[]>([]);
  const [idSelecionado, setIdSelecionado] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);

  // Evita cliques repetidos/disparos simultâneos que gerariam vendas duplicadas.
  const enviandoRef = useRef(false);

  useEffect(() => {
    let montado = true;

    async function carregar() {
      try {
        const lista = await listarTiposPagamento();

        if (!montado) {
          return;
        }

        setTipos(lista);

        if (lista.length === 1) {
          setIdSelecionado(lista[0].idTipoPagamento);
        }
      } catch (e) {
        console.error('Erro ao listar tipos de pagamento', e);

        if (montado) {
          setMensagem({
            tipo: 'erro',
            texto: 'Não foi possível carregar os tipos de pagamento.',
          });
        }
      } finally {
        if (montado) {
          setCarregando(false);
        }
      }
    }

    carregar();

    return () => {
      montado = false;
    };
  }, []);

  const valorCentavos = digitosParaCentavos(digitos);

  const tipoSelecionado = useMemo(
    () => tipos.find((tipo) => tipo.idTipoPagamento === idSelecionado) ?? null,
    [tipos, idSelecionado]
  );

  const podeSalvar =
    !carregando && !salvando && valorCentavos > 0 && idSelecionado !== null;

  async function handleRegistrar() {
    if (enviandoRef.current) {
      return;
    }

    if (valorCentavos <= 0) {
      setMensagem({
        tipo: 'erro',
        texto: 'Informe um valor maior que zero.',
      });
      return;
    }

    if (idSelecionado === null) {
      setMensagem({
        tipo: 'erro',
        texto: 'Selecione o tipo de pagamento.',
      });
      return;
    }

    enviandoRef.current = true;
    setSalvando(true);
    setMensagem(null);

    try {
      await registrarVenda({ idTipoPagamento: idSelecionado, valorCentavos });

      setMensagem({
        tipo: 'sucesso',
        texto: `Venda registrada: ${centavosParaTexto(valorCentavos)} em ${
          tipoSelecionado?.nome ?? 'pagamento'
        }.`,
      });

      setDigitos('');
      setIdSelecionado(null);
    } catch (e) {
      console.error('Erro ao registrar venda', e);
      setMensagem({
        tipo: 'erro',
        texto: 'Não foi possível registrar a venda. Tente novamente.',
      });
    } finally {
      enviandoRef.current = false;
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.campo}>
          <Text style={styles.label}>Valor da venda</Text>
          <TextInput
            value={centavosParaTexto(valorCentavos)}
            onChangeText={setDigitos}
            keyboardType="number-pad"
            inputMode="numeric"
            style={styles.inputValor}
            selectionColor="#D6336C"
            accessibilityLabel="Valor da venda"
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Tipo de pagamento</Text>

          {carregando ? (
            <View style={styles.estado}>
              <ActivityIndicator color="#D6336C" />
              <Text style={styles.estadoTexto}>
                Carregando formas de pagamento...
              </Text>
            </View>
          ) : tipos.length === 0 ? (
            <Text style={styles.aviso}>
              Nenhum tipo de pagamento ativo encontrado.
            </Text>
          ) : (
            <View style={styles.chips}>
              {tipos.map((tipo) => {
                const selecionado = tipo.idTipoPagamento === idSelecionado;

                return (
                  <Pressable
                    key={tipo.idTipoPagamento}
                    onPress={() => setIdSelecionado(tipo.idTipoPagamento)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: selecionado }}
                    style={[styles.chip, selecionado && styles.chipSelecionado]}
                  >
                    <Text
                      style={[
                        styles.chipTexto,
                        selecionado && styles.chipTextoSelecionado,
                      ]}
                    >
                      {tipo.nome}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {mensagem ? (
          <Text
            style={[
              styles.mensagem,
              mensagem.tipo === 'sucesso'
                ? styles.mensagemSucesso
                : styles.mensagemErro,
            ]}
          >
            {mensagem.texto}
          </Text>
        ) : null}

        <Pressable
          onPress={handleRegistrar}
          disabled={!podeSalvar}
          accessibilityRole="button"
          accessibilityState={{ disabled: !podeSalvar, busy: salvando }}
          style={({ pressed }) => [
            styles.botao,
            !podeSalvar && styles.botaoDesabilitado,
            pressed && podeSalvar && styles.botaoPressionado,
          ]}
        >
          {salvando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.botaoTexto}>Registrar venda</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flexGrow: 0,
    flexShrink: 1,
  },
  conteudo: {
    padding: 20,
    paddingBottom: 28,
    gap: 20,
  },
  campo: {
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3D1B29',
  },
  inputValor: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3C6D6',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 30,
    fontWeight: '700',
    color: '#3D1B29',
  },
  estado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  estadoTexto: {
    color: '#7A4B5D',
    fontSize: 15,
  },
  aviso: {
    color: '#B23A48',
    fontSize: 15,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#F3C6D6',
    backgroundColor: '#FFFFFF',
  },
  chipSelecionado: {
    backgroundColor: '#D6336C',
    borderColor: '#D6336C',
  },
  chipTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7A4B5D',
  },
  chipTextoSelecionado: {
    color: '#FFFFFF',
  },
  mensagem: {
    fontSize: 14,
    lineHeight: 20,
  },
  mensagemSucesso: {
    color: '#1E7B45',
  },
  mensagemErro: {
    color: '#B23A48',
  },
  botao: {
    backgroundColor: '#D6336C',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  botaoDesabilitado: {
    backgroundColor: '#E7B9C9',
  },
  botaoPressionado: {
    opacity: 0.85,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
