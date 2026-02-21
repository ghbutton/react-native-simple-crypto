import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {TestResult, TestStatus} from '../tests/types';
import {TestResultRow} from './TestResultRow';

interface TestSectionProps {
  title: string;
  moduleId: string;
  status: TestStatus;
  results: TestResult[];
  onRun: () => void;
}

export function TestSection({
  title,
  moduleId,
  status,
  results,
  onRun,
}: TestSectionProps) {
  const statusColor =
    status === 'pass'
      ? '#4CAF50'
      : status === 'fail'
        ? '#F44336'
        : status === 'running'
          ? '#FF9800'
          : '#9E9E9E';

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text
          testID={`${moduleId}-status`}
          style={[styles.statusText, {color: statusColor}]}>
          {status.toUpperCase()}
        </Text>
        <TouchableOpacity
          testID={`${moduleId}-run-button`}
          style={[
            styles.runButton,
            status === 'running' && styles.runButtonDisabled,
          ]}
          onPress={onRun}
          disabled={status === 'running'}>
          <Text style={styles.runButtonText}>Run</Text>
        </TouchableOpacity>
      </View>
      {results.map(result => (
        <TestResultRow
          key={result.name}
          moduleId={moduleId}
          result={result}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 6,
    marginHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    fontFamily: 'Courier',
  },
  runButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 4,
  },
  runButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  runButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
