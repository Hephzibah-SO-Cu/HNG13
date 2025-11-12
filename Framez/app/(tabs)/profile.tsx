import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { Colors } from '../../theme/colors';
import { ProfileHeader } from '../../components/ProfileHeader';
import { ProfileTabs } from '../../components/ProfileTabs';

const { width } = Dimensions.get('window');
const GRID_ITEM_SIZE = width / 3;
type TabType = 'posts' | 'likes' | 'bookmarks';

// MOVED STYLES TO THE TOP to fix the 'styles used before declaration' error
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 44, borderBottomWidth: 1, borderBottomColor: Colors.border },
  topBarUsername: { fontSize: 16, fontWeight: '700', marginLeft: 8, flex: 1 },
  logoutButton: { padding: 4 },
  gridItem: { width: GRID_ITEM_SIZE, height: GRID_ITEM_SIZE, borderWidth: 0.5, borderColor: Colors.background },
  gridImage: { width: '100%', height: '100%' },
  emptyState: { padding: 40, alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  emptyText: { color: Colors.textSecondary, marginTop: 12, fontSize: 16 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 10 }
});

export default function ProfileScreen() {
  const { session } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  // Counts now include followers/following
  const [counts, setCounts] = useState({ posts: 0, likes: 0, bookmarks: 0, followers: 0, following: 0 });

  // Helper to get post IDs for likes/bookmarks
  async function getInteractionPostIds(table: 'likes' | 'bookmarks') {
      if (!session?.user) return [];
      const { data } = await supabase.from(table).select('post_id').eq('user_id', session.user.id);
      return data?.map(item => item.post_id) || [];
  }

  async function fetchProfileData() {
    if (!session?.user) return;
    try {
      if (!refreshing) setIsLoading(true);

      // Fetch ALL data in parallel
      const [profileData, postsCount, likesCount, bookmarksCount, followersCount, followingCount] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', session.user.id).single(),
          supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id),
          supabase.from('likes').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id),
          supabase.from('bookmarks').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id),
          supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', session.user.id), // Ppl following me
          supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', session.user.id), // Ppl I follow
      ]);

      if (profileData.data) setProfile(profileData.data);
      setCounts({
          posts: postsCount.count || 0,
          likes: likesCount.count || 0,
          bookmarks: bookmarksCount.count || 0,
          followers: followersCount.count || 0,
          following: followingCount.count || 0,
      });

      // Fetch Tab Content
      let query = supabase.from('posts').select('id, image_url, created_at');
      if (activeTab === 'posts') {
          query = query.eq('user_id', session.user.id);
      } else if (activeTab === 'likes') {
          const ids = await getInteractionPostIds('likes');
          if (ids.length === 0) { setPosts([]); return; }
          query = query.in('id', ids);
      } else if (activeTab === 'bookmarks') {
          const ids = await getInteractionPostIds('bookmarks');
          if (ids.length === 0) { setPosts([]); return; }
          query = query.in('id', ids);
      }

      const { data } = await query.order('created_at', { ascending: false });
      setPosts(data || []);

    } catch (error) {
      console.error('Profile Error:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }

  // Effect for initial fetch AND realtime updates
  useEffect(() => {
    if (session?.user) {
        fetchProfileData(); // Fetch data based on active tab

        // ** REALTIME LISTENER FOR MY OWN PROFILE **
        const channel = supabase
              .channel(`profile:${session.user.id}`)
              .on(
                  'postgres_changes',
                  { 
                      event: '*', schema: 'public', table: 'follows', 
                      // Listen for changes where I am the follower OR the one being followed
                      filter: `follower_id=eq.${session.user.id}` 
                  },
                  // Payload for when I follow someone
                  (payload) => {
                      console.log('I followed someone', payload);
                      setCounts(prev => ({ ...prev, following: prev.following + 1 }));
                  }
              )
              .on(
                  'postgres_changes',
                  { 
                      event: '*', schema: 'public', table: 'follows', 
                      filter: `following_id=eq.${session.user.id}` 
                  },
                   // Payload for when someone follows me
                  (payload) => {
                       console.log('Someone followed me', payload);
                       setCounts(prev => ({ ...prev, followers: prev.followers + 1 }));
                  }
              )
              .subscribe();
        
        return () => { supabase.removeChannel(channel); };
    }
  }, [session, activeTab]); // Re-run when session or tab changes

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileData();
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  const renderGridItem = ({ item }: { item: any }) => (
      <TouchableOpacity style={styles.gridItem}>
          <Image source={{ uri: item.image_url }} style={styles.gridImage} />
      </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
         <Ionicons name="lock-closed-outline" size={16} color={Colors.textPrimary} />
         <Text style={styles.topBarUsername}>{profile?.username}</Text>
         {/* ** FIXED ICON ** */}
         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
             <Ionicons name="log-out-outline" size={28} color={Colors.error} />
         </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        key={activeTab}
        ListHeaderComponent={
            <>
                <ProfileHeader
                    profile={profile}
                    postCount={counts.posts}
                    followerCount={counts.followers} // REAL DATA
                    followingCount={counts.following} // REAL DATA
                    isOwnProfile={true}
                />
                <ProfileTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    postCount={counts.posts}
                    likeCount={counts.likes}
                    bookmarkCount={counts.bookmarks}
                />
            </>
        }
        renderItem={renderGridItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 100, minHeight: '100%' }}
        ListEmptyComponent={!isLoading ? (
            <View style={styles.emptyState}>
                <Ionicons name={activeTab === 'posts' ? "images-outline" : activeTab === 'likes' ? "heart-outline" : "bookmark-outline"} size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>No {activeTab} frames</Text>
            </View>
        ) : null}
      />
      {isLoading && !refreshing && (
           <View style={styles.loadingOverlay}><ActivityIndicator size="large" color={Colors.primary} /></View>
      )}
    </SafeAreaView>
  );
}