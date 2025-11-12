import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../theme/colors';
import { PostCard } from '../../components/PostCard';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching posts:', error);
      else setPosts(data || []);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        {/* Uniform Glass Header Pill */}
        <View style={[styles.headerContainer, { top: insets.top + 10 }]}>
            <BlurView intensity={60} tint="light" style={styles.headerBlur}>
                 <Text style={styles.logo}>Framez.</Text>
            </BlurView>
        </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={insets.top + 80} />}
        contentContainerStyle={{
            paddingTop: insets.top + 90,
            paddingBottom: 150, // More padding for the higher tab pill
        }}
        ListEmptyComponent={
          <View style={styles.center}>
              <Text style={{ color: Colors.textSecondary }}>No frames yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  headerContainer: {
      position: 'absolute',
      left: 0, // Reset left/right
      right: 0,
      marginHorizontal: 30, // MATCHING YOUR TAB PILL EXACTLY
      zIndex: 10,
      height: 60,
      borderRadius: 30,
      overflow: 'hidden',
      // Matching shadows
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
  },
  headerBlur: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.glassLight,
  },
  logo: {
      fontSize: 26,
      fontWeight: '800',
      letterSpacing: -1,
      color: Colors.textPrimary,
  }
});