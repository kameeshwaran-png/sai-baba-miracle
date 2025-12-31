import React, { useEffect } from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Home, Settings, BookOpen } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withSequence } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';

// Screens
import SplashScreen from '../screens/SplashScreen';
import SignUpScreen from '../screens/SignUpScreen';
import DashboardScreen from '../screens/DashboardScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import BookScreen from '../screens/BookScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainStack() {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 5,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animationTypeForReplace: 'push',
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
      <Stack.Screen 
        name="CreatePost" 
        component={CreatePostScreen}
        options={({ navigation }) => ({
          title: 'Create Post',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 5,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={({ navigation }) => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
}

// Animated Tab Icon Component
function AnimatedTabIcon({ children, focused }) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (focused) {
      rotation.value = withSequence(
        withTiming(360, { duration: 400 }),
        withTiming(0, { duration: 0 })
      );
    }
    scale.value = withSequence(
      withSpring(0.85, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}

function TabNavigator() {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  
  const ACTIVE_COLOR = '#2ecc71'; // Playo green
  const INACTIVE_COLOR = '#999999';
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 10,
          height: 60 + Math.max(insets.bottom, 10),
          elevation: 8,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: mode === 'dark' ? 0.3 : 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          fontFamily: Platform.select({
            ios: 'System',
            android: 'sans-serif-medium',
            default: 'sans-serif',
          }),
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={MainStack}
        options={({ route, navigation }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Dashboard';
          return {
            tabBarLabel: t('navigation.home'),
            tabBarIcon: ({ color, size, focused }) => (
              <AnimatedTabIcon focused={focused}>
                <Home 
                  size={size || 24} 
                  color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} 
                  strokeWidth={focused ? 2.5 : 2}
                />
              </AnimatedTabIcon>
            ),
            tabBarStyle: routeName === 'Details' ? { 
              display: 'none',
            } : {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              borderTopWidth: 1,
              paddingBottom: Math.max(insets.bottom, 10),
              paddingTop: 10,
              height: 60 + Math.max(insets.bottom, 10),
              elevation: 8,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: mode === 'dark' ? 0.3 : 0.1,
              shadowRadius: 4,
            },
          };
        }}
      />
      <Tab.Screen 
        name="Book" 
        component={BookScreen}
        options={{
          headerShown: false,
          tabBarLabel: t('navigation.book'),
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <BookOpen 
                size={size || 24} 
                color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} 
                strokeWidth={focused ? 2.5 : 2}
              />
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStack}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarLabel: t('navigation.settings'),
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <Settings 
                size={size || 24} 
                color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} 
                strokeWidth={focused ? 2.5 : 2}
              />
            </AnimatedTabIcon>
          ),
        })}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const navigationRef = useNavigationContainerRef();

  // Deep linking configuration
  const linking = {
    prefixes: ['com.saibabamiracles.app://', 'https://saibabamiracles.app'],
    config: {
      screens: {
        Home: {
          screens: {
            Dashboard: 'dashboard',
            Details: 'post/:postId',
            CreatePost: 'create',
          },
        },
        Settings: 'settings',
      },
    },
  };

  // Handle deep links
  useEffect(() => {
    const handleDeepLink = (event) => {
      const { url } = event;
      if (url) {
        const route = url.replace(/.*?:\/\//g, '');
        const routeName = route.split('/')[0];
        const routeParam = route.split('/')[1];

        if (routeName === 'post' && routeParam && navigationRef.isReady()) {
          navigationRef.navigate('Home', {
            screen: 'Details',
            params: { postId: routeParam },
          });
        }
      }
    };

    // Handle initial URL (app opened from deep link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    // Handle subsequent deep links (app already open)
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription?.remove();
    };
  }, [navigationRef]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      {isAuthenticated ? <TabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}
