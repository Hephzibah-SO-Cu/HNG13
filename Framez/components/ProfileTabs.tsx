import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

type TabType = 'posts' | 'likes' | 'bookmarks';

interface Props {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    postCount: number;
    likeCount: number;
    bookmarkCount: number;
}

export function ProfileTabs({ activeTab, onTabChange, postCount, likeCount, bookmarkCount }: Props) {
    const getTabColor = (tab: TabType) => activeTab === tab ? Colors.primary : Colors.textSecondary;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.tab, activeTab === 'posts' && styles.activeTab]} onPress={() => onTabChange('posts')}>
                <Ionicons name={activeTab === 'posts' ? "grid" : "grid-outline"} size={22} color={getTabColor('posts')} />
                <Text style={[styles.count, { color: getTabColor('posts') }]}>{postCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tab, activeTab === 'likes' && styles.activeTab]} onPress={() => onTabChange('likes')}>
                <Ionicons name={activeTab === 'likes' ? "heart" : "heart-outline"} size={22} color={getTabColor('likes')} />
                <Text style={[styles.count, { color: getTabColor('likes') }]}>{likeCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.tab, activeTab === 'bookmarks' && styles.activeTab]} onPress={() => onTabChange('bookmarks')}>
                <Ionicons name={activeTab === 'bookmarks' ? "bookmark" : "bookmark-outline"} size={22} color={getTabColor('bookmarks')} />
                <Text style={[styles.count, { color: getTabColor('bookmarks') }]}>{bookmarkCount}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.background,
    },
    tab: {
        flex: 1,
        flexDirection: 'row', // Align icon and text horizontally
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 6, // Space between icon and count
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.primary,
    },
    count: {
        fontSize: 14,
        fontWeight: '600',
    }
});