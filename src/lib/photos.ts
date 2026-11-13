import { createStore, del, get, set } from 'idb-keyval';

/** Фото дневника в IndexedDB: ключ — id фото из Trip.photoIds */
const store = typeof indexedDB === 'undefined' ? null : createStore('oblako', 'photos');

export async function savePhoto(id: string, file: Blob): Promise<boolean> {
  if (!store) return false;
  try {
    await set(id, file, store);
    return true;
  } catch {
    return false;
  }
}

export async function getPhoto(id: string): Promise<Blob | null> {
  if (!store) return null;
  try {
    return (await get<Blob>(id, store)) ?? null;
  } catch {
    return null;
  }
}

export async function deletePhoto(id: string): Promise<void> {
  if (!store) return;
  try {
    await del(id, store);
  } catch {
    // нет доступа к IndexedDB — нечего удалять
  }
}
