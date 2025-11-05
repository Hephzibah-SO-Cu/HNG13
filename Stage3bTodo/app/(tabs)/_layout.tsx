// app/(tabs)/_layout.tsx
// [MODIFIED]
// We are removing the Tabs and just showing the "index" screen.
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}