import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../theme/colors';

// This file is just a loading placeholder.
// _layout.tsx handles the actual redirection to /(tabs) or /auth/login
export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}