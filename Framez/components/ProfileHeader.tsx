import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';

interface Profile {
    id: string;
    username: string | null;
    full_name: string | null; // <-- New Field
    avatar_url: string | null;
    bio: string | null;
}

interface Props {
    profile: Profile | null;
    postCount: number;
    followerCount: number;
    followingCount: number;
    isOwnProfile?: boolean;
    isFollowing?: boolean;
    onFollowToggle?: () => void;
    isFollowLoading?: boolean;
    onEditProfile?: () => void;
}

export function ProfileHeader({
    profile,
    postCount,
    followerCount,
    followingCount,
    isOwnProfile = false,
    isFollowing = false,
    onFollowToggle,
    isFollowLoading = false,
    onEditProfile,
}: Props) {
    const username = profile?.username || 'user';
    const fullName = profile?.full_name || username; // Fallback to username if no full name
    const initials = (fullName[0] || username[0])?.toUpperCase();

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.avatarContainer}>
                    {profile?.avatar_url ? (
                        <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
                    ) : (
                        <Text style={styles.avatarText}>{initials}</Text>
                    )}
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{postCount}</Text>
                        <Text style={styles.statLabel}>frames</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{followerCount}</Text>
                        <Text style={styles.statLabel}>followers</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{followingCount}</Text>
                        <Text style={styles.statLabel}>following</Text>
                    </View>
                </View>
            </View>

            {/* Updated Bio Section */}
            <View style={styles.bioSection}>
                <Text style={styles.fullName}>{fullName}</Text>
                <Text style={styles.username}>@{username}</Text>
                {profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}
            </View>

            <View style={styles.actions}>
                {isOwnProfile ? (
                    <View style={styles.buttonRow}> 
                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={onEditProfile}
                        >
                            <Text style={styles.primaryButtonText}>Edit profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
                            <Text style={styles.secondaryButtonText}>Share profile</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                     <TouchableOpacity
                        style={[styles.button, isFollowing ? styles.secondaryButton : styles.primaryButton]}
                        onPress={onFollowToggle}
                        disabled={isFollowLoading}
                    >
                        {isFollowLoading ? (
                            <ActivityIndicator size="small" color={isFollowing ? Colors.textPrimary : Colors.textInverse} />
                        ) : (
                            <Text style={isFollowing ? styles.secondaryButtonText : styles.primaryButtonText}>
                                {isFollowing ? 'Following' : 'Follow'}
                            </Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingTop: 10, backgroundColor: Colors.background },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    avatarContainer: { width: 86, height: 86, borderRadius: 43, backgroundColor: Colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.border },
    avatar: { width: '100%', height: '100%', borderRadius: 43 },
    avatarText: { fontSize: 32, fontWeight: '600', color: Colors.textPrimary },
    statsContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-around', marginLeft: 20 },
    statItem: { alignItems: 'center' },
    statNumber: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
    statLabel: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
    bioSection: { marginBottom: 20 },
    // NEW STYLES for Name/Handle split
    fullName: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
    username: { fontSize: 15, color: Colors.textSecondary, marginBottom: 8 },
    bio: { fontSize: 15, color: Colors.textPrimary, lineHeight: 20 },
    actions: { flexDirection: 'row', gap: 10 },
    buttonRow: {
        flex: 1,
        flexDirection: 'row',
        gap: 10,
    },
    button: { flex: 1, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    primaryButton: { backgroundColor: Colors.primary },
    primaryButtonText: { color: Colors.textInverse, fontWeight: '600', fontSize: 14 },
    secondaryButton: { backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border },
    secondaryButtonText: { color: Colors.textPrimary, fontWeight: '600', fontSize: 14 },
});