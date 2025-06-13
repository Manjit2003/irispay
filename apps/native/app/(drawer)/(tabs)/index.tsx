import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

export default function HomeScreen() {
  const { data: session } = authClient.useSession();
  const { data: userWallet } = useQuery(trpc.getUserWallet.queryOptions());

  return (
    <Container>
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Welcome Section */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Welcome back,
            </Text>
            <Text className="text-2xl font-bold text-primary">
              {session?.user.name}
            </Text>
          </View>

          {/* Wallet Balance Card */}
          <View className="bg-primary rounded-xl p-6 mb-8">
            <Text className="text-primary-foreground text-sm mb-1">
              Available Balance
            </Text>
            <Text className="text-primary-foreground text-3xl font-bold">
              ${userWallet || "0.00"}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-4 mb-8">
            <TouchableOpacity
              className="flex-1 bg-card rounded-xl p-4 border border-border"
              onPress={() => router.push("/(drawer)/(tabs)/transfer")}
            >
              <View className="items-center">
                <View className="bg-primary/10 p-3 rounded-full mb-2">
                  <Ionicons name="arrow-up" size={24} color="#3b82f6" />
                </View>
                <Text className="text-foreground font-medium">Transfer</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-card rounded-xl p-4 border border-border"
              onPress={() => router.push("/(drawer)/(tabs)/receive")}
            >
              <View className="items-center">
                <View className="bg-primary/10 p-3 rounded-full mb-2">
                  <Ionicons name="arrow-down" size={24} color="#3b82f6" />
                </View>
                <Text className="text-foreground font-medium">Receive</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Recent Transactions */}
          <View>
            <Text className="text-xl font-semibold text-foreground mb-4">
              Recent Transactions
            </Text>
            <View className="bg-card rounded-xl border border-border">
              {/* Placeholder for transactions */}
              <View className="p-4 border-b border-border">
                <Text className="text-muted-foreground text-center">
                  No recent transactions
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
