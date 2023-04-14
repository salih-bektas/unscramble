import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface ColoredTextProps {
  text: string;
}

const ColoredText: React.FC<ColoredTextProps> = ({ text }) => {
  const parts = text.split(/(<span style="color: (.*?);">(.*?)<\/span>)/);
  const coloredTextComponents = parts.map((part, index) => {
    const colorMatch = part.match(/<span style="color: (.*?);">(.*?)<\/span>/);

    if (colorMatch) {
      const [, color, text] = colorMatch;
      return (
        <Text key={index} style={[styles.text, { color }]}>
          {text}
        </Text>
      );
    }

    return (
      <Text key={index} style={styles.text}>
        {part}
      </Text>
    );
  });

  return <View style={styles.container}>{coloredTextComponents}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
  },
});

export default ColoredText;
