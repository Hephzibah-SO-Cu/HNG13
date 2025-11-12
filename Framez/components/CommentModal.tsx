import { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router'; // Import router
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Colors } from '../theme/colors';

interface Props {
    visible: boolean;
    onClose: () => void;
    postId: string;
    onCommentAdded?: () => void;
}

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

export function CommentModal({ visible, onClose, postId, onCommentAdded }: Props) {
    const router = useRouter(); // Get router
    const { session } = useAuthStore();
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (visible) fetchComments();
    }, [visible, postId]);

    async function fetchComments() {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('comments')
            .select('*, profiles(username, avatar_url, id)') // Fetch ID too!
            .eq('post_id', postId)
            .order('created_at', { ascending: true });
        if (!error && data) setComments(data);
        setIsLoading(false);
    }

    async function handleSend() {
        if (!newComment.trim() || !session?.user) return;
        setIsSending(true);
        const { error } = await supabase.from('comments').insert({
            post_id: postId,
            user_id: session.user.id,
            text_content: newComment.trim(),
        });
        if (!error) {
            setNewComment('');
            fetchComments();
            if (onCommentAdded) onCommentAdded();
        }
        setIsSending(false);
    }

    const goToProfile = (userId: string) => {
        onClose(); // Close modal first
        // Small delay to allow modal to close smoothly before navigating
        setTimeout(() => {
             router.push(`/user/${userId}`);
        }, 300);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableOpacity>

             <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContainer} pointerEvents="box-none">
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Comments</Text>
                    </View>

                    {isLoading ? (
                        <ActivityIndicator style={styles.center} color={Colors.primary} />
                    ) : (
                        <FlatList
                            data={comments}
                            keyExtractor={item => item.id}
                            style={{ flex: 1 }}
                            contentContainerStyle={styles.listContent}
                            renderItem={({ item }) => (
                                <View style={styles.commentItem}>
                                    <TouchableOpacity onPress={() => goToProfile(item.user_id)}>
                                        <View style={styles.avatar}>
                                            <Text style={styles.avatarText}>{item.profiles?.username?.[0]?.toUpperCase() || '?'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={styles.commentContent}>
                                        <View style={styles.commentHeader}>
                                            <TouchableOpacity onPress={() => goToProfile(item.user_id)}>
                                                <Text style={styles.commentUsername}>{item.profiles?.username || 'Unknown'}</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.commentTime}>{timeAgo(item.created_at)}</Text>
                                        </View>
                                        <Text style={styles.commentText}>{item.text_content}</Text>
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={<Text style={styles.emptyText}>No comments yet.</Text>}
                        />
                    )}

                    <BlurView intensity={100} tint="light" style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Add a comment..."
                            value={newComment}
                            onChangeText={setNewComment}
                            placeholderTextColor={Colors.textSecondary}
                            multiline
                        />
                        <TouchableOpacity onPress={handleSend} disabled={isSending || !newComment.trim()} style={styles.sendButton}>
                             {isSending ? <ActivityIndicator color={Colors.primary} /> : <Ionicons name="arrow-up-circle" size={38} color={newComment.trim() ? Colors.primary : Colors.border} />}
                        </TouchableOpacity>
                    </BlurView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
    modalContainer: { flex: 1, justifyContent: 'flex-end' },
    modalContent: { height: '75%', backgroundColor: Colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
    header: { alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
    headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
    center: { flex: 1, justifyContent: 'center' },
    listContent: { padding: 16, paddingBottom: 100 },
    commentItem: { flexDirection: 'row', marginBottom: 24 },
    avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: Colors.border },
    avatarText: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
    commentContent: { flex: 1, justifyContent: 'center' },
    commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    commentUsername: { fontWeight: '700', marginRight: 8, color: Colors.textPrimary, fontSize: 14 },
    commentTime: { color: Colors.textSecondary, fontSize: 12 },
    commentText: { color: Colors.textPrimary, lineHeight: 20, fontSize: 15 },
    emptyText: { color: Colors.textSecondary, textAlign: 'center', marginTop: 40, fontSize: 16 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: Colors.border, position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.glassLight },
    input: { flex: 1, minHeight: 44, maxHeight: 100, backgroundColor: Colors.background, borderRadius: 22, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, marginRight: 12, fontSize: 16, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border },
    sendButton: { justifyContent: 'center', alignItems: 'center', height: 44, width: 44 }
});