import { Stack } from "expo-router";
import React from "react";

const SettingsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="updates" />
    </Stack>
  );
};

export default SettingsLayout;
