import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useGroups } from '@/context/GroupsContext';
import { useExpenses } from '@/context/ExpensesContext';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { 
  X, 
  ChevronLeft, 
  ChevronDown, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText,
  Camera
} from 'lucide-react-native';
import { ExpenseCategory, SplitType } from '@/types';

export default function CreateExpenseScreen() {
  const { colors } = useTheme();
  const { groups } = useGroups();
  const { createExpense, calculateSplits } = useExpenses();
  const router = useRouter();
  
  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>(ExpenseCategory.OTHER);
  const [splitType, setSplitType] = useState<SplitType>(SplitType.EQUAL);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  
  // UI state
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showSplitTypeSelector, setShowSplitTypeSelector] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Get selected group
  const selectedGroup = groups.find(group => group.id === selectedGroupId);
  
  // Validate form
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an expense title');
      return false;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }
    
    if (!selectedGroupId) {
      Alert.alert('Error', 'Please select a group');
      return false;
    }
    
    return true;
  };
  
  // Create expense
  const handleCreateExpense = async () => {
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      const numericAmount = parseFloat(amount);
      
      // For demo, use the first user as the payer
      const paidById = selectedGroup?.members[0]?.userId || '';
      
      // Calculate splits based on split type
      const userIds = selectedGroup?.members.map(member => member.userId) || [];
      const splits = calculateSplits(numericAmount, splitType, userIds, undefined, paidById);
      
      const newExpense = {
        groupId: selectedGroupId,
        title,
        amount: numericAmount,
        category: selectedCategory,
        date: date.toISOString(),
        paidById,
        splitType,
        splits,
        notes,
      };
      
      await createExpense(newExpense);
      
      // Navigate back after creating expense
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Category metadata
  const categories = [
    { value: ExpenseCategory.FOOD, label: 'Food', icon: '🍔' },
    { value: ExpenseCategory.RENT, label: 'Rent', icon: '🏠' },
    { value: ExpenseCategory.UTILITIES, label: 'Utilities', icon: '💡' },
    { value: ExpenseCategory.ENTERTAINMENT, label: 'Entertainment', icon: '🎮' },
    { value: ExpenseCategory.TRANSPORTATION, label: 'Transportation', icon: '🚗' },
    { value: ExpenseCategory.SHOPPING, label: 'Shopping', icon: '🛍️' },
    { value: ExpenseCategory.TRAVEL, label: 'Travel', icon: '✈️' },
    { value: ExpenseCategory.HEALTH, label: 'Health', icon: '⚕️' },
    { value: ExpenseCategory.OTHER, label: 'Other', icon: '📦' },
  ];
  
  // Split types
  const splitTypes = [
    { value: SplitType.EQUAL, label: 'Split Equally' },
    { value: SplitType.PERCENTAGE, label: 'Split by Percentage' },
    { value: SplitType.EXACT, label: 'Split by Exact Amounts' },
    { value: SplitType.SHARES, label: 'Split by Shares' },
  ];
  
  // Get category data
  const getCategoryData = (categoryValue: ExpenseCategory) => {
    return categories.find(cat => cat.value === categoryValue) || categories[categories.length - 1];
  };
  
  // Get split type data
  const getSplitTypeData = (typeValue: SplitType) => {
    return splitTypes.find(type => type.value === typeValue) || splitTypes[0];
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>New Expense</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.formGroup, { backgroundColor: colors.card }]}>
            <Input
              placeholder="Expense title"
              value={title}
              onChangeText={setTitle}
              containerStyle={styles.inputContainer}
            />
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.amountContainer}>
              <DollarSign size={24} color={colors.textSecondary} />
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                placeholder="0.00"
                placeholderTextColor={colors.textTertiary}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>
          
          <View style={[styles.formGroup, { backgroundColor: colors.card }]}>
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => setShowGroupSelector(!showGroupSelector)}
            >
              <Users size={20} color={colors.primary} />
              <View style={styles.selectContent}>
                <Text style={[styles.selectLabel, { color: colors.textSecondary }]}>Group</Text>
                <Text style={[
                  styles.selectValue, 
                  { color: selectedGroup ? colors.text : colors.textTertiary }
                ]}>
                  {selectedGroup ? selectedGroup.name : 'Select a group'}
                </Text>
              </View>
              <ChevronDown size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {showGroupSelector && (
              <View style={styles.selectorContainer}>
                {groups.map(group => (
                  <TouchableOpacity
                    key={group.id}
                    style={[
                      styles.selectorItem,
                      selectedGroupId === group.id && { backgroundColor: colors.surface }
                    ]}
                    onPress={() => {
                      setSelectedGroupId(group.id);
                      setShowGroupSelector(false);
                    }}
                  >
                    <Text style={[styles.selectorItemText, { color: colors.text }]}>{group.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => setShowCategorySelector(!showCategorySelector)}
            >
              <Text style={styles.categoryIcon}>{getCategoryData(selectedCategory).icon}</Text>
              <View style={styles.selectContent}>
                <Text style={[styles.selectLabel, { color: colors.textSecondary }]}>Category</Text>
                <Text style={[styles.selectValue, { color: colors.text }]}>
                  {getCategoryData(selectedCategory).label}
                </Text>
              </View>
              <ChevronDown size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {showCategorySelector && (
              <View style={styles.selectorContainer}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.selectorItem,
                      selectedCategory === category.value && { backgroundColor: colors.surface }
                    ]}
                    onPress={() => {
                      setSelectedCategory(category.value);
                      setShowCategorySelector(false);
                    }}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[styles.selectorItemText, { color: colors.text }]}>{category.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity style={styles.selectButton}>
              <Calendar size={20} color={colors.primary} />
              <View style={styles.selectContent}>
                <Text style={[styles.selectLabel, { color: colors.textSecondary }]}>Date</Text>
                <Text style={[styles.selectValue, { color: colors.text }]}>
                  {date.toLocaleDateString()}
                </Text>
              </View>
              <ChevronDown size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.formGroup, { backgroundColor: colors.card }]}>
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => setShowSplitTypeSelector(!showSplitTypeSelector)}
            >
              <View style={styles.selectContent}>
                <Text style={[styles.selectLabel, { color: colors.textSecondary }]}>Split Type</Text>
                <Text style={[styles.selectValue, { color: colors.text }]}>
                  {getSplitTypeData(splitType).label}
                </Text>
              </View>
              <ChevronDown size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {showSplitTypeSelector && (
              <View style={styles.selectorContainer}>
                {splitTypes.map(type => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.selectorItem,
                      splitType === type.value && { backgroundColor: colors.surface }
                    ]}
                    onPress={() => {
                      setSplitType(type.value);
                      setShowSplitTypeSelector(false);
                    }}
                  >
                    <Text style={[styles.selectorItemText, { color: colors.text }]}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          {selectedGroup && (
            <View style={[styles.formGroup, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Split With</Text>
              
              {selectedGroup.members.map(member => (
                <View key={member.id} style={styles.memberItem}>
                  <Avatar name={member.name} image={member.avatar} size="sm" />
                  <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                </View>
              ))}
            </View>
          )}
          
          <View style={[styles.formGroup, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={styles.notesButton}>
              <FileText size={20} color={colors.primary} />
              <View style={styles.selectContent}>
                <Text style={[styles.selectLabel, { color: colors.textSecondary }]}>Notes</Text>
                <TextInput
                  style={[styles.notesInput, { color: colors.text }]}
                  placeholder="Add notes (optional)"
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity style={styles.selectButton}>
              <Camera size={20} color={colors.primary} />
              <View style={styles.selectContent}>
                <Text style={[styles.selectValue, { color: colors.text }]}>
                  Add Receipt (optional)
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        <View style={[styles.footer, { backgroundColor: colors.card }]}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={handleCreateExpense}
            isLoading={submitting}
          >
            Add Expense
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    padding: 16,
  },
  formGroup: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  inputContainer: {
    marginBottom: 0,
  },
  divider: {
    height: 1,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  selectContent: {
    flex: 1,
    marginLeft: 12,
  },
  selectLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  selectValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  selectorContainer: {
    padding: 8,
  },
  selectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  selectorItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    padding: 16,
    paddingBottom: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
  },
  memberName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 12,
  },
  notesButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  notesInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    paddingVertical: 0,
    maxHeight: 100,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});