import { useState, useEffect } from 'react';

/**
 * 防抖Hook
 * 用于优化搜索和输入性能，避免频繁的API调用
 *
 * @param value 需要防抖的值
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的值
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 设置延迟器
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清除延迟器
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 搜索防抖Hook
 * 专门用于搜索功能的防抖处理
 *
 * @param searchTerm 搜索词
 * @param delay 延迟时间，默认300ms
 * @returns 防抖后的搜索词和搜索状态
 */
export function useSearchDebounce(searchTerm: string, delay: number = 300) {
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  useEffect(() => {
    // 如果搜索词发生变化，设置搜索状态
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm, debouncedSearchTerm]);

  return {
    debouncedSearchTerm,
    isSearching
  };
}

/**
 * 异步操作防抖Hook
 * 用于防抖异步操作，如API调用
 *
 * @param callback 异步回调函数
 * @param delay 延迟时间
 * @returns 防抖后的异步函数
 */
export function useAsyncDebounce<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  delay: number
): T {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = ((...args: Parameters<T>) => {
    return new Promise((resolve, reject) => {
      // 清除之前的定时器
      if (timer) {
        clearTimeout(timer);
      }

      // 设置新的定时器
      const newTimer = setTimeout(async () => {
        try {
          const result = await callback(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);

      setTimer(newTimer);
    });
  }) as T;

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return debouncedCallback;
}