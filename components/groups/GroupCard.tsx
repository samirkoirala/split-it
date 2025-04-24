import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Avatar } from '@/components/ui/Avatar';
import { Group } from '@/types';
import { Users } from 'lucide-react-native';

interface GroupCardProps {
  group: Group;
  onPress: (group: Group) => void;
}

export function GroupCard({ group, onPress }: GroupCardProps) {
  const { colors } = useTheme();
  
  // Calculate total balances
  const positiveBalance = group.members
    .filter(member => member.balance > 0)
    .reduce((sum, member) => sum + member.balance, 0);
    
  const negativeBalance = group.members
    .filter(member => member.balance < 0)
    .reduce((sum, member) => sum + Math.abs(member.balance), 0);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };
  
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={() => onPress(group)}
    >
      {group.coverImage ? (
        <ImageBackground
          source={{ uri: group.coverImage }}
          style={styles.coverImage}
          imageStyle={styles.coverImageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.groupName}>{group.name}</Text>
            {group.category && (
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryText}>{group.category}</Text>
              </View>
            )}
          </View>
        </ImageBackground>
      ) : (
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <Text style={[styles.groupNameNoImage, { color: colors.text }]}>{group.name}</Text>
          {group.category && (
            <View style={[styles.categoryContainerNoImage, { backgroundColor: colors.border }]}>
              <Text style={[styles.categoryTextNoImage, { color: colors.textSecondary }]}>{group.category}</Text>
            </View>
          )}
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.membersRow}>
          <View style={styles.membersContainer}>
            {group.members.slice(0, 3).map((member, index) => (
              <View key={member.id} style={[styles.memberAvatar, { marginLeft: index > 0 ? -12 : 0 }]}>
                <Avatar
                  name={member.name}
                  image={member.avatar}
                  size="sm"
                />
              </View>
            ))}
            
            {group.members.length > 3 && (
              <View style={[styles.memberCount, { backgroundColor: colors.border }]}>
                <Text style={[styles.memberCountText, { color: colors.textSecondary }]}>
                  +{group.members.length - 3}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.membersInfo}>
            <Users size={16} color={colors.textSecondary} />
            <Text style={[styles.membersText, { color: colors.textSecondary }]}>
              {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
            </Text>
          </View>
        </View>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>YOU OWE</Text>
            <Text style={[styles.balanceValue, { color: colors.negative }]}>
              {formatCurrency(negativeBalance)}
            </Text>
          </View>
          
          <View style={styles.balanceItem}>
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>YOU ARE OWED</Text>
            <Text style={[styles.balanceValue, { color: colors.positive }]}>
              {formatCurrency(positiveBalance)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  coverImage: {
    height: 120,
  },
  coverImageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  groupName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 8,
  },
  categoryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  header: {
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  groupNameNoImage: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  categoryContainerNoImage: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  categoryTextNoImage: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  content: {
    padding: 16,
  },
  membersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  memberCount: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -12,
  },
  memberCountText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  membersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {},
  balanceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});