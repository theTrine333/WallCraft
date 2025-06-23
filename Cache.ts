import AsyncStorage from "@react-native-async-storage/async-storage";
import { SQLiteDatabase } from "expo-sqlite";
import { getAllDownloads } from "./api/db";

const STORAGE_KEY = "WALLPAPER_DOWNLOADS";

export async function syncDownloadsToCache(db: SQLiteDatabase) {
  try {
    const downloads = await getAllDownloads(db);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(downloads));
    console.log("✅ Cached", downloads.length, "wallpapers to AsyncStorage.");
  } catch (err) {
    console.error("❌ Failed to cache wallpapers", err);
  }
}

export async function getCachedDownloads(): Promise<
  { localUri: string }[] | []
> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (err) {
    console.error("❌ Failed to read cached wallpapers", err);
    return [];
  }
}
