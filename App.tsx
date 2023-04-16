import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { findWordsWithConstraints } from './src/utils/wordUtils';
import { preprocess } from './src/database/preprocess';
import { SortableTable } from './src/components/SortableTable';

export default function App() {
  const [letters, setLetters] = useState('');
  const [rule, setRule] = useState('');
  const [ruleAlignment, setRuleAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [words, setWords] = useState<
      Array<{ word: string; length: number; score: number; coloredHtml: string }>
    >([]);
  const [leftAlign, setLeftAlign] = useState(false);
  const [rightAlign, setRightAlign] = useState(false);

  const columns = [
    { id: 'word', label: 'Word', sortable: true },
    { id: 'length', label: 'Length', sortable: true },
    { id: 'score', label: 'Score', sortable: true },
  ];

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
    //let previousRuleStartsWith_ = rule.startsWith('_');
    //let previousRuleEndsWith_ = rule.endsWith('_');
    let ruleStartsWith_ = convertedText.startsWith('_');
    let ruleEndsWith_ = convertedText.endsWith('_');
    updateAlignment(ruleStartsWith_, ruleEndsWith_);
    setRule(convertedText);
    /*
    if(convertedText.startsWith('_'))
    {
      if(!previousRuleStartsWith_)
        updateAlignment(true, rightAlign);
    } else {
      if(previousRuleStartsWith_)
        updateAlignment(false, rightAlign);
    }
    if(convertedText.endsWith('_'))
    {
      if(!previousRuleEndsWith_)
        updateAlignment(leftAlign, true);
    } else {
      if(previousRuleEndsWith_)
        updateAlignment(leftAlign, false);
    }
    */
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
    
    const result = findWordsWithConstraints(
      trieInstance,
      letters,
      rule,
      leftAlign,
      rightAlign
    );
    setWords(result);
  };
  

  const handleClear = () => {
    setLetters('');
    setRule('');
    setRuleAlignment('center');
    setWords([]);
  };

  const updateAlignment = (newLeftAlign: boolean, newRightAlign: boolean) => {
    setLeftAlign(newLeftAlign);
    setRightAlign(newRightAlign);
    if(newLeftAlign && newRightAlign)
    {
      setRuleAlignment('center');
    }
    if(newLeftAlign && !newRightAlign)
    {
      setRuleAlignment('left');
    }
    if(!newLeftAlign && newRightAlign)
    {
      setRuleAlignment('right');
    }
    if(!newLeftAlign && !newRightAlign)
    {
      setRuleAlignment('center');
    }
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
      <View style={styles.ruleContainer}>
        <TouchableOpacity
          onPress={() => updateAlignment(!leftAlign, rightAlign)}
          style={[styles.alignButton, leftAlign && styles.alignButtonSelected]}
          disabled={rule.startsWith('_')}
        >
          <Text style={styles.alignButtonText}>&lt;</Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.input, styles.ruleInput, { textAlign: ruleAlignment }]}
          onChangeText={(text) => {
            onRuleChange(text);
          }}
          value={rule}
          placeholder="Enter rule (substring)"
        />
        <TouchableOpacity
          onPress={() => updateAlignment(leftAlign, !rightAlign)}
          style={[styles.alignButton, rightAlign && styles.alignButtonSelected]}
          disabled={rule.endsWith('_')}
        >
          <Text style={styles.alignButtonText}>&gt;</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleFindWords} style={styles.button}>
        <Text style={styles.buttonText}>Generate</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleClear} style={styles.button}>
        <Text style={styles.buttonText}>Clear</Text>
      </TouchableOpacity>
      <SortableTable columns={columns} data={words} />
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
  ruleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  alignButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  alignButtonSelected: {
    backgroundColor: '#1e90ff',
  },
  alignButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  ruleInput: {
    width: '60%',
  },
});
