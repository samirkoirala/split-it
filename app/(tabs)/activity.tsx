import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Avatar } from '@/components/ui/Avatar';
import { CreditCard, Users, Receipt, ArrowUp, ArrowDown } from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';

// Sample activity data for demo
const ACTIVITY_DATA = [
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
    group: {
      id: '1',
      name: 'Apartment',
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
    group: {
      id: '1',
      name: 'Apartment',
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
    group: {
      id: '2',
      name: 'Summer Trip',
    },
  },
  {
    id: '4',
    type: 'expense',
    title: 'Groceries',
    subtitle: 'Apartment',
    amount: -40,
    date: '2023-04-10T16:45:00Z',
    user: {
      id: '2',
      name: 'Sarah Miller',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    group: {
      id: '1',
      name: 'Apartment',
    },
  },
  {
    id: '5',
    type: 'expense',
    title: 'Internet Bill',
    subtitle: 'Apartment',
    amount: -20,
    date: '2023-04-15T09:20:00Z',
    user: {
      id: '3',
      name: 'James Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    },
    group: {
      id: '1',
      name: 'Apartment',
    },
  },
  {
    id: '6',
    type: 'expense',
    title: 'Hotel Room',
    subtitle: 'Summer Trip',
    amount: -200,
    date: '2023-06-01T14:10:00Z',
    user: {
      id: '2',
      name: 'Sarah Miller',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    group: {
      id: '2',
      name: 'Summer Trip',
    },
  },
  {
    id: '7',
    type: 'expense',
    title: 'Dinner at Luigi\'s',
    subtitle: 'Friday Dinner',
    amount: -30,
    date: '2023-04-14T22:15:00Z',
    user: {
      id: '2',
      name: 'Sarah Miller',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    group: {
      id: '3',
      name: 'Friday Dinner',
    },
  },
  {
    id: '8',
    type: 'payment',
    title: 'Payment sent',
    subtitle: 'You paid Sarah',
    amount: -120,
    date: '2023-05-05T11:20:00Z',
    user: {
      id: '2',
      name: 'Sarah Miller',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    group: {
      id: '1',
      name: 'Apartment',
    },
  },
];

// Filter options
type FilterType = 'all' | 'expenses' | 'payments' | 'groups';

export default function ActivityScreen() {
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  // Filter activities based on selected filter
  const filteredActivities = ACTIVITY_DATA.filter(activity => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'expenses') return activity.type === 'expense';
    if (activeFilter === 'payments') return activity.type === 'payment';
    if (activeFilter === 'groups') return activity.type === 'group';
    return true;
  });
  
  // Format time
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'some time ago';
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '';
    
    if (amount > 0) {
      return `+$${amount.toFixed(2)}`;
    } else if (amount < 0) {
      return `-$${Math.abs(amount).toFixed(2)}`;
    }
    return `$${amount.toFixed(2)}`;
  };
  
  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'expense':
        return <Receipt size={16} color={colors.text} />;
      case 'payment':
        return <CreditCard size={16} color={colors.text} />;
      case 'group':
        return <Users size={16} color={colors.text} />;
      default:
        return null;
    }
  };
  
  // Get color based on amount
  const getAmountColor = (amount: number | undefined) => {
    if (amount === undefined) return colors.text;
    
    if (amount > 0) {
      return colors.positive;
    } else if (amount < 0) {
      return colors.negative;
    }
    return colors.text;
  };
  
  // Filter button component
  const FilterButton = ({ title, type }: { title: string; type: FilterType }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === type && { backgroundColor: colors.primary }
      ]}
      onPress={() => setActiveFilter(type)}
    >
      <Text
        style={[
          styles.filterButtonText,
          { color: activeFilter === type ? colors.textInverse : colors.text }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
  
  // Render activity item
  const renderActivityItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.activityItem, { borderBottomColor: colors.border }]}
      onPress={() => {
        // Handle activity item press
      }}
    >
      <Avatar name={item.user.name} image={item.user.avatar} size="md" />
      
      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <Text style={[styles.activityTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          {item.amount !== undefined && (
            <View style={styles.amountContainer}>
              {item.amount > 0 ? (
                <ArrowDown size={12} color={colors.positive} style={styles.amountIcon} />
              ) : item.amount < 0 ? (
                <ArrowUp size={12} color={colors.negative} style={styles.amountIcon} />
              ) : null}
              <Text style={[styles.activityAmount, { color: getAmountColor(item.amount) }]}>
                {formatCurrency(item.amount)}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.activityMeta}>
          <View style={styles.activityTypeContainer}>
            {getActivityIcon(item.type)}
            <Text style={[styles.activitySubtitle, { color: colors.textSecondary }]}>
              {item.subtitle}
            </Text>
          </View>
          <Text style={[styles.activityTime, { color: colors.textTertiary }]}>
            {formatTime(item.date)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Activity</Text>
      </View>
      
      <View style={styles.filtersContainer}>
        <FilterButton title="All" type="all" />
        <FilterButton title="Expenses" type="expenses" />
        <FilterButton title="Payments" type="payments" />
        <FilterButton title="Groups" type="groups" />
      </View>
      
      <FlatList
        data={filteredActivities}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No activity found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountIcon: {
    marginRight: 4,
  },
  activityAmount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activitySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 6,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});