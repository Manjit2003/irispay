import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function SignInScreen() {
  return (
    <Container>
      <View className="flex-1 p-6">
        <View className="flex-1 justify-center">
          <View className="mb-8">
            <Text className="text-4xl font-bold text-foreground mb-2">
              Welcome Back
            </Text>
            <Text className="text-lg text-muted-foreground">
              Sign in to your account to continue
            </Text>
          </View>

          <SignIn />

          <View className="mt-6 flex-row justify-center">
            <Text className="text-muted-foreground">
              Don't have an account?{" "}
            </Text>
            <Link href="/sign-up" asChild>
              <Text className="text-primary font-medium">Sign Up</Text>
            </Link>
          </View>
        </View>
      </View>
    </Container>
  );
}
