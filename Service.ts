import { SQLiteDatabase } from "expo-sqlite";
import BackgroundService from "react-native-background-actions";
import { setWallpaper, TYPE_SCREEN } from "rn-wallpapers"; // Uncomment when using actual wallpaper setting
import { getAllDownloads } from "./api/db";

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

// This closure holds the database instance passed when starting the task
let globalDB: null | any | SQLiteDatabase = null;

const task = async () => {
  while (BackgroundService.isRunning()) {
    console.log("Wallpaper task running...");

    try {
      if (!globalDB) throw new Error("No database connection provided");

      const downloads = await getAllDownloads(globalDB);
      console.log(downloads);

      if (downloads.length === 0) {
        console.log("No wallpapers found in DB.");
      } else {
        const wallpaper = downloads[index % downloads.length];
        const localUri = wallpaper.localUri;

        console.log(`Next wallpaper to set: ${localUri}`);

        // Uncomment this to actually set the wallpaper:
        await setWallpaper({ uri: localUri }, TYPE_SCREEN.HOME);

        index++;
      }
    } catch (error) {
      console.error("Error during wallpaper update:", error);
    }

    await sleep(60 * 1000); // Wait 1 minute
  }
};

const options = {
  taskName: "WallCraft",
  taskTitle: "Wallpaper Manager",
  taskDesc: "Wallpapers are rotating automatically.",
  taskIcon: {
    name: "ic_launcher",
    type: "mipmap",
  },
  color: "#FF00FF",
  linkingURI: "wallcraft://index",
  parameters: {}, // Not used
};

let index = 0;

export async function startWallpaperService(db: any) {
  if (!BackgroundService.isRunning()) {
    globalDB = db; // assign to closure variable
    await BackgroundService.start(task, options);
    console.log("Wallpaper service started");
  }
}

export async function stopWallpaperService() {
  if (BackgroundService.isRunning()) {
    await BackgroundService.stop();
    console.log("Wallpaper service stopped");
  }
}
