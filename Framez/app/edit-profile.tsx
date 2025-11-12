import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Colors } from '../theme/colors';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function EditProfileScreen() {
    const router = useRouter();
    const { session } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState(''); // New State
    const [bio, setBio] = useState('');
    const [newAvatar, setNewAvatar] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        if (!session?.user) return;
        setIsLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
        
        if (data) {
            setProfile(data);
            setUsername(data.username || '');
            setFullName(data.full_name || ''); // Load full name
            setBio(data.bio || '');
        } else if (error) {
            Toast.show({ type: 'error', text1: 'Failed to load profile' });
        }
        setIsLoading(false);
    }

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setNewAvatar(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!session?.user) return;
        setIsSaving(true);
        let avatarUrl = profile.avatar_url;

        try {
            if (newAvatar) {
                const response = await fetch(newAvatar);
                const arrayBuffer = await response.arrayBuffer();
                const fileExt = newAvatar.split('.').pop()?.toLowerCase() ?? 'jpeg';
                const fileName = `${session.user.id}/${uuid.v4()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, arrayBuffer, {
                        contentType: `image/${fileExt}`,
                        upsert: true,
                    });
                
                if (uploadError) throw uploadError;
                avatarUrl = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
            }

            // Update Profile with new fields
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    username: username.trim().toLowerCase(),
                    full_name: fullName.trim(), // Save full name
                    bio: bio.trim(),
                    avatar_url: avatarUrl,
                })
                .eq('id', session.user.id);
            
            if (updateError) throw updateError;

            Toast.show({ type: 'success', text1: 'Profile saved!' });
            router.back();

        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Failed to save', text2: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;
    }

    const avatarSource = newAvatar ? { uri: newAvatar } : (profile?.avatar_url ? { uri: profile.avatar_url } : undefined);

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="close" size={28} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit profile</Text>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    {isSaving ? <ActivityIndicator size="small" /> : <Ionicons name="checkmark" size={28} color={Colors.primary} />}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                        {avatarSource ? (
                            <Image source={avatarSource} style={styles.avatar} />
                        ) : (
                            <Text style={styles.avatarText}>{username[0]?.toUpperCase() || '?'}</Text>
                        )}
                        <View style={styles.avatarEditPill}>
                            <Ionicons name="camera-outline" size={16} color={Colors.textInverse} />
                        </View>
                    </TouchableOpacity>
                    <Button title="Change photo" variant="text" onPress={pickImage} />
                </View>

                <View style={styles.form}>
                    {/* Split into two fields */}
                    <Input
                        label="Display Name"
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="e.g. Alex Donahue"
                    />
                    <Input
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        placeholder="e.g. call.me.alex"
                        autoCapitalize="none"
                    />
                    <Input
                        label="Bio"
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Tell everyone a little about yourself..."
                        multiline
                        numberOfLines={4}
                        style={{ height: 100, textAlignVertical: 'top' }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backButton: { width: 50 },
    headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700' },
    saveButton: { width: 50, alignItems: 'flex-end' },
    scrollContent: { padding: 20 },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.border,
        marginBottom: 12,
    },
    avatar: { width: '100%', height: '100%', borderRadius: 50 },
    avatarText: { fontSize: 36, fontWeight: '600', color: Colors.textPrimary },
    avatarEditPill: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 6,
        borderWidth: 2,
        borderColor: Colors.background,
    },
    form: {
        flex: 1,
    }
});