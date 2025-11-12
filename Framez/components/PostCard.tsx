import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router'; // Import router
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Colors } from '../theme/colors';
import { CommentModal } from './CommentModal';

interface Post {
  id: string;
  created_at: string;
  text_content: string | null;
  image_url: string;
  user_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

interface Props {
  post: Post;
}

const { width } = Dimensions.get('window');

export function PostCard({ post }: Props) {
  const router = useRouter(); // Get router
  const { session } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);

  const username = post.profiles?.username || 'Anonymous';
  const date = new Date(post.created_at).toLocaleDateString();

  useEffect(() => {
    if (!session?.user) return;

    const checkInteractions = async () => {
        const { data: likeData } = await supabase.from('likes').select('post_id').eq('post_id', post.id).eq('user_id', session.user.id).maybeSingle();
        setIsLiked(!!likeData);

        const { data: bookmarkData } = await supabase.from('bookmarks').select('post_id').eq('post_id', post.id).eq('user_id', session.user.id).maybeSingle();
        setIsBookmarked(!!bookmarkData);

        const { count: lCount } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('post_id', post.id);
        setLikeCount(lCount || 0);

        const { count: cCount } = await supabase.from('comments').select('*', { count: 'exact', head: true }).eq('post_id', post.id);
        setCommentCount(cCount || 0);
    };

    checkInteractions();
  }, [post.id, session?.user]);

  const toggleLike = async () => {
      if (!session?.user) return;
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (newLikedState) {
          await supabase.from('likes').insert({ user_id: session.user.id, post_id: post.id });
      } else {
          await supabase.from('likes').delete().eq('user_id', session.user.id).eq('post_id', post.id);
      }
  };

  const toggleBookmark = async () => {
      if (!session?.user) return;
      const newBookmarkState = !isBookmarked;
      setIsBookmarked(newBookmarkState);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      if (newBookmarkState) {
           await supabase.from('bookmarks').insert({ user_id: session.user.id, post_id: post.id });
      } else {
           await supabase.from('bookmarks').delete().eq('user_id', session.user.id).eq('post_id', post.id);
      }
  };

  // Navigation helper
  const goToProfile = () => {
      if (post.user_id) {
          router.push(`/user/${post.user_id}`);
      }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToProfile}>
            <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{username[0]?.toUpperCase()}</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToProfile} style={{ flex: 1 }}>
            <Text style={styles.username}>{username}</Text>
        </TouchableOpacity>
        <Text style={styles.date}>{date}</Text>
      </View>

      <Image source={{ uri: post.image_url }} style={styles.image} resizeMode="cover" />

      <View style={styles.actions}>
          <View style={styles.leftActions}>
              <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
                  <Ionicons name={isLiked ? "heart" : "heart-outline"} size={28} color={isLiked ? Colors.error : Colors.textPrimary} />
                   {likeCount > 0 && <Text style={styles.actionText}>{likeCount}</Text>}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowComments(true)} style={styles.actionButton}>
                  <Ionicons name="chatbubble-outline" size={26} color={Colors.textPrimary} />
                  {commentCount > 0 && <Text style={styles.actionText}>{commentCount}</Text>}
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="paper-plane-outline" size={26} color={Colors.textPrimary} />
              </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={toggleBookmark}>
               <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={26} color={isBookmarked ? Colors.primary : Colors.textPrimary} />
          </TouchableOpacity>
      </View>

      {post.text_content && (
        <View style={styles.footer}>
          <Text style={styles.caption}>
            <Text style={styles.usernameInline} onPress={goToProfile}>{username}</Text> {post.text_content}
          </Text>
        </View>
      )}

      <CommentModal
        visible={showComments}
        onClose={() => setShowComments(false)}
        postId={post.id}
        onCommentAdded={() => setCommentCount(prev => prev + 1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 16 },
  avatarPlaceholder: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 1, borderColor: Colors.border },
  avatarText: { fontWeight: '600', color: Colors.textPrimary },
  username: { fontWeight: '600', color: Colors.textPrimary },
  date: { color: Colors.textSecondary, fontSize: 12 },
  image: { width: width, height: width, backgroundColor: Colors.backgroundSecondary },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  leftActions: { flexDirection: 'row', gap: 20 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  footer: { paddingHorizontal: 16, paddingBottom: 12 },
  caption: { color: Colors.textPrimary, lineHeight: 20 },
  usernameInline: { fontWeight: '700', marginRight: 6 },
});