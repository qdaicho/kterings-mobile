import React from "react";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import Constants from 'expo-constants';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiUrl = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    <ClerkProvider publishableKey='pk_test_bGVhcm5pbmctc3VuYmVhbS0xMC5jbGVyay5hY2NvdW50cy5kZXYk'>
      <Slot />
    </ClerkProvider>
  );
}