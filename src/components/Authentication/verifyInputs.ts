export const checkHandle = (handle: string): { valid: boolean; message: string } => {
    if (handle.length < 4) {
        return { valid: false, message: 'Handle must be at least 4 characters long!' }
    }
    return { valid: true, message: '' }
}

export const checkPassword = (password: string): { valid: boolean; message: string } => {
    if (password.length < 5) {
        return { valid: false, message: 'Password must be at least 5 characters long!' }
    }
    return { valid: true, message: '' }
}

export const checkConfirmPassword = (
    password: string,
    confirmPassword: string
): { valid: boolean; message: string } => {
    if (password !== confirmPassword) {
        return { valid: false, message: 'Passwords do not match!' }
    }
    return { valid: true, message: '' }
}
