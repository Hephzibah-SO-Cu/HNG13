import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { Colors } from '../../theme/colors';

interface Props extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'text';
}

export function Button({ title, isLoading, variant = 'primary', style, ...props }: Props) {
  const getBackgroundColor = () => {
    if (variant === 'primary') return Colors.primary;
    if (variant === 'secondary') return Colors.backgroundSecondary;
    return 'transparent';
  };

  const getTextColor = () => {
    if (variant === 'primary') return Colors.textInverse;
    if (variant === 'secondary') return Colors.textPrimary;
    return Colors.textSecondary;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        variant === 'secondary' && styles.secondaryBorder,
        style,
      ]}
      disabled={isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  secondaryBorder: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});