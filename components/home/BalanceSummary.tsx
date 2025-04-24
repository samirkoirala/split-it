import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

interface BalanceSummaryProps {
  totalBalance: number;
  youOwe: number;
  youAreOwed: number;
}

export function BalanceSummary({ totalBalance, youOwe, youAreOwed }: BalanceSummaryProps) {
  const { colors } = useTheme();
  
  // Animation values
  const progress = useSharedValue(0);
  
  // Animate on mount
  React.useEffect(() => {
    progress.value = withTiming(1, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);
  
  // Animated styles for the bar
  const positiveBarStyle = useAnimatedStyle(() => {
    const width = youAreOwed ? youAreOwed / (youAreOwed + youOwe) * 100 : 0;
    return {
      width: `${width * progress.value}%`,
    };
  });
  
  const negativeBarStyle = useAnimatedStyle(() => {
    const width = youOwe ? youOwe / (youAreOwed + youOwe) * 100 : 0;
    return {
      width: `${width * progress.value}%`,
    };
  });
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };
  
  // Get the status color based on the total balance
  const getStatusColor = () => {
    if (totalBalance > 0) return colors.positive;
    if (totalBalance < 0) return colors.negative;
    return colors.neutral;
  };
  
  // Get the status icon based on the total balance
  const getStatusIcon = () => {
    if (totalBalance > 0) {
      return <TrendingUp size={20} color={colors.positive} />;
    }
    if (totalBalance < 0) {
      return <TrendingDown size={20} color={colors.negative} />;
    }
    return <Minus size={20} color={colors.neutral} />;
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>TOTAL BALANCE</Text>
        <View style={styles.balanceContainer}>
          <Text style={[styles.balance, { color: getStatusColor() }]}>
            {formatCurrency(totalBalance)}
          </Text>
          <View style={styles.statusIcon}>
            {getStatusIcon()}
          </View>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>YOU OWE</Text>
          <Text style={[styles.statValue, { color: colors.negative }]}>{formatCurrency(youOwe)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>YOU ARE OWED</Text>
          <Text style={[styles.statValue, { color: colors.positive }]}>{formatCurrency(youAreOwed)}</Text>
        </View>
      </View>
      
      <View style={[styles.barContainer, { backgroundColor: colors.border }]}>
        <Animated.View style={[styles.positiveBar, { backgroundColor: colors.positive }, positiveBarStyle]} />
        <Animated.View style={[styles.negativeBar, { backgroundColor: colors.negative }, negativeBarStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balance: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
  },
  statusIcon: {
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stat: {},
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  barContainer: {
    height: 6,
    borderRadius: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  positiveBar: {
    height: '100%',
  },
  negativeBar: {
    height: '100%',
  },
});