import { Tabs } from 'expo-router'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { HapticTab } from '@/components/haptic-tab'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#1e2929ff'
        }
      }}
    >
      {/* Trang chủ */}
      <Tabs.Screen
        name='index'
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='house.fill' color={color} />
        }}
      />

      {/* Tìm kiếm */}
      <Tabs.Screen
        name='search'
        options={{
          title: 'Tìm kiếm',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name='magnify' color={color} size={size} />
        }}
      />

      {/* Thư viện */}
      <Tabs.Screen
        name='library'
        options={{
          title: 'Thư viện',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name='notebook-outline' color={color} />
        }}
      />

      {/* <Tabs.Screen
        name='notifications'
        options={{
          title: 'Thông báo',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='bell.fill' color={color} />
        }}
      />

      <Tabs.Screen 
        name='profile'
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='person.fill' color={color} />
        }}
      /> */}
    </Tabs>
  )
}
