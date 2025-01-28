import { useCallback } from "react";

interface ILocalStorage
{
    loadFromStorage: (key: string, defaultValue: boolean) => boolean;
    saveToStorage: (key: string, value: boolean) => void;
}

/**
 * Handles reading and writing to localStorage.
 *
 * @returns {ILocalStorage<boolean>} - An object containing:
 * - `loadFromStorage`: Function to load data from localStorage.
 * - `saveToStorage`: Function to save data to localStorage.
 */
export function useLocalStorage(): ILocalStorage
{
	function loadFromStorage(key: string, defaultValue: boolean): boolean 
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
  
	function saveToStorage(key: string, value: boolean): void 
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
	
	return { 
		loadFromStorage: memoizedLoadFromStorage, 
		saveToStorage: memoizedSaveToStorage 
	};
}