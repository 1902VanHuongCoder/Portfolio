import {createContext, useState, useEffect} from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase_setup/firebase";
import PropTypes from 'prop-types';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchActiveTheme = async () => {
            try {
                const q = query(collection(db, "themes"), where("isShow", "==", true));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const themeData = {
                        id: querySnapshot.docs[0].id,
                        ...querySnapshot.docs[0].data(),
                    };
                    setTheme(themeData);
                } else {
                    // No theme is active, use default
                    setTheme({ themeSlug: "default" });
                }
            } catch (error) {
                console.error("Error fetching active theme:", error);
                setTheme({ themeSlug: "default" });
            } finally {
                setLoading(false);
            }
        };
        fetchActiveTheme();
    }, []);
    
    return (
        <ThemeContext.Provider value={{theme, setTheme, loading}}>
            {children}
        </ThemeContext.Provider>
    );
}

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired
};
