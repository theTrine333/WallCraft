import { Stack } from "expo-router";
import React from "react";

const HomeLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="viewer" />
      <Stack.Screen name="seeAll" />
      <Stack.Screen name="search" />
      <Stack.Screen name="downloads" />
    </Stack>
  );
};

export default HomeLayout;
