export interface LearningProgressStore {
  read(): string | null;
  write(value: string): void;
  subscribe(listener: () => void): () => void;
}

export const browserLearningProgressStore: LearningProgressStore = {
  read() {
    return window.localStorage.getItem("morrow:learning-progress:v1");
  },
  write(value) {
    window.localStorage.setItem("morrow:learning-progress:v1", value);
  },
  subscribe(listener) {
    function onStorageChange(event: StorageEvent) {
      if (event.key !== "morrow:learning-progress:v1" && event.key !== null) return;
      listener();
    }

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  },
};
