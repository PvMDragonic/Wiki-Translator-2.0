import { useCallback } from "react";

interface ILocalStorage<T> 
{
    loadFromStorage: (key: string, defaultValue: T) => T;
    saveToStorage: (key: string, value: T) => void;
}

/**
 * Provides methods to save and load data from localStorage.
 *
 * @template T - The type of the data being stored.
 * @returns {ILocalStorage<T>} - An object containing:
 * - `loadFromStorage`: Function to load data from localStorage.
 * - `saveToStorage`: Function to save data to localStorage.
 */
export function useLocalStorage<T>(): ILocalStorage<T>
{
	// Retrieve data from localStorage
	function loadFromStorage(key: string, defaultValue: T): T 
	{
		try 
		{
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : defaultValue;
		}
		catch (error) 
		{
			console.error('Error retrieving localStorage key:', key, error);
			return defaultValue;
		}
	}
  
	// Save data to localStorage
	function saveToStorage(key: string, value: T): void 
	{
		try 
		{
			localStorage.setItem(key, JSON.stringify(value));
		}
		catch (error) 
		{
			console.error('Error saving localStorage key:', key, error);
		}
	}

	const memoizedLoadFromStorage = useCallback(loadFromStorage, []);

	const memoizedSaveToStorage = useCallback(saveToStorage, []);
	
	return { loadFromStorage: memoizedLoadFromStorage, saveToStorage: memoizedSaveToStorage };
}
