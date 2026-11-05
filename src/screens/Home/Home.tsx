import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import NovoPedido from '@/components/modal/NovoPedido/NovoPedido';

export default function Home() {

  useEffect(() => {
    async function esconderBarra() {
      await NavigationBar.setVisibilityAsync('hidden');
    }

    esconderBarra();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <NovoPedido />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
});