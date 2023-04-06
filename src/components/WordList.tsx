import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';

// Define the props interface
interface WordListProps {
  words: string[];
}

const WordList: React.FC<WordListProps> = ({ words }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={words}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.word}>{item}</Text>
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
