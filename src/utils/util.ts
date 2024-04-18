export function sanitizeId(id: string) {
    let sanitized = id

    if (sanitized.length > 9 && sanitized.endsWith('-ss')) {
        sanitized = sanitized.substring(0, sanitized.length - 3)
    }

    return sanitized.replace(/[^0-9a-z]/gi, 'G')
}

export const avatars = ["assets/login/Adam_login.png", "assets/login/Ash_login.png", "assets/login/Lucy_login.png", "assets/login/Nancy_login.png"]

export function getAvatarById(id: number) {
    return avatars[Math.max(0, Math.min(id, avatars.length - 1))];
}