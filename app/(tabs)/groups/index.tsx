import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useGroups } from '@/context/GroupsContext';
import { useRouter } from 'expo-router';
import { GroupCard } from '@/components/groups/GroupCard';
import { Plus, Search } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function GroupsScreen() {
  const { colors } = useTheme();
  const { groups, fetchGroups } = useGroups();
  const router = useRouter();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter groups based on search query
  const filteredGroups = searchQuery
    ? groups.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (group.category && group.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : groups;
  
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
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Groups</Text>
        <Button
          variant="primary"
          size="small"
          leftIcon={<Plus size={16} color={colors.textInverse} />}
          onPress={() => router.push('/groups/create')}
        >
          Create
        </Button>
      </View>
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={18} color={colors.textSecondary} />}
        />
      </View>
      
      <FlatList
        data={filteredGroups}
        renderItem={({ item }) => (
          <GroupCard
            group={item}
            onPress={(group) => router.push(`/groups/${group.id}`)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Groups Yet</Text>
            <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : "Create a group to start tracking shared expenses"
              }
            </Text>
            {!searchQuery && (
              <Button
                variant="primary"
                leftIcon={<Plus size={16} color={colors.textInverse} />}
                onPress={() => router.push('/groups/create')}
                style={styles.emptyButton}
              >
                Create New Group
              </Button>
            )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 200,
  },
});