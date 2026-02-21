import React, {useState, useCallback} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {TestResult, TestStatus} from './src/tests/types';
import {TestSection} from './src/components/TestSection';
import {runAesTests} from './src/tests/aesTests';
import {runShaTests} from './src/tests/shaTests';
import {runHmacTests} from './src/tests/hmacTests';
import {runPbkdf2Tests} from './src/tests/pbkdf2Tests';
import {runRsaTests} from './src/tests/rsaTests';
import {runUtilsTests} from './src/tests/utilsTests';

interface SectionState {
  status: TestStatus;
  results: TestResult[];
}

const initialSection: SectionState = {status: 'idle', results: []};

function App() {
  const [aes, setAes] = useState<SectionState>(initialSection);
  const [sha, setSha] = useState<SectionState>(initialSection);
  const [hmac, setHmac] = useState<SectionState>(initialSection);
  const [pbkdf2, setPbkdf2] = useState<SectionState>(initialSection);
  const [rsa, setRsa] = useState<SectionState>(initialSection);
  const [utils, setUtils] = useState<SectionState>(initialSection);
  const [overallStatus, setOverallStatus] = useState<string>('IDLE');

  const runModule = useCallback(
    async (
      runner: () => Promise<TestResult[]>,
      setter: React.Dispatch<React.SetStateAction<SectionState>>,
    ) => {
      setter({status: 'running', results: []});
      try {
        const results = await runner();
        const allPass = results.every(r => r.status === 'pass');
        setter({status: allPass ? 'pass' : 'fail', results});
        return allPass;
      } catch (e: any) {
        setter({
          status: 'fail',
          results: [{name: 'error', status: 'fail', detail: e.message}],
        });
        return false;
      }
    },
    [],
  );

  const runAll = useCallback(async () => {
    setOverallStatus('RUNNING');
    const results = await Promise.all([
      runModule(runAesTests, setAes),
      runModule(runShaTests, setSha),
      runModule(runHmacTests, setHmac),
      runModule(runPbkdf2Tests, setPbkdf2),
      runModule(runRsaTests, setRsa),
      runModule(runUtilsTests, setUtils),
    ]);
    const allPass = results.every(Boolean);
    setOverallStatus(allPass ? 'ALL PASS' : 'SOME FAILED');
  }, [runModule]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Simple Crypto E2E Tests</Text>

        <View style={styles.overallRow}>
          <Text testID="overall-status" style={styles.overallStatus}>
            {overallStatus}
          </Text>
          <TouchableOpacity
            testID="run-all-button"
            style={styles.runAllButton}
            onPress={runAll}
            disabled={overallStatus === 'RUNNING'}>
            <Text style={styles.runAllButtonText}>Run All Tests</Text>
          </TouchableOpacity>
        </View>

        <TestSection
          title="AES"
          moduleId="aes"
          status={aes.status}
          results={aes.results}
          onRun={() => runModule(runAesTests, setAes)}
        />
        <TestSection
          title="SHA"
          moduleId="sha"
          status={sha.status}
          results={sha.results}
          onRun={() => runModule(runShaTests, setSha)}
        />
        <TestSection
          title="HMAC"
          moduleId="hmac"
          status={hmac.status}
          results={hmac.results}
          onRun={() => runModule(runHmacTests, setHmac)}
        />
        <TestSection
          title="PBKDF2"
          moduleId="pbkdf2"
          status={pbkdf2.status}
          results={pbkdf2.results}
          onRun={() => runModule(runPbkdf2Tests, setPbkdf2)}
        />
        <TestSection
          title="RSA"
          moduleId="rsa"
          status={rsa.status}
          results={rsa.results}
          onRun={() => runModule(runRsaTests, setRsa)}
        />
        <TestSection
          title="Utils"
          moduleId="utils"
          status={utils.status}
          results={utils.results}
          onRun={() => runModule(runUtilsTests, setUtils)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingVertical: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  overallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 12,
  },
  overallStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    color: '#333',
  },
  runAllButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  runAllButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default App;
