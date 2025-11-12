import { useState, useEffect } from 'react';
import { recipesData } from '../data/recipesData';
import { STORAGE_KEYS } from '../constants';

export default function Recipes({ ingredients }) {
    const [recipes, setRecipes] = useState([]);
    
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.RECIPES);
        if (stored) {
            setRecipes(JSON.parse(stored));
        } else {
            // Load dummy data if no stored data exists
            setRecipes(recipesData.recipes);
        }
    }, []);

    // ...rest of the component code
}