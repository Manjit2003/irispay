import { Container } from "@/components/container";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export default function PaymentConfirmationScreen() {
  const { recipientId, amount } = useLocalSearchParams<{
    recipientId: string;
    amount: string;
  }>();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: recipient } = useQuery(trpc.getUsers.queryOptions());

  const handleConfirmPayment = async () => {
    if (!recipientId || !amount) return;

    setIsProcessing(true);
    try {
      router.replace("/(drawer)/(tabs)");
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container>
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-2xl font-bold text-foreground mb-6">
            Confirm Payment
          </Text>

          <View className="bg-card rounded-xl border border-border p-6 mb-6">
            <View className="mb-4">
              <Text className="text-muted-foreground mb-1">Recipient</Text>
              <Text className="text-foreground text-lg font-medium">
                {recipient?.[0]?.name || "Loading..."}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-muted-foreground mb-1">Amount</Text>
              <Text className="text-foreground text-2xl font-bold">
                ${amount || "0.00"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-primary rounded-xl p-4 mb-4"
            onPress={handleConfirmPayment}
            disabled={isProcessing}
          >
            <Text className="text-primary-foreground text-center font-medium">
              {isProcessing ? "Processing..." : "Confirm Payment"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-card rounded-xl p-4 border border-border"
            onPress={() => router.back()}
            disabled={isProcessing}
          >
            <Text className="text-foreground text-center font-medium">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
}
