import React from 'react';
import { View, Text, Image, StyleSheet, StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string;
  image?: string;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

export function Avatar({
  name,
  image,
  size = 'md',
  style,
  textStyle,
  imageStyle,
}: AvatarProps) {
  const { colors } = useTheme();
  
  // Size mapping
  const sizeMap: Record<AvatarSize, number> = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };
  
  // Font size mapping
  const fontSizeMap: Record<AvatarSize, number> = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
  };
  
  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  // Get random color based on name
  const getRandomColor = (name: string) => {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
      '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
      '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
      '#FF5722', '#795548', '#9E9E9E', '#607D8B'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    hash = Math.abs(hash);
    return colors[hash % colors.length];
  };
  
  const avatarSize = sizeMap[size];
  const fontSize = fontSizeMap[size];
  const backgroundColorFallback = getRandomColor(name);

  const avatarStyles = [
    styles.container, 
    { 
      width: avatarSize, 
      height: avatarSize, 
      borderRadius: avatarSize / 2,
      backgroundColor: image ? 'transparent' : backgroundColorFallback,
    },
    style
  ];

  const textStyles = [
    styles.text, 
    { 
      fontSize,
      lineHeight: avatarSize, 
    },
    textStyle
  ];

  const imageStyles = [
    styles.image,
    { 
      width: avatarSize, 
      height: avatarSize, 
      borderRadius: avatarSize / 2 
    },
    imageStyle
  ];

  return (
    <View style={avatarStyles}>
      {image ? (
        <Image
          source={{ uri: image }}
          style={imageStyles}
        />
      ) : (
        <Text style={textStyles}>{getInitials(name)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  text: {
    color: 'white',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});