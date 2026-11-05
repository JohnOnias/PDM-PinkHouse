import { Background } from 'expo-router/build/react-navigation';
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useState} from "react";
// icones
import { Ionicons } from '@expo/vector-icons';

export default function Navbar() {
  const [cor, setCor] = useState(null);
  return (
    <View style={styles.container}>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.item} style={{backgroundColor: cor}}>
        <Ionicons name="home-outline" size={32} color="#fff" />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>

       <TouchableOpacity style={styles.item}>
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {

    backgroundColor: '#000000',
    height: 60,
    width: "60%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 18,
    margin: "auto",
    marginBottom: 17.
  },
  item: {

  justifyContent: "center",
  alignItems: "center",
  width: 60,
  borderRadius: 7,
 

  },

  logo: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  menu: {
    flexDirection: 'row',
    gap: 50,

  },

  menuText: {
    color: '#ffffff',
    fontSize: 14,
  },
});