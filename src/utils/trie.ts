import { WordObject } from '../database/preprocess';

export class TrieNode {
    children: { [key: string]: TrieNode };
    isWord: boolean;
  
    constructor() {
      this.children = {};
      this.isWord = false;
    }
  }
  
  export class Trie {
    root: TrieNode;
  
    constructor() {
        this.root = new TrieNode();
    }
  
    buildTrie(words: string[]): void {
        //console.log('Words in buildTrie (input):', words.slice(0, 10));
        for (const word of words) {
          //console.log('Processing word:', word);
          let currentNode = this.root;
          for (const char of word) {
            if (!currentNode.children[char]) {
              currentNode.children[char] = new TrieNode();
            }
            currentNode = currentNode.children[char];
          }
          currentNode.isWord = true;
        }
      }
      
          
  
    searchTrie(word: string): boolean {
        let currentNode = this.root;
    
        for (const char of word) {
            if (!currentNode.children[char]) {
            return false;
            }
            currentNode = currentNode.children[char];
        }
    
        return currentNode.isWord;
    }

    insert(word: string): void {
        let currentNode = this.root;
        for (const char of word) {
            if (!currentNode.children[char]) {
                currentNode.children[char] = new TrieNode();
            }
            currentNode = currentNode.children[char];
        }
        currentNode.isWord = true;
    }
    
    contains(word: string): boolean {
        let currentNode = this.root;
        for (const char of word) {
        if (!currentNode.children[char]) {
            return false;
        }
        currentNode = currentNode.children[char];
        }
        return currentNode.isWord;
    }
  }
  