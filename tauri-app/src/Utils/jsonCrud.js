// jsonCrud.js
import { readTextFile, writeFile, BaseDirectory } from '@tauri-apps/plugin-fs';
// import { appLocalDataDir } from '@tauri-apps/path';

export async function getFilePath(fileName) {
  const dir = await BaseDirectory.AppLocalData;
  return `${dir}${fileName}`;
}

export async function readJson(fileName) {
  try {
    const path = await getFilePath(fileName);
    const contents = await readTextFile(path);
    return JSON.parse(contents);
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err);
    return null;
  }
}

export async function writeJson(fileName, data) {
  try {
    const path = await getFilePath(fileName);
    await writeFile({ path, contents: JSON.stringify(data, null, 2) });
  } catch (err) {
    console.error(`Error writing ${fileName}:`, err);
  }
}

export async function updateJson(fileName, updater) {
  const data = await readJson(fileName);
  if (!data) return;
  const updated = updater(data);
  await writeJson(fileName, updated);
}

export async function deleteFromJson(fileName, filterFn) {
  await updateJson(fileName, (data) => data.filter((entry) => !filterFn(entry)));
}

export async function addToJson(fileName, entry) {
  await updateJson(fileName, (data) => [...data, entry]);
}

export async function findInJson(fileName, filterFn) {
  const data = await readJson(fileName);
  return data ? data.filter(filterFn) : [];
}
