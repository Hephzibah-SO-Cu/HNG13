import { useEffect, useState, useRef, useCallback } from 'react'; // 1. IMPORTED hooks
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Text, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../theme/colors';
import { PostCard } from '../../components/PostCard';
import { RealtimeChannel } from '@supabase/supabase-js';

// --- (Your styles are identical, no changes) ---
const { width } = Dimensions.get('window');
const PILL_HORIZONTAL_MARGIN = 30;
const PILL_WIDTH = width - (PILL_HORIZONTAL_MARGIN * 2);

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // 2. ADDED state to track visible items
  const [visiblePostIds, setVisiblePostIds] = useState<string[]>([]);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(username, avatar_url), likes(count), comments(count)')
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching posts:', error);
      else {
        const formattedPosts = data?.map(post => ({
            ...post,
            likes_count: post.likes[0]?.count || 0,
            comments_count: post.comments[0]?.count || 0,
        })) || [];
        setPosts(formattedPosts);
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchPosts();
    const channel = supabase
      .channel('public:feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, (payload) => handleRealtimeUpdate(payload, 'likes'))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, (payload) => handleRealtimeUpdate(payload, 'comments'))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleRealtimeUpdate = async (payload: any, table: 'likes' | 'comments') => {
      const postId = payload.new?.post_id || payload.old?.post_id;
      if (!postId) return;
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true }).eq('post_id', postId);
      setPosts(currentPosts => 
          currentPosts.map(post => 
              post.id === postId ? { ...post, [`${table}_count`]: count || 0 } : post
          )
      );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  // 3. ADDED visibility handlers
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: any[] }) => {
      setVisiblePostIds(viewableItems.map(item => item.key));
  }, []);

  const viewabilityConfig = useRef({ 
      itemVisiblePercentThreshold: 50 // Item is "visible" when 50% is on screen
  }).current;

  // 4. MODIFIED renderItem
  const renderItem = ({ item }: { item: any }) => (
      <PostCard 
          post={item} 
          initialLikeCount={item.likes_count}
          initialCommentCount={item.comments_count}
          isVisible={visiblePostIds.includes(item.id)} // Pass visibility down
      />
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <View style={[styles.headerContainer, { top: insets.top + 10 }]}>
            <BlurView intensity={60} tint="light" style={styles.headerBlur}>
                 <Text style={styles.logo}>Framez.</Text>
            </BlurView>
        </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={insets.top + 80} />}
        contentContainerStyle={{
            paddingTop: insets.top + 90,
            paddingBottom: 150,
        }}
        ListEmptyComponent={
          <View style={styles.center}>
              <Text style={{ color: Colors.textSecondary }}>No frames yet.</Text>
          </View>
        }
        // 5. ADDED visibility props to FlatList
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
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
      left: 0,
      right: 0,
      marginHorizontal: 30,
      zIndex: 10,
      height: 60,
      borderRadius: 30,
      overflow: 'hidden',
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