import React, { createContext, useContext, useState } from "react"

const LanguageContext = createContext()

export const LanguageProvider =({children}) => {
    const [language, setlanguage] = useState('en')

    const t = (key) => {
        return Translation[language][key] || key
    }

    const toggleLanguage = () => {
        setlanguage(prev => (prev === 'en' ? 'fi' : 'en'))
    }

    return(
        <LanguageContext.Provider value={{language, setlanguage,toggleLanguage, t}}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage(){
    return useContext(LanguageContext)
}


export const Translation ={
    en:{
        selectRestaurant: 'Select a restaurant from Home to see its menu.',
        restaurant: 'Restaurants',
        price: 'Price',
        distance: 'Distance',
        reviews: 'Reviews',
        back: 'Back',
        send: 'Send',
        chat: 'Chat',
        settings: 'Settings',
        error: 'Error',
        fillAllFields: 'Please fill all fields',
        login: 'Login',
        register: 'Register',
        alreadyHaveAccount: 'Already have an account? Login',
        noAccount: "Don't have an account? Register",
        continue: 'Continue as Guest',
        emailInUse: 'Email is already in use',
        invalidEmail: 'Invalid email address',
        userNotFound: 'User not found',
        wrongPassword: 'Incorrect password',
        weakPassword: 'Password should be at least 6 characters',
        unknownError: 'Something went wrong'
    },
    fi:{
        selectRestaurant: 'Valitse ravintola koti sivulta, nähdäksesi menun.',
        restaurant: 'Ravintolat',
        price: 'Hinta',
        distance: 'Etäisyys',
        reviews: 'Arvostelut',
        back: 'Takaisin',
        send: 'Lähetä',
        chat: 'Viestit',
        settings: 'Asetukset',
        error: 'Virhe',
        fillAllFields: 'Täytä kaikki kentät',
        login: 'Kirjaudu',
        register: 'Rekisteröidy',
        alreadyHaveAccount: 'Onko sinulla jo tili? Kirjaudu',
        noAccount: 'Eikö sinulla ole tiliä? Rekisteröidy',
        continue: 'Jatka vieraana',
        emailInUse: 'Sähköposti on jo käytössä',
        invalidEmail: 'Virheellinen sähköposti',
        userNotFound: 'Käyttäjää ei löydy',
        wrongPassword: 'Väärä salasana',
        weakPassword: 'Salasanan tulee olla vähintään 6 merkkiä',
        unknownError: 'Jotain meni pieleen'
    }
}