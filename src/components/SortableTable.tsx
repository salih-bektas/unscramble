import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

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

type PreSortedDataType = {
  [key: string]: {
    asc: Data[];
    desc: Data[];
  };
};

export const SortableTable: React.FC<Props> = ({ columns, data }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [preSortedData, setPreSortedData] = useState<PreSortedDataType>({});

  useEffect(() => {
    const newPreSortedData: PreSortedDataType = {};

    for (const column of columns) {
      if (column.sortable) {
        newPreSortedData[column.id] = {
          asc: [...data].sort((a, b) => {
            if (a[column.id] < b[column.id]) return -1;
            if (a[column.id] > b[column.id]) return 1;
            return 0;
          }),
          desc: [...data].sort((a, b) => {
            if (a[column.id] < b[column.id]) return 1;
            if (a[column.id] > b[column.id]) return -1;
            return 0;
          }),
        };
      }
    }

    setPreSortedData(newPreSortedData);
  }, [data]);

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      return preSortedData[sortConfig.key][sortConfig.direction];
    }
    return data;
  }, [data, preSortedData, sortConfig]);

  const requestSort = (key: string, sortable: boolean) => {
    if (!sortable) return;
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
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

  const renderItem = ({ item }: { item: Data }) => (
    <Row item={item} columns={columns} />
  );

  const Row = React.memo(({ item, columns }: { item: Data; columns: Column[] }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        {columns.map((column, columnIndex) => (
          <View
            key={column.id}
            style={{
              width: columnIndex === 0 ? "50%" : "25%",
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              borderWidth: 1,
              borderColor: "white",
            }}
          >
            {column.id === "word" ? (
              renderColoredText(item["coloredHtml"] as string)
            ) : (
              <Text>{item[column.id]}</Text>
            )}
          </View>
        ))}
      </View>
    );
  });  

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", backgroundColor: "white" }}>
        {columns.map((column, columnIndex) => (
          <TouchableOpacity
            key={column.id}
            onPress={() => requestSort(column.id, column.sortable)}
            style={{
              width: columnIndex === 0 ? "50%" : "25%",
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              backgroundColor: "lightgray",
              borderWidth: 1,
              borderColor: "white",
            }}
          >
            <Text>
              {column.label}{" "}
              {sortConfig && sortConfig.key === column.id
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={sortedData}
        renderItem={({ item }) => renderItem({ item })}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  columnHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  columnHeaderText: {
    marginRight: 4,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    padding: 8,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cellText: {
    textAlign: "center",
  },
  coloredWord: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
