import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TestResult} from '../tests/types';

interface TestResultRowProps {
  moduleId: string;
  result: TestResult;
}

export function TestResultRow({moduleId, result}: TestResultRowProps) {
  const statusColor =
    result.status === 'pass'
      ? '#4CAF50'
      : result.status === 'fail'
        ? '#F44336'
        : '#9E9E9E';

  return (
    <View style={styles.row}>
      <Text
        testID={`${moduleId}-${result.name}-result`}
        style={[styles.status, {color: statusColor}]}>
        {result.status === 'pass'
          ? 'PASS'
          : result.status === 'fail'
            ? 'FAIL'
            : 'RUNNING'}
      </Text>
      <Text style={styles.name}>{result.name}</Text>
      <Text style={styles.detail} numberOfLines={1}>
        {result.detail}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  status: {
    fontWeight: 'bold',
    fontSize: 12,
    width: 55,
    fontFamily: 'Courier',
  },
  name: {
    fontSize: 12,
    color: '#333',
    width: 120,
  },
  detail: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
});
