import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarTransparent: true,
        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={60}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: 50, // Sits nicely above bottom edge
          marginHorizontal: 30,
          height: 60, // Standard height matching header
          borderRadius: 30, // Perfectly rounded ends
          backgroundColor: Colors.glassLight,
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          overflow: 'hidden', // Kills the dreaded rectangle
        },
        tabBarItemStyle: {
            height: 'auto',
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
             <View style={styles.iconWrapper}>
                <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
                {focused && <View style={styles.activeDot} />}
             </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
             <View style={styles.iconWrapper}>
                <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
                 {focused && <View style={styles.activeDot} />}
             </View>
          ),
        }}
      />

      {/* THE "GOOD BOY" MIDDLE BUTTON */}
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ focused }) => (
            <View style={styles.createButton}>
                <Ionicons name="add" size={30} color={Colors.textInverse} />
            </View>
          ),
        }}
      />

       <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
                <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
                 {focused && <View style={styles.activeDot} />}
             </View>
          ),
        }}
      />

       <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
                <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
                 {focused && <View style={styles.activeDot} />}
             </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.primary,
        position: 'absolute',
        bottom: 8,
    },
    createButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    }
});