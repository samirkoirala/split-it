import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useGroups } from '@/context/GroupsContext';
import { BalanceSummary } from '@/components/home/BalanceSummary';
import { RecentActivityList } from '@/components/home/RecentActivityList';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';

// Sample recent activity data for demo
const RECENT_ACTIVITIES = [
  {
    id: '1',
    type: 'expense',
    title: 'Rent - April',
    subtitle: 'Apartment',
    amount: -500,
    date: '2023-04-01T10:05:00Z',
    user: {
      id: '1',
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment received',
    subtitle: 'Sarah paid you',
    amount: 45,
    date: '2023-04-15T14:30:00Z',
    user: {
      id: '2',
      name: 'Sarah Miller',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  },
  {
    id: '3',
    type: 'group',
    title: 'Created new group',
    subtitle: 'Summer Trip',
    date: '2023-05-20T08:15:00Z',
    user: {
      id: '1',
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  },
];

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { groups, fetchGroups } = useGroups();
  const router = useRouter();
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Calculate total balances across all groups
  const calculateTotalBalance = () => {
    let totalPositive = 0;
    let totalNegative = 0;
    
    groups.forEach(group => {
      group.members.forEach(member => {
        if (member.userId === user?.id) {
          if (member.balance > 0) {
            totalPositive += member.balance;
          } else if (member.balance < 0) {
            totalNegative += Math.abs(member.balance);
          }
        }
      });
    });
    
    return {
      total: totalPositive - totalNegative,
      youAreOwed: totalPositive,
      youOwe: totalNegative,
    };
  };
  
  const balances = calculateTotalBalance();
  
  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGroups();
    setRefreshing(false);
  };
  
  // Load data on mount
  useEffect(() => {
    fetchGroups();
  }, []);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>Hello,</Text>
            <Text style={[styles.username, { color: colors.text }]}>{user?.name}</Text>
          </View>
          <Avatar name={user?.name || ''} image={user?.avatar} size="lg" />
        </View>
        
        <BalanceSummary
          totalBalance={balances.total}
          youOwe={balances.youOwe}
          youAreOwed={balances.youAreOwed}
        />
        
        <View style={styles.actionsContainer}>
          <Button
            variant="primary"
            onPress={() => router.push('/create-expense')}
            style={[styles.actionButton, { marginRight: 8 }]}
          >
            Add Expense
          </Button>
          
          <Button
            variant="outline"
            onPress={() => router.push('/groups')}
            style={styles.actionButton}
          >
            View Groups
          </Button>
        </View>
        
        <RecentActivityList
          activities={RECENT_ACTIVITIES}
          onViewAll={() => router.push('/activity')}
          onItemPress={(item) => {
            // Navigate based on item type
            if (item.type === 'expense') {
              // Navigate to expense details
            } else if (item.type === 'payment') {
              // Navigate to payment details
            } else if (item.type === 'group') {
              // Navigate to group
            }
          }}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  username: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
});