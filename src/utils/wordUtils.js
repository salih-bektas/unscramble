export const preprocessWords = (words) => {
    const wordMap = new Map();
  
    words.forEach((word) => {
      const sortedWord = word.split('').sort().join('');
      if (!wordMap.has(sortedWord)) {
        wordMap.set(sortedWord, []);
      }
      wordMap.get(sortedWord).push(word);
    });
  
    return wordMap;
  };
  
  const generateCombinationsHelper = (letters, jokers, rule, current, index, result) => {
    if (index === letters.length) {
      if (jokers === 0 && current.includes(rule)) {
        result.push(current);
      }
      return;
    }
  
    // Include the current letter
    generateCombinationsHelper(letters, jokers, rule, current + letters[index], index + 1, result);
  
    // Exclude the current letter and use a joker (if available)
    if (jokers > 0) {
      generateCombinationsHelper(letters, jokers - 1, rule, current, index + 1, result);
    }
  };
  
  export const generateCombinations = (letters, jokers, rule) => {
    const result = [];
    generateCombinationsHelper(letters.split(''), jokers, rule, '', 0, result);
    return result;
  };
  

  export const findWords = (wordMap, combinations, trie) => {
    const matchingWords = new Set();
  
    combinations.forEach((combination) => {
      const sortedCombination = combination.split('').sort().join('');
      if (wordMap.has(sortedCombination)) {
        const words = wordMap.get(sortedCombination);
        words.forEach((word) => {
          if (trie.contains(word)) {
            matchingWords.add(word);
          }
        });
      }
    });
  
    return Array.from(matchingWords);
  };