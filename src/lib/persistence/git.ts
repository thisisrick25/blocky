import { invoke } from "@tauri-apps/api/core";

export async function initGitRepo(path: string) {
  return await invoke("git_init", { path });
}

export async function commitChanges(path: string, message: string, name: string, email: string) {
  return await invoke("git_commit", { path, message, name, email });
}

export async function pushToGitHub(path: string, url: string) {
  return await invoke("git_push", { path, url });
}
