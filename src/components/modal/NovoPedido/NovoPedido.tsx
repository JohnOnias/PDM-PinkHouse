import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import RegistrarVenda from '@/components/modal/RegistrarVenda/RegistrarVenda';

export default function NovoPedido() {
  const [novoPedidoAberto, setNovoPedidoAberto] = useState(false);

  function abrirNovoPedido() {
    setNovoPedidoAberto(true);
  }

  function fecharNovoPedido() {
    setNovoPedidoAberto(false);
  }

  return (
    <>
      {/* Botão Novo Pedido */}
      <Pressable
        onPress={abrirNovoPedido}
        accessibilityRole="button"
        accessibilityLabel="Novo pedido"
        style={({ pressed }) => [
          styles.fab,
          pressed && styles.fabPressionado,
        ]}
      >
        <Text style={styles.fabTexto}>Novo pedido 🛒</Text>
      </Pressable>

      {/* Modal de registro */}
      <Modal
        visible={novoPedidoAberto}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={fecharNovoPedido}
      >
        <View style={styles.fundo}>
          <View style={styles.popup}>
            <View style={styles.cabecalho}>
              <Text style={styles.titulo}>Registrar venda</Text>

              <Pressable
                onPress={fecharNovoPedido}
                accessibilityRole="button"
                accessibilityLabel="Fechar"
                hitSlop={12}
                style={({ pressed }) => [
                  styles.botaoFechar,
                  pressed && styles.botaoFecharPressionado,
                ]}
              >
                <Text style={styles.botaoFecharTexto}>✕</Text>
              </Pressable>
            </View>

            <RegistrarVenda />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D6336C',
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderRadius: 999,
    shadowColor: '#7A1B3D',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  fabPressionado: {
    opacity: 0.85,
  },

  fabTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  fundo: {
    flex: 1,
    backgroundColor: 'rgba(61, 27, 41, 0.45)',
    justifyContent: 'flex-end',
  },

  popup: {
    backgroundColor: '#FFF5F8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3C6D6',
  },

  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3D1B29',
  },

  botaoFechar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3C6D6',
  },

  botaoFecharPressionado: {
    opacity: 0.7,
  },

  botaoFecharTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7A4B5D',
  },
});