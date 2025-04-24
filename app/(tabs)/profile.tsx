import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { User, Bell, Moon, CreditCard, CircleHelp as HelpCircle, LogOut, ChevronRight, Mail, Shield } from 'lucide-react-native';

export default function ProfileScreen() {
  const { colors, theme, setTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  
  // Toggle theme
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  
  // Logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => logout(),
          style: 'destructive',
        },
      ]
    );
  };
  
  // Setting item component
  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    subtitle?: string; 
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.settingIcon, { backgroundColor: colors.surface }]}>
        {icon}
      </View>
      
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightElement || (onPress && <ChevronRight size={20} color={colors.textTertiary} />)}
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>
        
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <Avatar name={user?.name || ''} image={user?.avatar} size="xl" />
          
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>{user?.name}</Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
          </View>
          
          <Button
            variant="outline"
            size="small"
          >
            Edit Profile
          </Button>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ACCOUNT</Text>
          
          <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
            <SettingItem
              icon={<User size={20} color={colors.primary} />}
              title="Personal Information"
              subtitle="Update your personal details"
              onPress={() => {}}
            />
            
            <SettingItem
              icon={<Mail size={20} color={colors.primary} />}
              title="Email Address"
              subtitle={user?.email}
              onPress={() => {}}
            />
            
            <SettingItem
              icon={<CreditCard size={20} color={colors.primary} />}
              title="Payment Methods"
              subtitle="Manage your payment options"
              onPress={() => {}}
            />
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PREFERENCES</Text>
          
          <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
            <SettingItem
              icon={<Bell size={20} color={colors.primary} />}
              title="Notifications"
              subtitle="Manage notification settings"
              onPress={() => {}}
            />
            
            <SettingItem
              icon={<Moon size={20} color={colors.primary} />}
              title="Dark Mode"
              rightElement={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={isDark ? colors.primary : colors.surface}
                />
              }
            />
            
            <SettingItem
              icon={<Shield size={20} color={colors.primary} />}
              title="Privacy Settings"
              subtitle="Manage your privacy preferences"
              onPress={() => {}}
            />
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SUPPORT</Text>
          
          <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
            <SettingItem
              icon={<HelpCircle size={20} color={colors.primary} />}
              title="Help & Support"
              subtitle="Get help with the app"
              onPress={() => {}}
            />
          </View>
        </View>
        
        <Button
          variant="outline"
          size="large"
          onPress={handleLogout}
          leftIcon={<LogOut size={20} color={colors.error} />}
          style={[styles.logoutButton, { borderColor: colors.error }]}
          textStyle={{ color: colors.error }}
        >
          Logout
        </Button>
        
        <Text style={[styles.versionText, { color: colors.textTertiary }]}>
          Split-it v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  profileCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    alignItems: 'center',
    marginVertical: 16,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    marginLeft: 8,
  },
  settingsCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  logoutButton: {
    marginBottom: 16,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
});