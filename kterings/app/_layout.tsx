import { Slot } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import React from 'react';

function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    throw new Error('Missing Publishable Key');
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <Slot />
    </ClerkProvider>
  );
}

export default RootLayout;