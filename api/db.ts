import { SQLiteDatabase } from "expo-sqlite";

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
