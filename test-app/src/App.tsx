import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RNSimpleCrypto from 'react-native-simple-crypto';

const toHex = RNSimpleCrypto.utils.convertArrayBufferToHex;
const toUtf8 = RNSimpleCrypto.utils.convertArrayBufferToUtf8;

function App(): React.JSX.Element {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      addResult('🚀 Starting crypto library tests...\n');

      // Test 1: Random Bytes
      addResult('📝 Test 1: Random Bytes');
      const randomBytes = await RNSimpleCrypto.utils.randomBytes(32);
      addResult(`✅ Generated ${randomBytes.byteLength} random bytes: ${toHex(randomBytes).substring(0, 16)}...\n`);

      // Test 2: SHA Hashing
      addResult('📝 Test 2: SHA Hashing');
      const testString = 'Hello, World!';
      const sha1Hash = await RNSimpleCrypto.SHA.sha1(testString);
      const sha256Hash = await RNSimpleCrypto.SHA.sha256(testString);
      const sha512Hash = await RNSimpleCrypto.SHA.sha512(testString);
      addResult(`✅ SHA-1: ${sha1Hash.substring(0, 16)}...`);
      addResult(`✅ SHA-256: ${sha256Hash.substring(0, 16)}...`);
      addResult(`✅ SHA-512: ${sha512Hash.substring(0, 16)}...\n`);

      // Test 3: AES Encryption/Decryption
      addResult('📝 Test 3: AES Encryption/Decryption');
      const message = 'Secret message for testing';
      const messageBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(message);
      const key = await RNSimpleCrypto.utils.randomBytes(32);
      const iv = await RNSimpleCrypto.utils.randomBytes(16);
      
      const encrypted = await RNSimpleCrypto.AES.encrypt(messageBuffer, key, iv);
      const decrypted = await RNSimpleCrypto.AES.decrypt(encrypted, key, iv);
      const decryptedText = RNSimpleCrypto.utils.convertArrayBufferToUtf8(decrypted);
      
      if (decryptedText === message) {
        addResult('✅ AES encryption/decryption successful');
      } else {
        addResult('❌ AES encryption/decryption failed');
      }
      addResult('');

      // Test 4: HMAC
      addResult('📝 Test 4: HMAC-SHA256');
      const hmacText = 'Message to sign';
      const hmacKey = 'secretKey';
      const hmacTextBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(hmacText);
      const hmacKeyBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(hmacKey);
      
      const hmac = await RNSimpleCrypto.HMAC.hmac256(hmacTextBuffer, hmacKeyBuffer);
      addResult(`✅ HMAC generated: ${toHex(hmac).substring(0, 16)}...\n`);

      // Test 5: PBKDF2
      addResult('📝 Test 5: PBKDF2 Password Hashing');
      const password = 'myPassword';
      const salt = 'randomSalt';
      const iterations = 1000;
      const keyLength = 32;
      const algorithm = 'SHA-256';
      
      const pbkdf2Hash = await RNSimpleCrypto.PBKDF2.hash(password, salt, iterations, keyLength, algorithm);
      addResult(`✅ PBKDF2 hash generated: ${toHex(pbkdf2Hash).substring(0, 16)}...\n`);

      // Test 6: RSA
      addResult('📝 Test 6: RSA Key Generation');
      const rsaKeys = await RNSimpleCrypto.RSA.generateKeys(1024);
      addResult('✅ RSA key pair generated');
      addResult(`Public key: ${rsaKeys.public.substring(0, 50)}...`);
      addResult(`Private key: ${rsaKeys.private.substring(0, 50)}...\n`);

      // Test 7: RSA Encryption/Decryption
      addResult('📝 Test 7: RSA Encryption/Decryption');
      const rsaMessage = 'Hello RSA!';
      const encryptedRsa = await RNSimpleCrypto.RSA.encrypt(rsaMessage, rsaKeys.public);
      const decryptedRsa = await RNSimpleCrypto.RSA.decrypt(encryptedRsa, rsaKeys.private);
      
      if (decryptedRsa === rsaMessage) {
        addResult('✅ RSA encryption/decryption successful\n');
      } else {
        addResult('❌ RSA encryption/decryption failed\n');
      }

      // Test 8: Utility Functions
      addResult('📝 Test 8: Utility Functions');
      const originalText = 'Test string';
      const arrayBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(originalText);
      const base64 = RNSimpleCrypto.utils.convertArrayBufferToBase64(arrayBuffer);
      const hex = RNSimpleCrypto.utils.convertArrayBufferToHex(arrayBuffer);
      const backToBuffer = RNSimpleCrypto.utils.convertBase64ToArrayBuffer(base64);
      const finalText = RNSimpleCrypto.utils.convertArrayBufferToUtf8(backToBuffer);
      
      if (finalText === originalText) {
        addResult('✅ Utility functions working correctly');
      } else {
        addResult('❌ Utility functions failed');
      }
      addResult('');

      addResult('🎉 All tests completed successfully!');
      
    } catch (error) {
      addResult(`❌ Test failed with error: ${error}`);
      console.error('Test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.header}>
        <Text style={styles.title}>React Native Simple Crypto</Text>
        <Text style={styles.subtitle}>E2E Test App</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isRunning && styles.buttonDisabled]}
          onPress={runAllTests}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  buttonContainer: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});

export default App;
