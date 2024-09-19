import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, Dimensions } from 'react-native';
import * as _ from 'lodash';
import { Text } from 'react-native-paper';
import Background from '../../components/template/DashboardScreen/Background';
import { fetchHistoryImages } from '@/services/images';
const { width } = Dimensions.get('window');

export default function HistoryImage({ navigation }: any) {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoryImages()
      .then((response) => {
        if (!_.has(response, 'error')) {
          setHistoryData(response);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch history data:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <Image source={{ uri: item.url }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.imageName}>{item.name}</Text>
        <Text style={styles.createdAt}>{new Date(item.created_at).toLocaleString()}</Text>
      </View>
    </View>
  );

  return (
    <Background>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </Background>
  );
}

const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      width: width, 
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      height: 120,
    },
    image: {
      width: 130,
      height: 90
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      marginLeft: 30,
    },
    imageName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    createdAt: {
      fontSize: 14,
      color: '#666',
    },
  });
