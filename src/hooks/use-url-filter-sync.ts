"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { UseFormSetValue, UseFormWatch, FieldValues } from "react-hook-form";

export interface UrlFilterConfig<T extends FieldValues> {
  /**
   * Default values for the filters
   */
  defaultValues: T;
  /**
   * Function to serialize form values to URL parameters
   * Return null/undefined to remove the parameter from URL
   */
  serializers?: Record<string, (value: any) => string | null | undefined>;
  /**
   * Function to deserialize URL parameters to form values
   */
  deserializers?: Record<string, (value: string) => any>;
  /**
   * Whether to replace the URL instead of pushing a new history entry
   * @default true
   */
  replace?: boolean;
  /**
   * Whether to initialize URL parameters with default values on mount
   * @default true
   */
  initializeUrl?: boolean;
  /**
   * Keys to sync with URL
   * Only these form fields will be synced to the URL. If not provided, all keys will be synced.
   */
  syncKeys?: (keyof T)[];
}

export interface UrlFilterSyncResult<T extends FieldValues> {
  /**
   * Update a specific filter field and sync with URL
   */
  updateFilter: (key: keyof T, value: any) => void;
  /**
   * Update multiple filter fields and sync with URL
   */
  updateFilters: (updates: Partial<T>) => void;
  /**
   * Reset all filters to default values and update URL
   */
  resetFilters: () => void;
  /**
   * Get current filter values from URL
   */
  getFiltersFromUrl: () => Partial<T>;
  /**
   * Manually sync form values to URL (useful for batch updates)
   */
  syncToUrl: (values?: Partial<T>) => void;
}

/**
 * A reusable hook to synchronize form state with URL parameters for filters.
 *
 * @param watch - React Hook Form watch function.
 * @param setValue - React Hook Form setValue function.
 * @param config - Configuration object for the hook.
 * @returns Object with helper functions to manage URL-form synchronization.
 *
 * @example
 * interface MyFilters {
 *   token: string;
 *   status: string;
 *   dateRange: [string, string] | null;
 *   internalField: string;
 * }
 *
 * const methods = useForm<MyFilters>({
 *   defaultValues: { token: "all", status: "all", dateRange: null, internalField: "" }
 * });
 *
 * const { updateFilter, resetFilters } = useUrlFilterSync(
 *   methods.watch,
 *   methods.setValue,
 *   {
 *     defaultValues: { token: "all", status: "all", dateRange: null, internalField: "" },
 *     serializers: {
 *       dateRange: (value) => value ? `${value[0]},${value[1]}` : null,
 *     },
 *     deserializers: {
 *       dateRange: (value) => value ? value.split(',') as [string, string] : null,
 *     },
 *     syncKeys: ['token', 'status', 'dateRange'] // Only these fields will be synced to URL
 *   }
 * );
 *
 * // Update a single filter
 * updateFilter('token', 'BTC');
 *
 * // Reset all filters
 * resetFilters();
 */
export function useUrlFilterSync<T extends FieldValues>(
  watch: UseFormWatch<T>,
  setValue: UseFormSetValue<T>,
  config: UrlFilterConfig<T>,
): UrlFilterSyncResult<T> {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    defaultValues,
    serializers = {},
    deserializers = {},
    replace = true,
    initializeUrl = true,
    syncKeys,
  } = config;

  // Default serializer - convert to string, filter out null/undefined
  const defaultSerializer = (value: any): string | null | undefined => {
    if (value === null) return null;
    if (value === undefined) return undefined;
    if (typeof value === "string" && value === "") return null;
    if (Array.isArray(value) && value.length === 0) return null;
    return String(value);
  };
  const defaultDeserializer = (value: string): any => value;

  function areAllFiltersEmpty(obj: object) {
    return Object.values(obj).every((v) => {
      return v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
    });
  }
  /**
   * Get current filter values from URL parameters
   */
  const getFiltersFromUrl = useCallback((): Partial<T> => {
    const filters: any = {};

    for (const key of Object.keys(defaultValues)) {
      // Only sync keys that are in syncKeys array (if provided)
      if (syncKeys && !syncKeys.includes(key as keyof T)) {
        continue;
      }

      const paramValue = searchParams.get(key);
      if (paramValue !== null) {
        const deserializer = deserializers?.[key] || defaultDeserializer;
        filters[key] = deserializer(paramValue);
      }
    }

    return filters;
  }, [searchParams, defaultValues, deserializers, syncKeys]);

  /**
   * Sync current form values to URL
   */
  const syncToUrl = useCallback(
    (values?: Partial<T>) => {
      const currentValues = values || watch();
      const params = new URLSearchParams(searchParams.toString());

      // Remove any keys that are not in syncKeys (if syncKeys is provided)
      if (syncKeys) {
        for (const key of Object.keys(defaultValues)) {
          if (!syncKeys.includes(key as keyof T)) {
            params.delete(String(key));
          }
        }
      }

      // Update or remove parameters based on current values
      for (const [key, value] of Object.entries(currentValues)) {
        // Only sync keys that are in syncKeys array (if provided)
        if (syncKeys && !syncKeys.includes(key as keyof T)) {
          continue;
        }

        const serializer = serializers?.[key] || defaultSerializer;
        const serializedValue = serializer(value);

        if (serializedValue !== null && serializedValue !== undefined) {
          params.set(key, serializedValue);
        } else {
          params.delete(key);
        }
      }
      let newUrl = `${pathname}`;
      if (params.toString()) {
        newUrl = `${pathname}?${params.toString()}`;
      }

      if (replace) {
        router.replace(newUrl);
      } else {
        router.push(newUrl);
      }
    },
    [watch, searchParams, pathname, router, serializers, replace, syncKeys, defaultValues],
  );

  /**
   * Update a specific filter field and sync with URL
   */
  const updateFilter = useCallback(
    (key: keyof T, value: any) => {
      setValue(key as any, value);

      // Create updated values object for URL sync
      const currentValues = watch();
      const updatedValues = { ...currentValues, [key]: value };
      syncToUrl(updatedValues);
    },
    [setValue, watch, syncToUrl],
  );

  /**
   * Update multiple filter fields and sync with URL
   */
  const updateFilters = useCallback(
    (updates: Partial<T>) => {
      // Update form values
      for (const [key, value] of Object.entries(updates)) {
        setValue(key as any, value);
      }
      // Sync to URL
      const currentValues = watch();
      const updatedValues = { ...currentValues, ...updates };
      syncToUrl(updatedValues);
    },
    [setValue, watch, syncToUrl],
  );

  /**
   * Reset all filters to default values and update URL
   */
  const resetFilters = useCallback(() => {
    // Reset form to default values
    for (const [key, value] of Object.entries(defaultValues)) {
      setValue(key as any, value);
    }

    // Sync default values to URL (syncKeys will be handled in syncToUrl)
    syncToUrl(defaultValues);
  }, [setValue, defaultValues, syncToUrl]);

  // Initialize URL parameters with default values on mount
  useEffect(() => {
    if (!initializeUrl) return;

    const urlFilters = getFiltersFromUrl();
    const hasAllFilterEmpty = areAllFiltersEmpty(defaultValues);
    const hasAnyUrlParams = Object.keys(urlFilters).length > 0;
    if (hasAnyUrlParams) return;
    // No URL parameters found, initialize with defaults
    if (!hasAllFilterEmpty) {
      syncToUrl(defaultValues);
    }
  }, [initializeUrl, getFiltersFromUrl, syncToUrl, defaultValues]);

  // Sync URL parameters to form values when URL changes
  useEffect(() => {
    const urlFilters = getFiltersFromUrl();

    // Update form values with URL parameters
    for (const [key, value] of Object.entries(urlFilters)) {
      if (value !== undefined) {
        setValue(key as any, value);
      }
    }
  }, [setValue]);

  return {
    updateFilter,
    updateFilters,
    resetFilters,
    getFiltersFromUrl,
    syncToUrl,
  };
}
