import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/trpc";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onError: (error) => {
            setError(error.error?.message || "Failed to sign in");
          },
          onSuccess: () => {
            setEmail("");
            setPassword("");
            queryClient.refetchQueries();
            router.replace("/(drawer)");
          },
        }
      );
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="space-y-4">
      {error && (
        <View className="p-3 bg-destructive/10 rounded-md">
          <Text className="text-destructive text-sm">{error}</Text>
        </View>
      )}

      <View className="space-y-2">
        <Text className="text-sm font-medium text-foreground">Email</Text>
        <TextInput
          className="p-4 rounded-md bg-input text-foreground border border-input"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!isLoading}
        />
      </View>

      <View className="space-y-2">
        <Text className="text-sm font-medium text-foreground">Password</Text>
        <TextInput
          className="p-4 rounded-md bg-input text-foreground border border-input"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          autoComplete="password"
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading}
        className="bg-primary p-4 rounded-md flex-row justify-center items-center mt-4"
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-primary-foreground font-medium">Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
