export const roles: Record<string, string[]> = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  user: ["read"],
};
