import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../theme/colors';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
       Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please enter both email and password.' });
       return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setIsLoading(false);

    if (error) {
      Toast.show({ type: 'error', text1: 'Login Failed', text2: error.message });
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
                <Text style={styles.title}>Framez.</Text>
                <Text style={styles.subtitle}>Welcome back.</Text>
            </View>
            <View style={styles.form}>
                <Input label="Email" placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
                <Input label="Password" placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
                <Button title="Sign In" onPress={handleLogin} isLoading={isLoading} style={styles.signInButton} />
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <Button title="Create account" variant="text" onPress={() => router.push('/auth/register')} />
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 48 },
  title: { fontSize: 40, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -1 },
  subtitle: { fontSize: 24, color: Colors.textSecondary, marginTop: 8 },
  form: { marginBottom: 24 },
  signInButton: { marginTop: 16 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 'auto', paddingBottom: 16 },
  footerText: { color: Colors.textSecondary, marginRight: 8 },
});