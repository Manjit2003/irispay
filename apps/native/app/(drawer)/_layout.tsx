import { Drawer } from "expo-router/drawer";
import { useColorScheme } from "@/lib/use-color-scheme";
import { authClient } from "@/lib/auth-client";
import { Text, View } from "react-native";

export default function DrawerLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const { data: session } = authClient.useSession();

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: isDarkColorScheme
            ? "hsl(222.2 84% 4.9%)"
            : "hsl(0 0% 100%)",
        },
        drawerActiveTintColor: isDarkColorScheme
          ? "hsl(217.2 91.2% 59.8%)"
          : "hsl(221.2 83.2% 53.3%)",
        drawerInactiveTintColor: isDarkColorScheme
          ? "hsl(215 20.2% 65.1%)"
          : "hsl(215.4 16.3% 46.9%)",
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Home",
          drawerLabel: () => (
            <View className="py-2">
              <Text
                className={`text-base ${
                  isDarkColorScheme ? "text-white" : "text-gray-900"
                }`}
              >
                {session?.user.name}
              </Text>
              <Text
                className={`text-sm ${
                  isDarkColorScheme ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {session?.user.email}
              </Text>
            </View>
          ),
        }}
      />
    </Drawer>
  );
}
