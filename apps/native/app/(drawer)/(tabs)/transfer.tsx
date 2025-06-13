import { Container } from "@/components/container";
import { trpc } from "@/utils/trpc";
import { useState, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function TransferScreen() {
  const [step, setStep] = useState<"select" | "form">("select");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<null | {
    id: string;
    name: string;
    phoneNumber: string | null;
  }>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");

  const { data: users, isLoading } = useQuery(trpc.getUsers.queryOptions());

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(
      (u: { name: string; phoneNumber: string | null }) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        (u.phoneNumber?.toLowerCase().includes(search.toLowerCase()) ?? false)
    );
  }, [users, search]);

  const transferMutation = useMutation(trpc.transferMoney.mutationOptions());

  if (step === "select") {
    return (
      <Container>
        <View className="flex-1 p-6">
          <Text className="text-2xl font-bold text-foreground mb-4">
            Select Recipient
          </Text>
          <TextInput
            className="p-4 rounded-md bg-input text-foreground border border-input mb-4"
            placeholder="Search by name or number"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
          />
          {isLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="bg-card rounded-xl p-4 border border-border mb-3"
                  onPress={() => {
                    setSelectedUser(item);
                    setStep("form");
                  }}
                >
                  <Text className="text-lg font-semibold text-foreground">
                    {item.name}
                  </Text>
                  <Text className="text-muted-foreground">
                    {item.phoneNumber || "No number"}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text className="text-muted-foreground text-center mt-8">
                  No users found.
                </Text>
              }
            />
          )}
        </View>
      </Container>
    );
  }

  // Step 2: Transfer form
  return (
    <Container>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 p-6">
          <Text className="text-2xl font-bold text-foreground mb-4">
            Make Payment
          </Text>
          <View className="bg-card rounded-xl p-4 border border-border mb-6">
            <Text className="text-muted-foreground mb-1">Paying to</Text>
            <Text className="text-lg font-semibold text-foreground mb-1">
              {selectedUser?.name}
            </Text>
            <Text className="text-muted-foreground">
              {selectedUser?.phoneNumber || "No number"}
            </Text>
          </View>

          <Text className="text-base font-medium text-foreground mb-2">
            Enter Amount to Transfer
          </Text>
          <View className="flex-row items-center mb-6">
            <TextInput
              className="flex-1 p-4 rounded-md bg-input text-foreground border border-input mr-2"
              placeholder="00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
              editable={!transferMutation.isPending}
            />
            <TouchableOpacity
              className="px-4 py-3 rounded-md bg-muted border border-input"
              onPress={() => setCurrency(currency === "INR" ? "USD" : "INR")}
              disabled={transferMutation.isPending}
            >
              <Text className="text-foreground font-medium">{currency}</Text>
            </TouchableOpacity>
          </View>

          {/* Exchange rate info (static for now) */}
          <View className="mb-6">
            <Text className="text-xs text-muted-foreground">
              1 USD = 83.88 INR (Google Rate)
            </Text>
          </View>

          {transferMutation.isError && (
            <Text className="text-destructive mb-2">
              {transferMutation.error instanceof Error
                ? transferMutation.error.message
                : "Transfer failed. Please try again."}
            </Text>
          )}
          {transferMutation.isSuccess && (
            <Text className="text-green-600 mb-2">
              {typeof transferMutation.data === "object" &&
              transferMutation.data &&
              "message" in transferMutation.data
                ? (transferMutation.data as any).message
                : "Transfer successful!"}
            </Text>
          )}

          <TouchableOpacity
            className="bg-primary p-4 rounded-md flex-row justify-center items-center"
            onPress={async () => {
              if (
                !selectedUser ||
                !amount ||
                isNaN(Number(amount)) ||
                Number(amount) <= 0
              )
                return;
              await transferMutation.mutateAsync({
                amount: Number(amount),
                receiverId: selectedUser.id,
              });
              setAmount("");
            }}
            disabled={
              !amount ||
              isNaN(Number(amount)) ||
              Number(amount) <= 0 ||
              transferMutation.isPending
            }
          >
            <Text className="text-primary-foreground font-medium">
              {transferMutation.isPending ? "Processing..." : "Proceed"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4 p-4 rounded-md border border-border flex-row justify-center items-center"
            onPress={() => setStep("select")}
            disabled={transferMutation.isPending}
          >
            <Text className="text-foreground font-medium">Back</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}
