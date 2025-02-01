import { useState, useEffect, useCallback } from 'react';

interface AutosaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  interval?: number;
  saveOnUnmount?: boolean;
}

export function useAutosave<T>({
  data,
  onSave,
  interval = 1000,
  saveOnUnmount = true,
}: AutosaveOptions<T>) {
  const [lastSavedData, setLastSavedData] = useState<T>(data);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const save = useCallback(async () => {
    if (JSON.stringify(data) === JSON.stringify(lastSavedData)) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(data);
      setLastSavedData(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save'));
    } finally {
      setIsSaving(false);
    }
  }, [data, lastSavedData, onSave]);

  // Autosave on interval
  useEffect(() => {
    const timer = setInterval(save, interval);
    return () => clearInterval(timer);
  }, [save, interval]);

  // Save on unmount
  useEffect(() => {
    if (saveOnUnmount) {
      return () => {
        if (JSON.stringify(data) !== JSON.stringify(lastSavedData)) {
          save();
        }
      };
    }
  }, [data, lastSavedData, save, saveOnUnmount]);

  return { isSaving, error };
}
