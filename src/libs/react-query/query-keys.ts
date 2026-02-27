// Centralized query key management
export const queryKeys = {
  // Users domain
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
    profile: (id: number) => [...queryKeys.users.all, "profile", id] as const,
  },
} as const;

// Helper function to invalidate related queries
export const invalidationHelpers = {
  users: {
    all: () => queryKeys.users.all,
    byId: (id: number) => queryKeys.users.detail(id),
  },
};
