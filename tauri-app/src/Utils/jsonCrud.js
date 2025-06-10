import {
  readTextFile,
  writeTextFile,
  exists,
  BaseDirectory,
} from "@tauri-apps/plugin-fs";

export async function readJson(fileName) {
  const safeFileName = fileName.replace(/[^a-zA-Z0-9_.-]/g, "");
  
  try {
    // Check if file exists first
    const fileExists = await exists(safeFileName, { baseDir: BaseDirectory.AppLocalData });
    
    if (!fileExists) {
      return []; // Return empty array for new files
    }
    
    const contents = await readTextFile(safeFileName, {
      baseDir: BaseDirectory.AppLocalData, // Keep baseDir
    });
    
    if (!contents || contents.trim() === '') {
      return [];
    }
    
    return JSON.parse(contents);
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return [];
  }
}

export async function writeJson(fileName, data) {
  const safeFileName = fileName.replace(/[^a-zA-Z0-9_.-]/g, "");
  
  try {
    await writeTextFile(safeFileName, JSON.stringify(data, null, 2), {
      baseDir: BaseDirectory.AppLocalData, // Keep baseDir
    });
    console.log(`✅ Successfully saved ${safeFileName}`);
  } catch (error) {
    console.error(`❌ Failed to save ${safeFileName}:`, error);
  }
}

// Keep the rest of your functions as they were
export async function updateJson(fileName, updater) {
  const data = await readJson(fileName);
  const updated = updater(data);
  await writeJson(fileName, updated);
}

export async function deleteFromJson(fileName, filterFn) {
  await updateJson(fileName, (data) =>
    Array.isArray(data) ? data.filter((entry) => !filterFn(entry)) : []
  );
}

export async function addToJson(fileName, entry) {
  await updateJson(fileName, (data) => {
    const currentData = Array.isArray(data) ? data : [];
    return [...currentData, entry];
  });
}

export async function findInJson(fileName, filterFn) {
  const data = await readJson(fileName);
  return Array.isArray(data) ? data.filter(filterFn) : [];
}