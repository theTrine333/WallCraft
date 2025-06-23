import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { setWallpaper, TYPE_SCREEN } from "rn-wallpapers";
import { getCachedDownloads } from "./Cache";

export const TASK_NAME = "WALLPAPER_ROTATE_TASK";
const INDEX_KEY = "WALLPAPER_CURRENT_INDEX";

// Helper to persist and load wallpaper index
async function getCurrentIndex(): Promise<number> {
  const raw = await AsyncStorage.getItem(INDEX_KEY);
  return raw ? parseInt(raw) : 0;
}

async function setCurrentIndex(index: number) {
  await AsyncStorage.setItem(INDEX_KEY, index.toString());
}

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    const downloads = await getCachedDownloads();
    if (!downloads?.length) {
      console.log("⚠️ No cached wallpapers found.");
      return BackgroundTask.BackgroundTaskResult.Success;
    }
    const index = await getCurrentIndex();
    const { localUri } = downloads[index % downloads.length];

    if (localUri?.startsWith("file://")) {
      await setWallpaper({ uri: localUri }, TYPE_SCREEN.HOME);
      console.log("✅ Wallpaper set to", localUri);
      await setCurrentIndex(index + 1);
    } else {
      console.warn("❌ Invalid wallpaper URI:", localUri);
    }

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (err) {
    console.error("❌ Wallpaper task failed", err);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerWallpaperTask() {
  const status = await BackgroundTask.getStatusAsync();
  if (status === BackgroundTask.BackgroundTaskStatus.Restricted) {
    console.warn("🚫 Background tasks are restricted");
    return;
  }
  const registered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (!registered) {
    await BackgroundTask.registerTaskAsync(TASK_NAME, {
      minimumInterval: 15, // minutes
    });
    console.log("✅ Wallpaper task registered");
  } else {
    console.log("ℹ️ Wallpaper task already registered");
  }

  // await BackgroundTask.triggerTaskWorkerForTestingAsync();
}

export async function unregisterWallpaperTask() {
  await BackgroundTask.unregisterTaskAsync(TASK_NAME);
  console.log("🛑 Wallpaper task unregistered");
}
