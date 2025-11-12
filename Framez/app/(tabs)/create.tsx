import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { Colors } from '../../theme/colors';
import { Button } from '../../components/ui/Button';

export default function CreatePostScreen() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio like Instagram
      quality: 0.8,   // Slightly compress to save bandwidth
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    // 1. Get the image as an ArrayBuffer
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    // 2. Generate unique filename
    const fileExt = uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
    const fileName = `${session?.user.id}/${uuid.v4()}.${fileExt}`;

    // 3. Upload to Supabase using the ArrayBuffer directly
    // Supabase client can often handle ArrayBuffer if we cast it or wrap it
    const { error: uploadError, data } = await supabase.storage
      .from('post_images')
      .upload(fileName, arrayBuffer, {
        contentType: `image/${fileExt}`,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // 4. Get public URL
    const { data: urlData } = supabase.storage.from('post_images').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleShare = async () => {
    if (!image) {
       Toast.show({ type: 'error', text1: 'No Image', text2: 'Please select an image first.' });
       return;
    }
    if (!session?.user) return;

    try {
      setIsLoading(true);

      // 1. Upload Image & Get URL
      const imageUrl = await uploadImage(image);

      // 2. Insert Post into DB
      const { error } = await supabase.from('posts').insert({
        text_content: caption.trim().length > 0 ? caption.trim() : null,
        image_url: imageUrl,
        user_id: session.user.id,
      });

      if (error) throw error;

      // 3. Success! Reset form and go to feed
      Toast.show({ type: 'success', text1: 'Posted!', text2: 'Your frame is live.' });
      setImage(null);
      setCaption('');
      router.push('/(tabs)'); // Go back to feed to see it

    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Upload Failed', text2: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
             <Text style={styles.headerTitle}>New Frame</Text>
        </View>

        {/* Image Picker Area */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="camera-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.placeholderText}>Tap to select a photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Caption Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            value={caption}
            onChangeText={setCaption}
            maxLength={2200} // Instagram limit
          />
        </View>

        {/* Share Button */}
        <Button
          title="Share"
          onPress={handleShare}
          isLoading={isLoading}
          style={styles.shareButton}
          disabled={!image || isLoading}
        />
      </ScrollView>
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
  imagePicker: {
    width: '100%',
    aspectRatio: 1, // Square
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
  },
  placeholderText: {
    color: Colors.textSecondary,
    marginTop: 12,
    fontSize: 16,
  },
  inputContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  captionInput: {
    fontSize: 16,
    color: Colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top', // For Android multiline
  },
  shareButton: {
    margin: 16,
  },
});