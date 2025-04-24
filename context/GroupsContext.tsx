import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Group, GroupMember, GroupsState } from '@/types';

// Sample data for demo
const DEMO_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Apartment',
    category: 'Home',
    description: 'Expenses for our shared apartment',
    members: [
      { id: '1', userId: '1', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', balance: 150 },
      { id: '2', userId: '2', name: 'Sarah Miller', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', balance: -80 },
      { id: '3', userId: '3', name: 'James Wilson', avatar: 'https://randomuser.me/api/portraits/men/46.jpg', balance: -70 }
    ],
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-04-10T14:30:00Z',
    coverImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
  },
  {
    id: '2',
    name: 'Summer Trip',
    category: 'Travel',
    description: 'Our amazing summer vacation',
    members: [
      { id: '1', userId: '1', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', balance: -200 },
      { id: '2', userId: '2', name: 'Sarah Miller', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', balance: 200 }
    ],
    createdAt: '2023-05-20T08:15:00Z',
    updatedAt: '2023-06-01T16:45:00Z',
    coverImage: 'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg'
  },
  {
    id: '3',
    name: 'Friday Dinner',
    category: 'Food & Drink',
    description: 'Weekly dinner with friends',
    members: [
      { id: '1', userId: '1', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', balance: 0 },
      { id: '2', userId: '2', name: 'Sarah Miller', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', balance: 45 },
      { id: '3', userId: '3', name: 'James Wilson', avatar: 'https://randomuser.me/api/portraits/men/46.jpg', balance: -45 }
    ],
    createdAt: '2023-03-10T19:00:00Z',
    updatedAt: '2023-04-15T20:20:00Z',
    coverImage: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'
  }
];

// Groups context type
interface GroupsContextType extends GroupsState {
  fetchGroups: () => Promise<void>;
  getGroupById: (id: string) => Group | undefined;
  createGroup: (group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Group>;
  updateGroup: (id: string, updates: Partial<Group>) => Promise<Group>;
  deleteGroup: (id: string) => Promise<void>;
  addMemberToGroup: (groupId: string, member: Omit<GroupMember, 'id'>) => Promise<Group>;
  removeMemberFromGroup: (groupId: string, memberId: string) => Promise<Group>;
  updateMemberBalance: (groupId: string, memberId: string, amount: number) => Promise<void>;
}

// Create groups context
const GroupsContext = createContext<GroupsContextType>({
  groups: [],
  currentGroup: null,
  isLoading: false,
  error: null,
  fetchGroups: async () => {},
  getGroupById: () => undefined,
  createGroup: async () => ({} as Group),
  updateGroup: async () => ({} as Group),
  deleteGroup: async () => {},
  addMemberToGroup: async () => ({} as Group),
  removeMemberFromGroup: async () => ({} as Group),
  updateMemberBalance: async () => {},
});

// Groups provider component
export const GroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<GroupsState>({
    groups: [],
    currentGroup: null,
    isLoading: false,
    error: null,
  });

  // Fetch groups
  const fetchGroups = async () => {
    if (!isAuthenticated) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // In a real app, this would be an API call
      // For demo, use sample data
      const groups = DEMO_GROUPS;
      
      setState(prev => ({
        ...prev,
        groups,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch groups',
      }));
    }
  };

  // Load groups on authentication change
  useEffect(() => {
    if (isAuthenticated) {
      fetchGroups();
    } else {
      setState({
        groups: [],
        currentGroup: null,
        isLoading: false,
        error: null,
      });
    }
  }, [isAuthenticated]);

  // Get group by ID
  const getGroupById = (id: string) => {
    return state.groups.find(group => group.id === id);
  };

  // Create group
  const createGroup = async (groupData: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // In a real app, this would be an API call
      const newGroup: Group = {
        ...groupData,
        id: `group-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setState(prev => ({
        ...prev,
        groups: [...prev.groups, newGroup],
        isLoading: false,
      }));
      
      return newGroup;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to create group',
      }));
      throw error;
    }
  };

  // Update group
  const updateGroup = async (id: string, updates: Partial<Group>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const groupIndex = state.groups.findIndex(g => g.id === id);
      
      if (groupIndex === -1) {
        throw new Error('Group not found');
      }
      
      // Update the group
      const updatedGroup: Group = {
        ...state.groups[groupIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedGroups = [...state.groups];
      updatedGroups[groupIndex] = updatedGroup;
      
      setState(prev => ({
        ...prev,
        groups: updatedGroups,
        currentGroup: prev.currentGroup?.id === id ? updatedGroup : prev.currentGroup,
        isLoading: false,
      }));
      
      return updatedGroup;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update group',
      }));
      throw error;
    }
  };

  // Delete group
  const deleteGroup = async (id: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // In a real app, this would be an API call
      const updatedGroups = state.groups.filter(group => group.id !== id);
      
      setState(prev => ({
        ...prev,
        groups: updatedGroups,
        currentGroup: prev.currentGroup?.id === id ? null : prev.currentGroup,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to delete group',
      }));
      throw error;
    }
  };

  // Add member to group
  const addMemberToGroup = async (groupId: string, member: Omit<GroupMember, 'id'>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const groupIndex = state.groups.findIndex(g => g.id === groupId);
      
      if (groupIndex === -1) {
        throw new Error('Group not found');
      }
      
      // Add the member
      const newMember: GroupMember = {
        ...member,
        id: `member-${Date.now()}`,
      };
      
      const updatedGroup = {
        ...state.groups[groupIndex],
        members: [...state.groups[groupIndex].members, newMember],
        updatedAt: new Date().toISOString(),
      };
      
      const updatedGroups = [...state.groups];
      updatedGroups[groupIndex] = updatedGroup;
      
      setState(prev => ({
        ...prev,
        groups: updatedGroups,
        currentGroup: prev.currentGroup?.id === groupId ? updatedGroup : prev.currentGroup,
        isLoading: false,
      }));
      
      return updatedGroup;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to add member to group',
      }));
      throw error;
    }
  };

  // Remove member from group
  const removeMemberFromGroup = async (groupId: string, memberId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const groupIndex = state.groups.findIndex(g => g.id === groupId);
      
      if (groupIndex === -1) {
        throw new Error('Group not found');
      }
      
      // Remove the member
      const updatedGroup = {
        ...state.groups[groupIndex],
        members: state.groups[groupIndex].members.filter(m => m.id !== memberId),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedGroups = [...state.groups];
      updatedGroups[groupIndex] = updatedGroup;
      
      setState(prev => ({
        ...prev,
        groups: updatedGroups,
        currentGroup: prev.currentGroup?.id === groupId ? updatedGroup : prev.currentGroup,
        isLoading: false,
      }));
      
      return updatedGroup;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to remove member from group',
      }));
      throw error;
    }
  };

  // Update member balance
  const updateMemberBalance = async (groupId: string, memberId: string, amount: number) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const groupIndex = state.groups.findIndex(g => g.id === groupId);
      
      if (groupIndex === -1) {
        throw new Error('Group not found');
      }
      
      // Update the member's balance
      const group = state.groups[groupIndex];
      const memberIndex = group.members.findIndex(m => m.id === memberId);
      
      if (memberIndex === -1) {
        throw new Error('Member not found');
      }
      
      const updatedMembers = [...group.members];
      updatedMembers[memberIndex] = {
        ...updatedMembers[memberIndex],
        balance: updatedMembers[memberIndex].balance + amount,
      };
      
      const updatedGroup = {
        ...group,
        members: updatedMembers,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedGroups = [...state.groups];
      updatedGroups[groupIndex] = updatedGroup;
      
      setState(prev => ({
        ...prev,
        groups: updatedGroups,
        currentGroup: prev.currentGroup?.id === groupId ? updatedGroup : prev.currentGroup,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update member balance',
      }));
      throw error;
    }
  };

  return (
    <GroupsContext.Provider
      value={{
        ...state,
        fetchGroups,
        getGroupById,
        createGroup,
        updateGroup,
        deleteGroup,
        addMemberToGroup,
        removeMemberFromGroup,
        updateMemberBalance,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};

// Groups hook
export const useGroups = () => useContext(GroupsContext);