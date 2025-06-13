import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { db } from "../db";
import * as schema from "../db/schema/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: schema,
  }),
  trustedOrigins: ["*"],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: false,
      },
      faceScanData: {
        type: "string",
        required: false,
      },
      walletBalance: {
        type: "number",
        required: false,
      },
    },
  },
  plugins: [expo()],
});
