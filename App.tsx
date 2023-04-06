import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import WordList from './src/components/WordList';
import { generateCombinations } from './src/utils/wordUtils';
import { preprocess } from './src/database/preprocess';

export default function App() {
  const [letters, setLetters] = useState('');
  const [rule, setRule] = useState('');
  const [ruleAlignment, setRuleAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [words, setWords] = useState<string[]>([]);

  const onLettersChange = (text: string) => {
    const uppercasedText = text.toUpperCase();
    const allowedText = filterAllowedCharactersLetters(uppercasedText);
    const convertedText = allowedText.replace(/ /g, '*');
    setLetters(convertedText);
  };
  
  const onRuleChange = (text: string) => {
    const uppercasedText = text.toUpperCase();
    const allowedText = filterAllowedCharactersRules(uppercasedText);
    const convertedText = allowedText.replace(/ /g, '_');
    setRule(convertedText);
  };

  const filterAllowedCharactersLetters = (text: string) => {
    const allowedCharacters = /^[A-ZÄÖÜ* ]+$/;
    const filteredText = text
      .split('')
      .filter((char) => char.match(allowedCharacters))
      .join('');
    return filteredText;
  };
  
  const filterAllowedCharactersRules = (text: string) => {
    const allowedCharacters = /^[A-ZÄÖÜ_ ]+$/;
    const filteredText = text
      .split('')
      .filter((char) => char.match(allowedCharacters))
      .join('');
    return filteredText;
  };

  const handleFindWords = async () => {
    const trieInstance = await preprocess();
    const combinations = generateCombinations(letters, rule);
    const filteredWords = combinations.filter((word) => trieInstance.contains(word));
    setWords(filteredWords);
  };

  const handleClear = () => {
    setLetters('');
    setRule('');
    setRuleAlignment('center');
    setWords([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scrabble Word Generator</Text>
      <StatusBar style="auto" />
      <TextInput
        style={styles.input}
        onChangeText={onLettersChange}
        value={letters}
        placeholder="Enter letters and jokers (*)"
        keyboardType="default"
      />
      <TextInput
        style={[
          styles.input,
          { textAlign: ruleAlignment === 'center' && rule.includes('_') ? 'center' : ruleAlignment },
        ]}
        onChangeText={onRuleChange}
        value={rule}
        placeholder="Enter rule (substring)"
        keyboardType="default"
      />
      <TouchableOpacity onPress={handleFindWords} style={styles.button}>
        <Text style={styles.buttonText}>Generate</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleClear} style={styles.button}>
        <Text style={styles.buttonText}>Clear</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setRuleAlignment('left')}
        style={[styles.button, ruleAlignment === 'left' && styles.selectedButton]}
      >
        <Text style={styles.buttonText}>Left</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setRuleAlignment('right')}
        style={[styles.button, ruleAlignment === 'right' && styles.selectedButton]}
      >
        <Text style={styles.buttonText}>Right</Text>
      </TouchableOpacity>
      <WordList words={words} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  selectedButton: {
  backgroundColor: '#0073e6',
  },
  wordListContainer: {
  flex: 1,
  width: '100%',
  },
});