export function getCurrentUser(): string | null {
    if (typeof localStorage !== 'undefined') {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser ? JSON.parse(currentUser) : null;
    }
    return null;
}
export function getCurrentUserId(): string | null {
    if (typeof localStorage !== 'undefined') {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser ? JSON.parse(currentUser)?.id : null;
    }
    return null;
}
export function getCurrentUserAuthenticationCode(): string | null {
    if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('token');
        return token ? token: null;
    }
    return null;
}
export function getCurrentUserFullName(): string | null {
    if (typeof localStorage !== 'undefined') {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser ? JSON.parse(currentUser).full_name:null;
    }
    return null;
}
export function getCurrentUserPoints(): string | null {
    if (typeof localStorage !== 'undefined') {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser ? JSON.parse(currentUser).points:null;
    }
    return null;
}
export function getCurrentUserlang(): string | null {
    if (typeof localStorage !== 'undefined') {
        const lang = localStorage.getItem('selectedLanguage');
        const apiLang = lang == 'English' ? 'en' : 'ar';
        return apiLang ? apiLang:null;
    }
    return null;
}
export function getAuthenticationMode(): string | null {
    if (typeof localStorage !== 'undefined') {
        const IsAuthinticated = localStorage.getItem('IsAuthinticated');
        return IsAuthinticated ? IsAuthinticated:null;
    }
    return null;
}
