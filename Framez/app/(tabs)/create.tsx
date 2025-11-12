import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker'; // 1. IMPORT DOCUMENT PICKER
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { Colors } from '../../theme/colors';
import { Button } from '../../components/ui/Button';

type FrameType = 'photo' | 'text' | 'video' | 'audio';

export default function CreatePostScreen() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [activeType, setActiveType] = useState<FrameType>('photo');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaName, setMediaName] = useState<string | null>(null); // For audio file name
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pickMedia = async (type: 'photo' | 'video') => {
    const isVideo = type === 'video';
    setMediaName(null); // Clear file name
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: isVideo ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: !isVideo, // Video editing can be buggy
      aspect: [1, 1],
      quality: isVideo ? 0.6 : 0.8,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
    }
  };

  // 2. ADDED function to pick audio files
  const pickAudio = async () => {
      setMediaUri(null); // Clear image/video URI
      try {
          const result = await DocumentPicker.getDocumentAsync({
              type: 'audio/*', // All audio types
              copyToCacheDirectory: true,
          });

          if (!result.canceled && result.assets[0]) {
              setMediaUri(result.assets[0].uri);
              setMediaName(result.assets[0].name);
          }
      } catch (e) {
          Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to pick audio file.' });
      }
  };

  // 3. RENAMED and UPDATED to handle all media
  const uploadMedia = async (uri: string, type: FrameType) => {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();
    
    let fileExt: string | undefined;
    let contentType: string;

    if (type === 'photo' || type === 'video') {
        fileExt = uri.split('.').pop()?.toLowerCase() ?? (type === 'photo' ? 'jpeg' : 'mp4');
        contentType = type === 'photo' ? `image/${fileExt}` : `video/${fileExt}`;
    } else { // audio
        fileExt = uri.split('.').pop()?.toLowerCase() ?? 'mp3';
        contentType = `audio/${fileExt}`;
    }
    
    const fileName = `${session?.user.id}/${uuid.v4()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('post_images') // We're still using one bucket for simplicity
      .upload(fileName, arrayBuffer, { contentType: contentType });

    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('post_images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleShare = async () => {
    if (!session?.user) return;
    setIsLoading(true);

    try {
      let mediaUrl: string | null = null;
      let textContent: string | null = text.trim().length > 0 ? text.trim() : null;

      // 4. UPDATED logic for photo/video/audio
      if (activeType === 'photo' || activeType === 'video' || activeType === 'audio') {
        if (!mediaUri) {
           Toast.show({ type: 'error', text1: 'No File', text2: `Please select a ${activeType}.` });
           setIsLoading(false);
           return;
        }
        mediaUrl = await uploadMedia(mediaUri, activeType);
        // For audio, the 'text' is the track title
        if (activeType === 'audio' && !textContent) {
            textContent = mediaName || "Audio Track";
        }

      } else if (activeType === 'text') {
         if (!textContent) {
             Toast.show({ type: 'error', text1: 'Empty Post', text2: 'Please write something.' });
             setIsLoading(false);
             return;
         }
      }

      const { error } = await supabase.from('posts').insert({
        text_content: textContent,
        image_url: mediaUrl,
        user_id: session.user.id,
        type: activeType,
      });

      if (error) throw error;

      Toast.show({ type: 'success', text1: 'Posted!', text2: 'Your frame is live.' });
      setMediaUri(null);
      setMediaName(null);
      setText('');
      router.push('/(tabs)');

    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Upload Failed', text2: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // 5. UPDATED renderCreator to show audio UI
  const renderCreator = () => {
      if (activeType === 'photo' || activeType === 'video') {
          const isVideo = activeType === 'video';
          return (
              <>
                <TouchableOpacity style={styles.imagePicker} onPress={() => pickMedia(activeType)} activeOpacity={0.8}>
                    {mediaUri ? (
                        isVideo ? (
                           <Video source={{ uri: mediaUri }} style={styles.previewImage} resizeMode={ResizeMode.COVER} isMuted shouldPlay isLooping />
                        ) : (
                           <Image source={{ uri: mediaUri }} style={styles.previewImage} />
                        )
                    ) : (
                        <View style={styles.placeholder}>
                          <Ionicons name={isVideo ? "videocam-outline" : "camera-outline"} size={48} color={Colors.textSecondary} />
                          <Text style={styles.placeholderText}>Tap to select a {activeType}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.captionInput} placeholder="Write a caption..." placeholderTextColor={Colors.textSecondary} multiline value={text} onChangeText={setText} />
                </View>
             </>
          );
      }

      if (activeType === 'text') {
           return (
               <View style={styles.textFrameCreator}>
                    <TextInput style={styles.textFrameInput} placeholder={"What's on your mind?"} placeholderTextColor={Colors.textSecondary} multiline value={text} onChangeText={setText} editable={true} />
                </View>
          );
      }
      
      if (activeType === 'audio') {
           return (
               <View style={[styles.textFrameCreator, { justifyContent: 'center', alignItems: 'center' }]}>
                    <TouchableOpacity style={styles.audioPicker} onPress={pickAudio}>
                        <Ionicons name="musical-notes-outline" size={48} color={Colors.primary} />
                        <Text style={styles.audioPickerText}>{mediaName || "Select an audio file"}</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.captionInput, { marginTop: 20, width: '100%', minHeight: 0 }]}
                        placeholder="Track title or caption..."
                        placeholderTextColor={Colors.textSecondary}
                        value={text}
                        onChangeText={setText}
                    />
               </View>
          );
      }
  };

  const getTabStyle = (type: FrameType) => [ styles.tab, activeType === type && styles.activeTab ];
  const getTabTextStyle = (type: FrameType) => [ styles.tabText, activeType === type && styles.activeTabText ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
             <Text style={styles.headerTitle}>Create a new Frame</Text>
        </View>

        <View style={styles.typeSwitcher}>
            <TouchableOpacity style={getTabStyle('photo')} onPress={() => setActiveType('photo')}>
                <Text style={getTabTextStyle('photo')}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={getTabStyle('text')} onPress={() => setActiveType('text')}>
                <Text style={getTabTextStyle('text')}>Text</Text>
            </TouchableOpacity>
            <TouchableOpacity style={getTabStyle('video')} onPress={() => setActiveType('video')}>
                <Text style={getTabTextStyle('video')}>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={getTabStyle('audio')} onPress={() => setActiveType('audio')}>
                <Text style={getTabTextStyle('audio')}>Audio</Text>
            </TouchableOpacity>
        </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderCreator()}
      </ScrollView>

      {/* Your fix for the footer position */}
      <View style={[styles.footer, { bottom: 125 }]}> 
        <Button
            title="Share Frame"
            onPress={handleShare}
            isLoading={isLoading}
            disabled={isLoading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
      flexGrow: 1,
  },
  header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
      alignItems: 'center'
  },
  headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.textPrimary,
  },
  typeSwitcher: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: Colors.backgroundSecondary,
      paddingTop: 4,
  },
  tab: {
      flex: 1,
      padding: 14,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
  },
  activeTab: {
      borderBottomColor: Colors.primary,
  },
  tabText: {
      color: Colors.textSecondary,
      fontSize: 16,
      fontWeight: '600',
  },
  activeTabText: {
      color: Colors.primary,
  },
  imagePicker: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  placeholderText: {
    color: Colors.textSecondary,
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  inputContainer: {
    padding: 16,
  },
  captionInput: {
    fontSize: 16,
    color: Colors.textPrimary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  textFrameCreator: {
      backgroundColor: Colors.background,
      padding: 16,
      minHeight: Dimensions.get('window').height * 0.4,
  },
  textFrameInput: {
      fontSize: 24,
      fontWeight: '500',
      color: Colors.textPrimary,
      flex: 1,
      textAlignVertical: 'top',
  },
  footer: {
      padding: 16,
      paddingTop: 0,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      backgroundColor: Colors.background,
      position: 'absolute',
      left: 0,
      right: 0,
  },
  // 6. ADDED STYLES for audio picker
  audioPicker: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: Colors.backgroundSecondary,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.border,
  },
  audioPickerText: {
      color: Colors.primary,
      fontSize: 16,
      fontWeight: '600',
      marginTop: 12,
  }
});