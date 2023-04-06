import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';
import * as SecureStore from 'expo-secure-store';
import { preprocessWords } from '../utils/wordUtils';

const prepareDatabase = async () => {
  const localDbUri = `${FileSystem.documentDirectory}SQLite/wordlist.db`;
  const localDbFolder = `${FileSystem.documentDirectory}SQLite`;

  // Check if the SQLite folder exists, and create it if it doesn't
  const folderInfo = await FileSystem.getInfoAsync(localDbFolder);
  if (!folderInfo.exists) {
    await FileSystem.makeDirectoryAsync(localDbFolder);
  }

  // Check if the database file exists
  const fileInfo = await FileSystem.getInfoAsync(localDbUri);

  if (!fileInfo.exists) {
    // If the database file does not exist, read and write the file
    const asset = Asset.fromModule(require('../../assets/wordlist.db')); // adjust the path to your wordlist.db file
    await asset.downloadAsync();
    const fileData = await FileSystem.readAsStringAsync(asset.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await FileSystem.writeAsStringAsync(localDbUri, fileData, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await SecureStore.setItemAsync('hasDatabaseBeenCopied', 'true');
  }

  return SQLite.openDatabase('wordlist.db');
};

const dbPromise = prepareDatabase();

export const fetchAllWords = async () => {
    const db = await dbPromise;
    return await new Promise((resolve) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM wordlist;',
          [],
          (_, { rows }) => {
            resolve(rows._array.map((row) => row.word));
          }
        );
      });
    });
  };
