import { Trie } from '../utils/trie';
import { fetchAllWords } from './index';

// Add interface for word object
export interface WordObject {
  word: string;
}

let trieInstance: Trie | null = null;

export const preprocess = async (): Promise<Trie> => {
  if (!trieInstance) {
    const wordObjects = await fetchAllWords();
    const words: string[] = [];
    for (const wordObj of wordObjects) {
      words.push(wordObj);
    }
    trieInstance = new Trie();
    trieInstance.buildTrie(words);
  }
  return trieInstance;
};


// Export the trie instance as a singleton
export const trie = preprocess();
