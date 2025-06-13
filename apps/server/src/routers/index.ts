import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { db } from "@/db";
import { userSchema } from "better-auth/db";
import { eq, ne, sql } from "drizzle-orm";
import { user } from "@/db/schema/auth";
import { z } from "zod";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  getUserWallet: protectedProcedure.query(async ({ ctx }) => {
    const [userWallet] = await db
      .select()
      .from(user)
      .where(eq(user.id, ctx.session.user.id));
    return userWallet.walletBalance;
  }),
  getPhoneNumber: protectedProcedure.query(async ({ ctx }) => {
    const [userPhoneNumber] = await db
      .select()
      .from(user)
      .where(eq(user.id, ctx.session.user.id));
    return userPhoneNumber.phoneNumber;
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  transferMoney: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        receiverId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { amount, receiverId } = input;
      const { user: sender } = ctx.session;

      const receiver = await db
        .select()
        .from(user)
        .where(eq(user.id, receiverId));

      if (!receiver) {
        throw new Error("Receiver not found");
      }

      if (sender.walletBalance && sender.walletBalance < amount) {
        throw new Error("Insufficient balance");
      }

      await db.transaction(async (tx) => {
        await tx
          .update(user)
          .set({
            walletBalance: sql`${user.walletBalance} - ${amount}`,
          })
          .where(eq(user.id, sender.id));
        await tx
          .update(user)
          .set({
            walletBalance: sql`${user.walletBalance} + ${amount}`,
          })
          .where(eq(user.id, receiverId));
      });

      return {
        message: "Money transferred successfully",
      };
    }),
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await db
      .select({ id: user.id, name: user.name, phoneNumber: user.phoneNumber })
      .from(user)
      .where(ne(user.id, ctx.session.user.id));
    return users;
  }),
});
export type AppRouter = typeof appRouter;
