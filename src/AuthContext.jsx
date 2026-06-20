import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savedMovies, setSavedMovies] = useState([]);
    const [customAvatar, setCustomAvatar] = useState(null);

    const loginWithGoogle = () => {
        return signInWithPopup(auth, googleProvider);
    };

    const loginWithEmail = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signupWithEmail = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
            
            // Load saved movies and avatar from local storage if user logs in
            if (user) {
                const storedMovies = localStorage.getItem(`myList_${user.uid}`);
                if (storedMovies) {
                    setSavedMovies(JSON.parse(storedMovies));
                } else {
                    setSavedMovies([]);
                }
                
                const storedAvatar = localStorage.getItem(`customAvatar_${user.uid}`);
                if (storedAvatar) {
                    setCustomAvatar(storedAvatar);
                } else {
                    setCustomAvatar(null);
                }
            } else {
                setSavedMovies([]);
                setCustomAvatar(null);
            }
        });

        return unsubscribe;
    }, []);

    // Function to toggle a movie in "My List"
    const toggleSavedMovie = (movie) => {
        if (!currentUser) return false;
        
        setSavedMovies((prevMovies) => {
            const isSaved = prevMovies.find((m) => m.id === movie.id);
            let updatedList;
            
            if (isSaved) {
                updatedList = prevMovies.filter((m) => m.id !== movie.id);
            } else {
                updatedList = [...prevMovies, movie];
            }
            
            // Save to local storage instantly
            localStorage.setItem(`myList_${currentUser.uid}`, JSON.stringify(updatedList));
            return updatedList;
        });
        return true;
    };

    const isMovieSaved = (movieId) => {
        return savedMovies.some((m) => m.id === movieId);
    };

    const clearSavedMovies = () => {
        if (!currentUser) return;
        setSavedMovies([]);
        localStorage.removeItem(`myList_${currentUser.uid}`);
    };

    const updateCustomAvatar = (base64Image) => {
        if (!currentUser) return;
        setCustomAvatar(base64Image);
        if (base64Image) {
            localStorage.setItem(`customAvatar_${currentUser.uid}`, base64Image);
        } else {
            localStorage.removeItem(`customAvatar_${currentUser.uid}`);
        }
    };

    const value = {
        currentUser,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        logout,
        savedMovies,
        toggleSavedMovie,
        isMovieSaved,
        clearSavedMovies,
        customAvatar,
        updateCustomAvatar
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
