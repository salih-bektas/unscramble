import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { fetchTopWords } from '../database';

const WordList = () => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    fetchTopWords(setWords);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={words}
        //keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.word}>{item.word}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  word: {
    fontSize: 18,
  },
});

export default WordList;
