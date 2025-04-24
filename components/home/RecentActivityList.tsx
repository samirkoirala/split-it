import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Avatar } from '@/components/ui/Avatar';
import { CreditCard, Users, Receipt, ArrowRight } from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';

// Activity item interface
interface ActivityItem {
  id: string;
  type: 'expense' | 'payment' | 'group';
  title: string;
  subtitle: string;
  amount?: number;
  date: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface RecentActivityListProps {
  activities: ActivityItem[];
  onViewAll: () => void;
  onItemPress: (item: ActivityItem) => void;
}

export function RecentActivityList({ activities, onViewAll, onItemPress }: RecentActivityListProps) {
  const { colors } = useTheme();
  
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
  
  // Render an activity item
  const renderActivityItem = ({ item }: { item: ActivityItem }) => (
    <TouchableOpacity
      style={[styles.activityItem, { borderBottomColor: colors.border }]}
      onPress={() => onItemPress(item)}
    >
      <Avatar name={item.user.name} image={item.user.avatar} size="md" />
      
      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <Text style={[styles.activityTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          {item.amount !== undefined && (
            <Text style={[styles.activityAmount, { color: getAmountColor(item.amount) }]}>
              {formatCurrency(item.amount)}
            </Text>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Recent Activity</Text>
        <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
          <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
          <ArrowRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={activities}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No recent activity
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 4,
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