import { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Video, ResizeMode, Audio } from 'expo-av';
import { useIsFocused } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Colors } from '../theme/colors';
import { CommentModal } from './CommentModal';

interface Post {
  id: string;
  created_at: string;
  text_content: string | null;
  image_url: string | null;
  type: 'photo' | 'text' | 'video' | 'audio' | null;
  user_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

interface Props {
  post: Post;
  initialLikeCount?: number;
  initialCommentCount?: number;
  isVisible?: boolean;
}

const { width } = Dimensions.get('window');

export function PostCard({ post, initialLikeCount, initialCommentCount, isVisible = true }: Props) {
  const router = useRouter();
  const { session } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  const [commentCount, setCommentCount] = useState(initialCommentCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<Video>(null);
  const isTabFocused = useIsFocused();

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const username = post.profiles?.username || 'Anonymous';
  const avatarUrl = post.profiles?.avatar_url;
  const date = new Date(post.created_at).toLocaleDateString();

  useEffect(() => {
    if (initialLikeCount !== undefined) setLikeCount(initialLikeCount);
    if (initialCommentCount !== undefined) setCommentCount(initialCommentCount);
    if (!session?.user) return;
    const checkInteractions = async () => {
        const { data: likeData } = await supabase.from('likes').select('post_id').eq('post_id', post.id).eq('user_id', session.user.id).maybeSingle();
        setIsLiked(!!likeData);
        const { data: bookmarkData } = await supabase.from('bookmarks').select('post_id').eq('post_id', post.id).eq('user_id', session.user.id).maybeSingle();
        setIsBookmarked(!!bookmarkData);
        if (initialLikeCount === undefined) {
          const { count: lCount } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('post_id', post.id);
          setLikeCount(lCount || 0);
        }
        if (initialCommentCount === undefined) {
          const { count: cCount } = await supabase.from('comments').select('*', { count: 'exact', head: true }).eq('post_id', post.id);
          setCommentCount(cCount || 0);
        }
    };
    checkInteractions();
  }, [post.id, session?.user, initialLikeCount, initialCommentCount]);

  useEffect(() => {
      if (!isTabFocused || !isVisible) {
          if (isPlaying) setIsPlaying(false);
          if (sound) {
              sound.unloadAsync();
              setIsAudioPlaying(false);
              setSound(null);
          }
      }
  }, [isTabFocused, isVisible]);

  useEffect(() => {
      return () => { sound?.unloadAsync(); }
  }, [sound]);

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

  const goToProfile = () => {
    if (post.user_id) {
      router.push(`/user/${post.user_id}`);
    }
  };

  const togglePlayPause = () => {
      setIsPlaying(!isPlaying);
  };

  const toggleAudioPlay = async () => {
      if (!post.image_url) return;
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true });
      if (sound) {
          if (isAudioPlaying) {
              await sound.pauseAsync();
              setIsAudioPlaying(false);
          } else {
              await sound.playAsync();
              setIsAudioPlaying(true);
          }
      } else {
          try {
              const { sound: newSound } = await Audio.Sound.createAsync(
                  { uri: post.image_url },
                   { shouldPlay: true }
              );
              setSound(newSound);
              setIsAudioPlaying(true);
              newSound.setOnPlaybackStatusUpdate((status) => {
                  if (status.isLoaded && status.didJustFinish) {
                      setIsAudioPlaying(false);
                      newSound.setPositionAsync(0);
                  }
              });
          } catch (error) {
              console.error("Error loading audio:", error);
        }
      }
  };

  // --- 1. ADDED TINT LOGIC ---
  const getBackgroundColor = () => {
      if (isBookmarked) {
          return Colors.tints.bookmark;
      }
      switch (post.type) {
          case 'photo': return Colors.tints.photo;
          case 'video': return Colors.tints.video;
          case 'audio': return Colors.tints.audio;
          case 'text': return Colors.tints.text;
          default: return Colors.tints.base;
      }
  };

  const renderFrameContent = () => {
      if (post.type === 'video' && post.image_url) {
          return (
              <TouchableOpacity activeOpacity={0.9} onPress={togglePlayPause}>
                  <View style={styles.videoContainer}>
                      <Video
                          ref={videoRef}
                          source={{ uri: post.image_url }}
                          style={styles.image}
                          resizeMode={ResizeMode.COVER}
                          isLooping
                          shouldPlay={isPlaying && isVisible && isTabFocused}
                          isMuted={isMuted}
                      />
                      {!isPlaying && (
                          <View style={styles.videoOverlay}>
                              <Ionicons name="play" size={60} color="rgba(255,255,255,0.8)" />
                          </View>
                      )}
                      <TouchableOpacity style={styles.muteButton} onPress={() => setIsMuted(!isMuted)}>
                          <Ionicons name={isMuted ? "volume-mute-outline" : "volume-high-outline"} size={20} color="white" />
                      </TouchableOpacity>
                  </View>
              </TouchableOpacity>
          );
      }

      if (post.type === 'audio' && post.image_url) {
          return (
              <View style={styles.audioFrameContainer}>
                  <TouchableOpacity style={styles.audioPlayButton} onPress={toggleAudioPlay}>
                      <Ionicons name={isAudioPlaying ? "pause" : "play"} size={32} color={Colors.textInverse} />
                  </TouchableOpacity>
                  <View style={styles.audioInfo}>
                     <Text style={styles.audioTitle} numberOfLines={1}>{post.text_content || "Audio Frame"}</Text>
                      <Text style={styles.audioUser}>{username}</Text>
                  </View>
              </View>
          );
      }

      if (post.type === 'text' && post.text_content) {
          return (
              <View style={styles.textFrameContainer}>
                  <Text style={styles.textFrameContent}>{post.text_content}</Text>
              </View>
          );
      }

      if (post.image_url) {
           return <Image source={{ uri: post.image_url }} style={styles.image} resizeMode="cover" />;
      }
      
      return (
          <View style={[styles.image, styles.placeholderFallback]}>
              <Ionicons name="alert-circle-outline" size={40} color={Colors.textSecondary} />
          </View>
      );
  };

 return (
  // --- 2. APPLIED DYNAMIC STYLE ---
 <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
 <View style={styles.header}>
 <TouchableOpacity onPress={goToProfile}>
 <View style={styles.avatarPlaceholder}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
           ) : (
                <Text style={styles.avatarText}>{username[0]?.toUpperCase()}</Text>
              )}
 </View>
 </TouchableOpacity>
 <TouchableOpacity onPress={goToProfile} style={{ flex: 1 }}>
 <Text style={styles.username}>{username}</Text>
 </TouchableOpacity>
 <Text style={styles.date}>{date}</Text>
 </View>

 {renderFrameContent()}

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

 {post.text_content && post.type !== 'text' && (
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
 container: { 
    marginVertical: 10,
    shadowColor: 'glow',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 12,
    overflow: 'hidden',
    // 3. REMOVED background color from here
  },
 header: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 16 },
 avatarPlaceholder: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
 avatarImage: { width: '100%', height: '100%' },
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
 textFrameContainer: {
      width: width,
      minHeight: width / 1.5,
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
      // MODIFIED: No longer needs its own background
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: Colors.border,
  },
  textFrameContent: {
      fontSize: 22,
      fontWeight: '600',
      color: Colors.textPrimary,
      textAlign: 'center',
     lineHeight: 30,
  },
  placeholderFallback: {
      alignItems: 'center',
      justifyContent: 'center'
  },
  videoContainer: {
      width: width,
      height: width,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
  },
  videoOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.2)',
  },
  muteButton: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      backgroundColor: 'rgba(0,0,0,0.4)',
      padding: 6,
      borderRadius: 16,
  },
  audioFrameContainer: {
      width: width,
      height: width / 2,
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.primary, // This one keeps its dark bg
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: Colors.border,
      flexDirection: 'row',
  },
  audioPlayButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  audioInfo: {
      flex: 1,
      marginLeft: 16,
  },
  audioTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: Colors.textInverse,
      marginBottom: 4,
  },
  audioUser: {
      fontSize: 14,
      color: Colors.textSecondary,
  }
});