import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { queryClient } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import QRCode from "react-native-qrcode-svg";

export default function ProfileScreen() {
  const { data: session } = authClient.useSession();
  const { data: userWallet } = useQuery(trpc.getUserWallet.queryOptions());

  const handleSignOut = () => {
    authClient.signOut();
    queryClient.invalidateQueries();
  };

  return (
    <Container>
      <ScrollView className="flex-1">
        <View className="p-6">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Profile
            </Text>
            <Text className="text-lg text-muted-foreground">
              Manage your account settings
            </Text>
          </View>

          <QRCode value="http://awesome.link.qr" />

          <View className="space-y-6">
            {/* User Info Card */}
            <View className="bg-card rounded-xl p-6 border border-border">
              <Text className="text-lg font-semibold text-foreground mb-4">
                Account Information
              </Text>

              <View className="space-y-3">
                <View>
                  <Text className="text-sm text-muted-foreground">Name</Text>
                  <Text className="text-foreground font-medium">
                    {session?.user.name}
                  </Text>
                </View>

                <View>
                  <Text className="text-sm text-muted-foreground">Email</Text>
                  <Text className="text-foreground font-medium">
                    {session?.user.email}
                  </Text>
                </View>

                <View>
                  <Text className="text-sm text-muted-foreground">
                    Wallet Balance
                  </Text>
                  <Text className="text-foreground font-medium">
                    ${userWallet || "0.00"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Sign Out Button */}
            <TouchableOpacity
              onPress={handleSignOut}
              className="bg-destructive p-4 rounded-xl"
            >
              <Text className="text-destructive-foreground font-medium text-center">
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
