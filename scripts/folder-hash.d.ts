declare module 'folder-hash' {
  export function hashElement(path: string, options: any): Promise<{ hash: string }>;
}
