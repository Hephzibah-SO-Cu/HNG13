import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../theme/colors';

const { width } = Dimensions.get('window');
const PILL_HORIZONTAL_MARGIN = 30;
const PILL_WIDTH = width - (PILL_HORIZONTAL_MARGIN * 2);
const GRID_ITEM_SIZE = width / 3;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [explorePosts, setExplorePosts] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const fetchExplorePosts = async () => {
    setIsLoading(true);
    // MODIFIED: Select 'type'
    const { data, error } = await supabase
      .from('posts')
      .select('id, image_url, type')
      .order('created_at', { ascending: false })
      .limit(30);
    
    if (error) console.error("Error fetching explore posts:", error);
    else setExplorePosts(data || []);
    setIsLoading(false);
  };

  const performSearch = async (query: string) => {
    if (query.length === 0) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${query}%`)
      .limit(10);
    
    if (error) console.error("Error searching users:", error);
    else setSearchResults(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      performSearch(searchQuery.trim());
    }, 300);
    
    return () => clearTimeout(handler);
  }, [searchQuery]);

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

  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => router.push(`/user/${item.id}`)}>
      <View style={styles.avatarPlaceholder}>
        {item.avatar_url ? (
          <Image source={{ uri: item.avatar_url }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>{item.username[0]?.toUpperCase()}</Text>
        )}
      </View>
      <View>
        <Text style={styles.username}>{item.username}</Text>
        {item.full_name && <Text style={styles.fullName}>{item.full_name}</Text>}
      </View>
    </TouchableOpacity>
  );

  const isSearching = searchQuery.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { top: insets.top + 10 }]}>
        <BlurView intensity={60} tint="light" style={styles.headerBlur}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </BlurView>
      </View>

      <FlatList
        data={isSearching ? searchResults : explorePosts}
        key={isSearching ? 'search-list' : 'explore-grid'}
        keyExtractor={(item) => item.id}
        numColumns={isSearching ? 1 : 3}
        renderItem={isSearching ? renderUserItem : renderGridItem}
        contentContainerStyle={{
          paddingTop: insets.top + 90,
          paddingBottom: 150,
        }}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.center}>
              <Text style={{ color: Colors.textSecondary }}>
                {isSearching ? 'No users found.' : 'No frames to explore.'}
              </Text>
            </View>
          ) : null
        }
        ListHeaderComponent={isLoading ? <ActivityIndicator style={{ margin: 20 }} color={Colors.primary} /> : null}
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
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    borderWidth: 1,
    borderColor: Colors.background,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
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
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  fullName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  // ADDED
  gridItemInner: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
});