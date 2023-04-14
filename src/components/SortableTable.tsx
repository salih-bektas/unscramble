import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

type Column = {
  id: string;
  label: string;
  sortable: boolean;
};

type Data = {
    word: string;
    length: number;
    score: number;
    coloredHtml: string;
    [key: string]: string | number;
};

type Props = {
  columns: Column[];
  data: Data[];
};

export const SortableTable: React.FC<Props> = ({ columns, data }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const sortedData = React.useMemo(() => {
    const sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
}, [data, sortConfig]);

const requestSort = (key: string, sortable: boolean) => {
    if (!sortable) return;
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
};

const renderColoredText = (coloredHtml: string) => {
    const regex = /<span style="color: (.*?);">(.*?)<\/span>/g;
    let match;
    let lastIndex = 0;
    const elements: any[] = [];
  
    while ((match = regex.exec(coloredHtml)) !== null) {
      const [fullMatch, color, text] = match;
      const prefix = coloredHtml.slice(lastIndex, match.index);
  
      if (prefix) {
        elements.push(<Text key={`prefix-${match.index}`}>{prefix}</Text>);
      }
      elements.push(
        <Text key={`colored-${match.index}`} style={{ color }}>
          {text}
        </Text>
      );
  
      lastIndex = match.index + fullMatch.length;
    }
  
    const suffix = coloredHtml.slice(lastIndex);
    if (suffix) {
      elements.push(<Text key={`suffix-${lastIndex}`}>{suffix}</Text>);
    }
  
    return <Text>{elements}</Text>;
  };
  
  

return (
    <ScrollView>
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row' }}>
          {columns.map((column, columnIndex) => (
            <TouchableOpacity
              key={column.id}
              onPress={() => requestSort(column.id, column.sortable)}
              style={{
                width: columnIndex === 0 ? '50%' : '25%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                backgroundColor: 'lightgray',
                borderWidth: 1,
                borderColor: 'white',
              }}
            >
                <Text>
                    {column.label}{' '}
                    {sortConfig && sortConfig.key === column.id
                    ? sortConfig.direction === 'asc'
                        ? '↑'
                        : '↓'
                    : ''}
                </Text>
            </TouchableOpacity>
          ))}
        </View>
        {sortedData.map((row, index) => (
          <View key={index} style={{ flexDirection: 'row' }}>
            {columns.map((column, columnIndex) => (
              <View
                key={column.id}
                style={{
                  width: columnIndex === 0 ? '50%' : '25%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                  borderWidth: 1,
                  borderColor: 'white',
                }}
              >
                {column.id === 'word' ? (
                renderColoredText(row['coloredHtml'] as string)
                ) : (
                <Text>{row[column.id]}</Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
 };
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
   },
   header: {
     flexDirection: 'row',
     borderBottomWidth: 1,
     borderBottomColor: '#ccc',
   },
   columnHeader: {
     flex: 1,
     flexDirection: 'row',
     alignItems: 'center',
     padding: 8,
   },
   columnHeaderText: {
     marginRight: 4,
   },
   row: {
     flexDirection: 'row',
   },
   cell: {
     flex: 1,
     padding: 8,
     justifyContent: 'center',
     borderBottomWidth: 1,
     borderBottomColor: '#ccc',
   },
   cellText: {
     textAlign: 'center',
   },
   coloredWord: {
     flexDirection: 'row',
     justifyContent: 'center',
   },
 });
 