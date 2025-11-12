import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router'; // Import useRouter
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { Colors } from '../../theme/colors';

// Helper function (clean)
function timeAgo(dateString: string) {
    const now = new Date();
    const past = new Date(dateString);
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const elapsed = now.getTime() - past.getTime();

    if (elapsed < msPerMinute) return Math.round(elapsed/1000) + 's';
    else if (elapsed < msPerHour) return Math.round(elapsed/msPerMinute) + 'm';
    else if (elapsed < msPerDay) return Math.round(elapsed/msPerHour) + 'h';
    else return Math.round(elapsed/msPerDay) + 'd';
}

export default function ActivityScreen() {
  const { session } = useAuthStore();
  const router = useRouter(); // Use router for navigation
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchActivity() {
    if (!session?.user) return;
    setIsLoading(true);

    try {
      // --- CORRECTED RPC CALL ---
      const { data, error } = await supabase.rpc('get_activity_feed');
      if (error) throw error;
      setActivities(data || []);

    } catch (error) {
      console.error("Error fetching activity:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchActivity();
  }, [session]);

  const renderActivityItem = ({ item }: { item: any }) => {
    const username = item.username || 'Someone';
    const avatarUrl = item.avatar_url;
    const initials = username[0]?.toUpperCase();

    let textContent = '';
    let icon: React.ComponentProps<typeof Ionicons>['name'] = 'notifications-outline';
    let mainAction = () => {}; // Default action
    let postAction = () => {}; // Action for the post thumbnail

    if (item.type === 'follow') {
      textContent = 'started following you.';
      icon = 'person-add-outline';
      mainAction = () => router.push(`/user/${item.user_id}`);
    } else if (item.type === 'like') {
      textContent = 'liked your post.';
      icon = 'heart-outline';
      mainAction = () => router.push(`/post/${item.post_id}`);
      postAction = mainAction;
    } else if (item.type === 'comment') {
      textContent = `commented: ${item.comment_text}`;
      icon = 'chatbubble-outline';
      mainAction = () => router.push(`/post/${item.post_id}`);
      postAction = mainAction;
    }

    return (
      // --- WEB HYDRATION FIX ---
      // The TouchableOpacity is now the only link.
      // We removed the nested <Link> tags.
      <TouchableOpacity style={styles.itemContainer} onPress={mainAction}>
          {/* Avatar (links to user) */}
          <TouchableOpacity onPress={() => router.push(`/user/${item.user_id}`)}>
            <View style={styles.avatarPlaceholder}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
          </TouchableOpacity>
          
          {/* Text (links to main action) */}
          <View style={styles.textContainer}>
            <Text style={styles.activityText} numberOfLines={2}>
              <Text style={styles.username} onPress={() => router.push(`/user/${item.user_id}`)}>
                {username}
              </Text> {textContent}
            </Text>
            <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
          </View>

          {/* Icon or Post Image (links to post) */}
          {item.type === 'follow' ? (
            <Ionicons name={icon} size={24} color={Colors.textSecondary} />
          ) : (
            <TouchableOpacity onPress={postAction}>
              <Image source={{ uri: item.post_image_url }} style={styles.postThumbnail} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 50 }} color={Colors.primary} />
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id.toString()} // Ensure key is a string
          renderItem={renderActivityItem}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="notifications-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>No new activity</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { color: Colors.textSecondary, marginTop: 12, fontSize: 16 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { fontWeight: '600', color: Colors.textPrimary },
  textContainer: { flex: 1, marginRight: 12 },
  activityText: { fontSize: 15, color: Colors.textPrimary, lineHeight: 20 },
  username: { fontWeight: '700' },
  time: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  postThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  }
});