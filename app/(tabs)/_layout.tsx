import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Chrome as Home, Users, CreditCard, User, CirclePlus as PlusCircle } from 'lucide-react-native';
import Animated from 'react-native-reanimated';

// Custom tab bar component
function CustomTabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();
  
  return (
    <View style={[
      styles.tabBarContainer,
      { 
        backgroundColor: colors.tabBar,
        borderTopColor: colors.tabBarBorder,
      }
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate(route.name);
          }
        };

        // Special case for the center "Add" button
        if (route.name === 'create-expense') {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.addButton}
            >
              <Animated.View
                style={[
                  styles.addButtonInner,
                  { backgroundColor: colors.primary }
                ]}
              >
                <PlusCircle size={24} color="white" />
              </Animated.View>
            </TouchableOpacity>
          );
        }

        // Icon mapping for regular tabs
        let icon;
        switch (route.name) {
          case 'index':
            icon = <Home size={24} color={isFocused ? colors.tabBarActive : colors.tabBarInactive} />;
            break;
          case 'groups':
            icon = <Users size={24} color={isFocused ? colors.tabBarActive : colors.tabBarInactive} />;
            break;
          case 'activity':
            icon = <CreditCard size={24} color={isFocused ? colors.tabBarActive : colors.tabBarInactive} />;
            break;
          case 'profile':
            icon = <User size={24} color={isFocused ? colors.tabBarActive : colors.tabBarInactive} />;
            break;
          default:
            icon = null;
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
          >
            {icon}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="groups" options={{ title: 'Groups' }} />
      <Tabs.Screen name="create-expense" options={{ title: 'Add', href: null }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});