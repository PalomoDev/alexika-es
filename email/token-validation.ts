import crypto from 'crypto';

// Función para generar token de verificación de email
export const generateEmailVerificationToken = (email: string): string => {
    const currentDay = Math.floor(Date.now() / (1000 * 60 * 60 * 24)); // día actual
    const token = crypto
        .createHash('sha256')
        .update(email + currentDay.toString())
        .digest('hex')
        .slice(-8); // últimos 8 caracteres

    return token;
};

// Función para verificar el token
export const verifyEmailToken = (email: string, providedToken: string): boolean => {
    const currentToken = generateEmailVerificationToken(email);
    return currentToken === providedToken;
};

// Función para generar token con validez extendida (día actual y anterior)
export const verifyEmailTokenWithGracePeriod = (email: string, providedToken: string): boolean => {
    // Verificar token del día actual
    const currentToken = generateEmailVerificationToken(email);
    if (currentToken === providedToken) {
        return true;
    }

    // Verificar token del día anterior (período de gracia)
    const previousDay = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) - 1;
    const previousToken = crypto
        .createHash('sha256')
        .update(email + previousDay.toString())
        .digest('hex')
        .slice(-8);

    return previousToken === providedToken;
};

// Ejemplo de uso:
/*
const userEmail = "usuario@ejemplo.com";
const token = generateEmailVerificationToken(userEmail);
console.log("Token generado:", token);

const isValid = verifyEmailToken(userEmail, token);
console.log("¿Token válido?", isValid);

// Con período de gracia
const isValidWithGrace = verifyEmailTokenWithGracePeriod(userEmail, token);
console.log("¿Token válido con período de gracia?", isValidWithGrace);
*/