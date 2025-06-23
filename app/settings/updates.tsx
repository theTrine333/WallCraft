import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import ThemedStyles, { width } from "@/constants/Styles";
import * as Updates from "expo-updates";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  useColorScheme,
} from "react-native";

const Updater = () => {
  const theme = useColorScheme() ?? "light";
  const styles = ThemedStyles(theme);
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    setIsChecking(true);
    setUpdateError(null);
    try {
      const update = await Updates.checkForUpdateAsync();
      setUpdateAvailable(update.isAvailable);
      if (update.isAvailable) {
        downloadAndInstall();
      }
    } catch (err) {
      setUpdateError("Failed to check for updates.");
    } finally {
      setIsChecking(false);
    }
  };

  const downloadAndInstall = async () => {
    setIsDownloading(true);
    setUpdateError(null);
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync(); // Restarts app with update
    } catch (err) {
      setUpdateError("Failed to download or apply the update.");
      Alert.alert("Update Error", "Could not install the update.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      {/* Body */}
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Image
          source={require("../../assets/images/logo1.png")}
          style={{
            height: 150,
            width: 150,
            borderRadius: 300,
            borderColor: "white",
          }}
        />
        <ThemedText style={{ fontFamily: "SpaceMono" }}>Updates</ThemedText>
        {isChecking && (
          <>
            <ActivityIndicator size="large" color={Colors.constants.pink} />
            <ThemedText>Checking for updates...</ThemedText>
          </>
        )}

        {isDownloading && (
          <>
            <ActivityIndicator size="large" color={Colors.constants.pink} />
            <ThemedText>Downloading update...</ThemedText>
          </>
        )}

        {!isChecking && !isDownloading && (
          <>
            <ThemedText>
              {updateAvailable
                ? "An update is available and will be installed."
                : "Your app is up to date."}
            </ThemedText>

            <Pressable
              onPress={checkForUpdates}
              style={{
                backgroundColor: Colors.constants.pink,
                padding: 10,
                borderRadius: 12,
                width: width * 0.8,
                alignItems: "center",
              }}
            >
              <ThemedText style={{ color: "#fff" }}>Check Again</ThemedText>
            </Pressable>
          </>
        )}

        {updateError && (
          <ThemedText style={{ color: "red" }}>{updateError}</ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
};

export default Updater;
