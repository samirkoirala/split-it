import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  StyleProp, 
  ViewStyle, 
  TextStyle,
  TouchableOpacityProps,
  View
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
  disabled = false,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();

  // Generate button styles based on variant and size
  const getButtonStyles = () => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size styles
    let sizeStyle: ViewStyle = {};
    switch (size) {
      case 'small':
        sizeStyle = {
          paddingVertical: 8,
          paddingHorizontal: 12,
        };
        break;
      case 'medium':
        sizeStyle = {
          paddingVertical: 12,
          paddingHorizontal: 16,
        };
        break;
      case 'large':
        sizeStyle = {
          paddingVertical: 16,
          paddingHorizontal: 24,
        };
        break;
    }

    // Variant styles
    let variantStyle: ViewStyle = {};
    switch (variant) {
      case 'primary':
        variantStyle = {
          backgroundColor: colors.primary,
        };
        break;
      case 'secondary':
        variantStyle = {
          backgroundColor: colors.accent,
        };
        break;
      case 'outline':
        variantStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary,
        };
        break;
      case 'ghost':
        variantStyle = {
          backgroundColor: 'transparent',
        };
        break;
      case 'danger':
        variantStyle = {
          backgroundColor: colors.error,
        };
        break;
    }

    // Width style
    const widthStyle: ViewStyle = fullWidth ? { width: '100%' } : {};

    // Disabled style
    const disabledStyle: ViewStyle = disabled ? { 
      opacity: 0.5, 
    } : {};

    return [baseStyle, sizeStyle, variantStyle, widthStyle, disabledStyle];
  };

  // Generate text styles based on variant and size
  const getTextStyles = () => {
    const baseStyle: TextStyle = {
      fontFamily: 'Inter-Medium',
      textAlign: 'center',
    };

    // Size styles
    let sizeStyle: TextStyle = {};
    switch (size) {
      case 'small':
        sizeStyle = {
          fontSize: 14,
        };
        break;
      case 'medium':
        sizeStyle = {
          fontSize: 16,
        };
        break;
      case 'large':
        sizeStyle = {
          fontSize: 18,
        };
        break;
    }

    // Variant styles
    let variantStyle: TextStyle = {};
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        variantStyle = {
          color: colors.textInverse,
        };
        break;
      case 'outline':
      case 'ghost':
        variantStyle = {
          color: variant === 'outline' ? colors.primary : colors.text,
        };
        break;
    }

    return [baseStyle, sizeStyle, variantStyle];
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      disabled={isLoading || disabled}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textInverse} 
          size="small" 
        />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[getTextStyles(), textStyle]}>{children}</Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});