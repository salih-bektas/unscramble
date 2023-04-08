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
  
  export const findWordsWithConstraints = (
    trieInstance,
    letters,
    rule,
    leftAlign,
    rightAlign
  ) => {
    let modifiedRule = rule;
  
    if (leftAlign) {
      modifiedRule = '^' + modifiedRule;
    }
  
    if (rightAlign) {
      modifiedRule = modifiedRule + '$';
    }

    // Replace all occurrences of "_" with "."
    modifiedRule = modifiedRule.replace(/_/g, '.');
  
    const ruleRegex = new RegExp(modifiedRule);
    const results = new Set();
    const visited = new Set();
  
    const dfs = (
      node, 
      currentWord, 
      remainingLetters, 
      jokers, 
      remaningRule,
      ruleIsBeingProcessed
    ) => {
      if(node == undefined) {
        return;
      }

      if (visited.has(node)) {
        return;
      }
  
      visited.add(node);
  
      if (node.isWord && currentWord.match(ruleRegex)) {
        results.add(currentWord);
      }

      const callNextRuleItem = () => {
        if(remaningRule.length == 0){
          return;
        }
        const nextLetter = remaningRule[0];
        remaningRule.splice(0,1);
        if(nextLetter == '_')
        {
          callNextRound();
        } else {
          const nextNode = node.children[nextLetter];
          dfs(nextNode,
            currentWord + nextLetter,
            remainingLetters,
            jokers,
            remaningRule,
            true);
        }
      }

      const callNextRound = () => {
        if(!ruleIsBeingProcessed) {
          callNextRuleItem();
        }
        for (const letter of remainingLetters) {
          if (letter in node.children) {
            const nextNode = node.children[letter];
            const nextRemainingLetters = remainingLetters.slice();
            nextRemainingLetters.splice(nextRemainingLetters.indexOf(letter), 1);
            dfs(nextNode,
              currentWord + letter,
              nextRemainingLetters,
              jokers,
              remaningRule,
              ruleIsBeingProcessed);
          }
        }
        if (jokers > 0) {
          for (const [childLetter, childNode] of Object.entries(node.children)) {
            dfs(childNode,
              currentWord + childLetter,
              remainingLetters,
              jokers - 1,
              remaningRule,
              ruleIsBeingProcessed);
          }
        }
      }

      if(ruleIsBeingProcessed)
      {
        if(remaningRule.length > 0)
        {
          callNextRuleItem();
        } else {
          ruleIsBeingProcessed = false;
          //if rule is right aligned return
          if(rightAlign)
          {
            return;
          }
          callNextRound();
        }
      } else {
        callNextRound();
      }
      visited.delete(node);
    };
  
    dfs(trieInstance.root, '', letters.split(''), letters.split('').filter((l) => l === '*').length, rule.split(''), leftAlign);
  
    const sortedResults = Array.from(results).sort((a, b) => b.length - a.length);
  
    return sortedResults;
  };
  
  
  