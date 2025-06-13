import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { ScrollView, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function ReceiveScreen() {
  const { data: session } = authClient.useSession();

  // Create a unique payment link for the user
  const paymentLink = `iris://pay/${session?.user.id}`;

  return (
    <Container>
      <ScrollView className="flex-1">
        <View className="p-6">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Receive Money
            </Text>
            <Text className="text-lg text-muted-foreground">
              Share your QR code to receive payments
            </Text>
          </View>

          <View className="items-center space-y-6">
            {/* QR Code Card */}
            <View className="bg-card rounded-xl p-6 border border-border items-center">
              <QRCode
                value={paymentLink}
                size={250}
                backgroundColor="white"
                color="black"
              />
              <Text className="text-muted-foreground mt-4 text-center">
                Scan this QR code to send money
              </Text>
            </View>

            {/* Share Button */}
            <View className="w-full">
              <Text className="text-sm text-muted-foreground text-center mb-2">
                Or share your payment link
              </Text>
              <Text className="text-primary text-center font-medium">
                {paymentLink}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
