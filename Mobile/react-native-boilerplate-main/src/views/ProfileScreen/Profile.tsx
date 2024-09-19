import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Background from '../../components/DashboardScreen/Background';
import { fetchProfileData } from 'src/services/user/getProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); 

  useEffect(() => {
    fetchProfileData()
      .then((response) => {
        if (response.data) {
          setUserData(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch profile data:', error);
      }).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    AsyncStorage.removeItem('access_token');
    navigation.navigate("Login");
  };

  return (
    <Background>
      {loading ? (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        userData && (
          <View style={styles.container}>
            <Image source={{ uri: 'https://res.cloudinary.com/dxsdyc667/image/upload/v1725939410/udtt7a2uwjbr2pupjnfb.jpg' }} style={styles.avatar} />

            <Text style={styles.label}>{userData.name}</Text>

            <Text style={styles.label}>{userData.email}</Text>

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
        )
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
  button: {
    padding: 10,
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
