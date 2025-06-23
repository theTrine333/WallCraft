import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { SQLiteDatabase } from "expo-sqlite";
import { Alert } from "react-native";
type DownloadRecord = {
  db: SQLiteDatabase;
  uri: string;
  localUri: string;
};

export const insertImageRecord = async ({
  db,
  uri,
  localUri,
}: DownloadRecord): Promise<void> => {
  const timestamp = new Date().toISOString();

  try {
    await db.runAsync(
      `INSERT INTO Downloads (uri, localUri, timestamp) VALUES (?, ?, ?)`,
      [uri, localUri, timestamp]
    );
    console.log("Image record inserted successfully.");
  } catch (error) {
    console.error("Failed to insert image record:", error);
  }
};

export const clearAllImages = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM Downloads");
    return true;
  } catch (error) {
    console.log("Error deleting downloads : ", error);
  }
};

export const checkDownload = async ({
  db,
  uri,
  localUri,
}: {
  db: SQLiteDatabase;
  uri: string;
  localUri: string;
}) => {
  try {
    const res = await db.getFirstAsync(
      "SELECT * FROM Downloads where uri=? OR localUri=?",
      [uri, localUri]
    );
    if (res != null) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error occured - ", error);
  }
};

const KEYS_TO_CLEAR = [
  "APP_CONFIG",
  "WALLPAPER_DOWNLOADS",
  "WALLPAPER_CURRENT_INDEX",
];

export function confirmAndClearAppCache(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to delete all cached data and downloaded wallpapers?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: "Yes, Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              const cached = await AsyncStorage.getItem("WALLPAPER_DOWNLOADS");
              const downloads: { localUri: string }[] = cached
                ? JSON.parse(cached)
                : [];

              for (const { localUri } of downloads) {
                if (localUri?.startsWith("file://")) {
                  try {
                    await FileSystem.deleteAsync(localUri, {
                      idempotent: true,
                    });
                    console.log(`🗑️ Deleted file: ${localUri}`);
                  } catch (err) {
                    console.warn(`⚠️ Failed to delete: ${localUri}`, err);
                  }
                }
              }

              await AsyncStorage.multiRemove(KEYS_TO_CLEAR);
              console.log("🧹 Cache and downloads cleared");
              resolve(true);
            } catch (err) {
              console.error("❌ Failed to clear app cache and downloads:", err);
              resolve(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  });
}

export const getAllDownloads = async (
  db: SQLiteDatabase
): Promise<DownloadRecord[]> => {
  try {
    const result = await db.getAllAsync<DownloadRecord>(
      `SELECT * FROM Downloads ORDER BY timestamp DESC`
    );
    return result;
  } catch (error) {
    console.error("Failed to fetch downloads:", error);
    return [];
  }
};

export type GenreEntry = {
  name: string;
  count: number;
  alias: string;
  image_url: string;
};

export const insertGenres = async (
  db: SQLiteDatabase,
  genres: GenreEntry[]
): Promise<void> => {
  try {
    await db.runAsync("BEGIN TRANSACTION");
    for (const genre of genres) {
      await db.runAsync(
        `INSERT OR IGNORE INTO Genres (name, count, alias, image_url) VALUES (?, ?, ?, ?)`,
        [genre.name, genre.count, genre.alias, genre.image_url]
      );
    }
    await db.runAsync("COMMIT");
    console.log("Genres inserted successfully.");
  } catch (error) {
    await db.runAsync("ROLLBACK");
    console.error("Failed to insert genres:", error);
  }
};

export const getAllGenres = async (
  db: SQLiteDatabase
): Promise<GenreEntry[]> => {
  try {
    const result = await db.getAllAsync<GenreEntry>(
      `SELECT * FROM Genres ORDER BY name ASC`
    );
    return result;
  } catch (error) {
    console.error("Failed to fetch genres:", error);
    return [];
  }
};

export const getGenreByName = async (
  db: SQLiteDatabase,
  name: string
): Promise<GenreEntry | null> => {
  try {
    const result = await db.getFirstAsync<GenreEntry>(
      `SELECT * FROM Genres WHERE name = ? ORDER BY name ASC`,
      [name]
    );

    return result ?? null;
  } catch (error) {
    console.error(`Failed to fetch genre "${name}":`, error);
    return null;
  }
};
