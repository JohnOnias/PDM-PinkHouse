import { inicializarBanco } from '@/services/db/database';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


//import de componentes react
import Navbar from '../components/Layout/Navbar/NavBar';
import Footer from '../components/Layout/Footer/Footer';

export default function RootLayout() {
  const [bancoPronto, setBancoPronto] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let montado = true;

    inicializarBanco()
      .then(() => {
        if (montado) {
          setBancoPronto(true);
        }
      })
      .catch((e) => {
        console.error('Falha ao inicializar o banco', e);

        if (montado) {
          setErro('Não foi possível inicializar o banco de dados.');
        }
      });

    return () => {
      montado = false;
    };
  }, []);

  if (erro) {
    return (
      <View style={styles.centralizado}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  if (!bancoPronto) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color="#D6336C" />
        <Text style={styles.carregando}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
     
      <Stack
        screenOptions={{
         headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Teste' }} />
      </Stack>
       <Navbar/>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFF5F8',
    padding: 24,
  },
  carregando: {
    color: '#7A4B5D',
    fontSize: 15,
  },
  erro: {
    color: '#B23A48',
    fontSize: 16,
    textAlign: 'center',
  },
});
