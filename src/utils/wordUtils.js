import { getLetterScore } from './scrabbleUtils';  

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
      coloredWord,
      score,
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

      if (node.isWord && currentWord.match(ruleRegex) && remaningRule.length == 0) {
        results.add({
          word: currentWord,
          length: currentWord.length,
          score: score,
          coloredHtml: coloredWord
        });
      }

      const callNextRuleItem = () => {
        if(remaningRule.length == 0){
          return;
        }
        const nextLetter = remaningRule[0];
        const newRemainingRule = remaningRule.slice(1); // Create a new copy of the remaining rule array
        if(nextLetter == '_')
        {
          callNextRound();
        } else {
          const nextNode = node.children[nextLetter];
          dfs(nextNode,
            currentWord + nextLetter,
            coloredWord + createRuleLetterHtml(nextLetter),
            score + getLetterScore(nextLetter),
            remainingLetters,
            jokers,
            newRemainingRule,
            true
          );
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
              coloredWord + letter,
              score + getLetterScore(letter),
              nextRemainingLetters,
              jokers,
              remaningRule,
              ruleIsBeingProcessed
            );
          }
        }
        if (jokers > 0) {
          for (const [childLetter, childNode] of Object.entries(node.children)) {
            dfs(childNode,
              currentWord + childLetter,
              coloredWord + createJokerLetterHtml(childLetter),
              score,
              remainingLetters,
              jokers - 1,
              remaningRule,
              ruleIsBeingProcessed
            );
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

    dfs(
      trieInstance.root,
      "",
      "",
      0,
      letters.split("").filter((l) => l != "*"),
      letters.split("").filter((l) => l === "*").length,
      rule.split(""),
      false
    );

    const sortedResults = Array.from(results).sort(
      (a, b) => b.word.length - a.word.length
    );

    return sortedResults;
  };
    
  const createJokerLetterHtml = (letter) => {
    return `<span style="color: red;">${letter}</span>`;
  };
  
  const createRuleLetterHtml = (letter) => {
    return `<span style="color: blue;">${letter}</span>`;
  };