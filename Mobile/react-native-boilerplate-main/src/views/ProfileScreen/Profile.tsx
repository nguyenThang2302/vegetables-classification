import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Background from '../../components/template/DashboardScreen/Background';
import { fetchProfileData } from '@/services/users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import the hook

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const navigation = useNavigation(); // Use the hook

  useEffect(() => {
    fetchProfileData()
      .then((response) => {
        if (response.data) {
          setUserData(response.data);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch profile data:', error);
      });
  }, []);

  const handleLogout = () => {
    AsyncStorage.removeItem('access_token');
    navigation.navigate("Login");
  };

  return (
    <Background>
      {userData && (
        <View style={styles.container}>
          <Image source={{ uri: 'https://res.cloudinary.com/dxsdyc667/image/upload/v1725939410/udtt7a2uwjbr2pupjnfb.jpg' }} style={styles.avatar} />

          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={userData.name} editable={false} />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={userData.email} editable={false} />

          <TouchableOpacity onPress={handleLogout} style={styles.button}>
            <View style={styles.buttonContent}>
              <Image
                source={{ uri: 'https://img.icons8.com/color/48/exit.png' }}
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </Background>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  button: {
    padding: 10,
    borderWidth: 2, 
    borderColor: '#66b2ff', 
    borderRadius: 40, 
    backgroundColor: 'white',
    width: 150,
    height: 70,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  }
});