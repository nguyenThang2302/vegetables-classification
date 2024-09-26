import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, Image, Dimensions, ActivityIndicator } from 'react-native';
import * as _ from 'lodash';
import { Text } from 'react-native-paper';
import Background from '../../components/DashboardScreen/Background';
import { fetchHistoryImages } from 'src/services/media/getHistoryImageList';
const { width } = Dimensions.get('window');

export default function HistoryImage({ navigation }: any) {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const isStop = useRef<boolean>(false);

  useEffect(() => {
    loadImages(page, false);
  }, []);

  const loadImages = async (page: number, loadMore = true) => {
    setLoading(true);
    try {
      const response = await fetchHistoryImages(page, 10);
      if (!_.has(response, 'error')) {
        if (loadMore) {
          setHistoryData(prevData => [...prevData, ...response]);
        } else {
          setHistoryData(response);
        }
      }
    } catch (error) {
      console.error('Failed to fetch history data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && !isStop.current) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadImages(nextPage);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadImages(1, false);
  };

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
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
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
    height: 90,
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
