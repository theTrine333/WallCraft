import { insertImageRecord } from "@/api/db"; // Adjust import path as needed
import { syncDownloadsToCache } from "@/Cache";
import * as FileSystem from "expo-file-system";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import React, {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";

type DownloadContextType = {
  enqueueDownload: (url: string) => void;
  activeDownload: string | null;
  progress: number;
  db: SQLiteDatabase;
};

const DownloadContext = createContext<DownloadContextType | undefined>(
  undefined
);

export const useDownloads = (): DownloadContextType => {
  const ctx = useContext(DownloadContext);
  if (!ctx)
    throw new Error("useDownloads must be used within DownloadProvider");
  return ctx;
};

type DownloadProviderProps = {
  children: ReactNode;
};

export const DownloadProvider = ({ children }: DownloadProviderProps) => {
  const queueRef = useRef<string[]>([]);
  const isProcessingRef = useRef<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [activeDownload, setActiveDownload] = useState<string | null>(null);
  const db = useSQLiteContext();
  const enqueueDownload = (url: string) => {
    queueRef.current.push(url);
    processQueue();
  };

  const processQueue = async () => {
    if (isProcessingRef.current || queueRef.current.length === 0) return;

    isProcessingRef.current = true;
    const nextUrl = queueRef.current.shift()!;
    setActiveDownload(nextUrl);
    setProgress(0);

    const fileName = nextUrl.split("/").pop();
    const localUri = `${FileSystem.cacheDirectory}${fileName}`;

    const downloadResumable = FileSystem.createDownloadResumable(
      nextUrl,
      localUri,
      {},
      (downloadProgress) => {
        const ratio =
          downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite;
        setProgress(ratio);
      }
    );

    try {
      const result = await downloadResumable.downloadAsync();
      if (!result) {
        throw new Error("Download failed: no result returned.");
      }

      insertImageRecord({ db, uri: nextUrl, localUri: result.uri });
      syncDownloadsToCache(db);
    } catch (error) {
      console.error("Download failed:", error);
    }

    setProgress(0);
    setActiveDownload(null);
    isProcessingRef.current = false;

    if (queueRef.current.length > 0) processQueue();
  };

  return (
    <DownloadContext.Provider
      value={{ enqueueDownload, activeDownload, db, progress }}
    >
      {children}
    </DownloadContext.Provider>
  );
};
