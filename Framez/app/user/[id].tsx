import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { Colors } from '../../theme/colors';
import { ProfileHeader } from '../../components/ProfileHeader';

const { width } = Dimensions.get('window');
const GRID_ITEM_SIZE = width / 3;

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [counts, setCounts] = useState({ posts: 0, followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
      if (session?.user && id === session.user.id) {
          router.replace('/(tabs)/profile');
      }
  }, [id, session]);

  async function fetchUserProfile() {
    try {
      if (!refreshing) setIsLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      if (profileError) throw profileError;
      setProfile(profileData);

      const [postsData, followersData, followingData, followStatus] = await Promise.all([
          supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', id),
          supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', id),
          supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', id),
          session?.user ? supabase.from('follows').select('*').eq('follower_id', session.user.id).eq('following_id', id).maybeSingle() : Promise.resolve({ data: null })
      ]);

      setCounts({
          posts: postsData.count || 0,
          followers: followersData.count || 0,
          following: followingData.count || 0,
      });
      setIsFollowing(!!followStatus.data);

      // MODIFIED: Select 'type'
      const { data: postsGrid } = await supabase
        .from('posts')
        .select('id, image_url, type')
        .eq('user_id', id)
        .order('created_at', { ascending: false });
      setPosts(postsGrid || []);

    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
      if (id) {
          fetchUserProfile();
          const channel = supabase
              .channel(`profile:${id}`)
              .on('postgres_changes', { event: '*', schema: 'public', table: 'follows', filter: `following_id=eq.${id}` },
                  (payload) => {
                      const fetchCounts = async () => {
                           const { count } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', id);
                           setCounts(prev => ({ ...prev, followers: count || 0 }));
                      };
                      fetchCounts();
                  }
              )
              .subscribe();
          return () => { supabase.removeChannel(channel); };
      }
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserProfile();
  };

  const handleFollowToggle = async () => {
      if (!session?.user || isFollowLoading || !id) return;
      setIsFollowLoading(true);

      try {
          if (isFollowing) {
              const { error } = await supabase
                .from('follows')
                .delete()
                .eq('follower_id', session.user.id)
                .eq('following_id', id);
              if (error) throw error;
              setCounts(prev => ({ ...prev, followers: prev.followers - 1 }));
          } else {
              const { error } = await supabase
                .from('follows')
                .insert({ follower_id: session.user.id, following_id: id });
              if (error) throw error;
              setCounts(prev => ({ ...prev, followers: prev.followers + 1 }));
          }
          setIsFollowing(!isFollowing);
      } catch (error) {
          console.error('Follow error:', error);
      } finally {
          setIsFollowLoading(false);
      }
  };

  // --- MODIFIED: The New Grid Item Renderer ---
  const renderGridItem = ({ item }: { item: any }) => {
      let content = null;
      let tint = Colors.tints.base;

      switch (item.type) {
          case 'photo':
              tint = Colors.tints.photo;
              content = <Image source={{ uri: item.image_url }} style={styles.gridImage} />;
              break;
          case 'video':
              tint = Colors.tints.video;
              content = <Ionicons name="videocam" size={GRID_ITEM_SIZE / 3.5} color={Colors.glow.video} />;
              break;
          case 'audio':
              tint = Colors.tints.audio;
              content = <Ionicons name="musical-notes" size={GRID_ITEM_SIZE / 3.5} color={Colors.glow.audio} />;
              break;
          case 'text':
              tint = Colors.tints.text;
              content = <Ionicons name="text" size={GRID_ITEM_SIZE / 3.5} color={Colors.glow.text} />;
              break;
          default:
              if (item.image_url) {
                  tint = Colors.tints.photo;
                  content = <Image source={{ uri: item.image_url }} style={styles.gridImage} />;
              }
      }

      return (
          <TouchableOpacity style={styles.gridItem}>
              <View style={[styles.gridItemInner, { backgroundColor: tint }]}>
                  {content}
              </View>
          </TouchableOpacity>
      );
  };
  // --- END OF MODIFICATION ---

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.topBar}>
         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
         </TouchableOpacity>
         <Text style={styles.topBarUsername}>{profile?.username}</Text>
         <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        ListHeaderComponent={
            <ProfileHeader
                profile={profile}
                postCount={counts.posts}
                followerCount={counts.followers}
                followingCount={counts.following}
                isOwnProfile={false}
                isFollowing={isFollowing}
                onFollowToggle={handleFollowToggle}
                isFollowLoading={isFollowLoading}
            />
        }
        renderItem={renderGridItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
             <View style={styles.emptyState}>
                <Ionicons name="camera-outline" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>No frames yet</Text>
            </View>
        }
      />
    </SafeAreaView>
  );
}

// --- ADDED NEW STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 44, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backButton: { paddingRight: 16 },
  topBarUsername: { fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center' },
  gridItem: { width: GRID_ITEM_SIZE, height: GRID_ITEM_SIZE, borderWidth: 1, borderColor: Colors.background },
  gridImage: { width: '100%', height: '100%' },
  emptyState: { padding: 40, alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  emptyText: { color: Colors.textSecondary, marginTop: 12, fontSize: 16 },
  // ADDED
  gridItemInner: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
});