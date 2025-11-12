import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../theme/colors';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    // 1. Basic Validation
    if (!email.trim() || !password || !username.trim()) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please fill in all fields.' });
      return;
    }
    if (username.trim().length < 3) {
        Toast.show({ type: 'error', text1: 'Invalid Username', text2: 'Username must be at least 3 characters long.' });
        return;
    }
    if (password.length < 6) {
         Toast.show({ type: 'error', text1: 'Weak Password', text2: 'Password must be at least 6 characters long.' });
        return;
    }

    setIsLoading(true);

    // 2. Sign up with username in metadata
    const { data: { session, user }, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          username: username.trim().toLowerCase(), // Send the username here
        }
      }
    });

    if (signUpError) {
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: signUpError.message });
      setIsLoading(false);
      return;
    }

    // 3. Handle email confirmation
    if (user && !session) {
         Toast.show({
            type: 'info',
            text1: 'Check your email',
            text2: 'Please confirm your email address.',
            visibilityTime: 5000,
         });
         setIsLoading(false);
         return;
    }
    
    // If auto-confirmation is on, the SQL trigger has already created the profile.
    Toast.show({ type: 'success', text1: 'Welcome to Framez!' });
    setIsLoading(false);
    // The _layout.tsx listener will automatically redirect to the feed.
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Create account.</Text>
            <Text style={styles.subtitle}>Join Framez today.</Text>
          </View>
          <View style={styles.form}>
            <Input label="Username" placeholder="cooluser123" autoCapitalize="none" value={username} onChangeText={setUsername} />
            <Input label="Email" placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <Input label="Password" placeholder="Min. 6 characters" secureTextEntry value={password} onChangeText={setPassword} />
            <Button title="Sign Up" onPress={handleRegister} isLoading={isLoading} style={styles.signUpButton} />
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Button title="Sign in instead" variant="text" onPress={() => router.back()} />
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
  signUpButton: { marginTop: 16 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 'auto', paddingBottom: 16 },
  footerText: { color: Colors.textSecondary, marginRight: 8 },
});