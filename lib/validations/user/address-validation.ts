// lib/validations/address/address-validation.ts
import { z } from 'zod';

export const ShippingAddressSchema = z.object({
    street: z.string().min(1, 'La dirección es obligatoria').max(100, 'Dirección demasiado larga'),
    city: z.string().min(1, 'La ciudad es obligatoria').max(50, 'Ciudad demasiado larga'),
    province: z.string().min(1, 'La provincia es obligatoria').max(50, 'Provincia demasiado larga'),
    postalCode: z.string()
        .min(5, 'El código postal debe tener 5 dígitos')
        .max(5, 'El código postal debe tener 5 dígitos')
        .regex(/^\d{5}$/, 'El código postal debe contener solo números'),
    country: z.string(),
    apartment: z.string().optional(),
    phone: z.string()
        .min(9, 'El teléfono debe tener al menos 9 dígitos')
        .max(15, 'El teléfono no puede tener más de 15 dígitos')
        .regex(/^[+]?[\d\s-()]+$/, 'Formato de teléfono inválido'),
    instructions: z.string().max(200, 'Instrucciones demasiado largas').optional()
});

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

// Datos de España - provincias y algunas ciudades principales
export const SPAIN_PROVINCES = [
    'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila',
    'Badajoz', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria',
    'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada',
    'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Islas Baleares',
    'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lérida',
    'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Orense', 'Palencia',
    'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia',
    'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia',
    'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
];

export const MAJOR_CITIES_BY_PROVINCE: Record<string, string[]> = {
    'Madrid': ['Madrid', 'Alcalá de Henares', 'Fuenlabrada', 'Leganés', 'Getafe'],
    'Barcelona': ['Barcelona', 'Hospitalet de Llobregat', 'Badalona', 'Terrassa', 'Sabadell'],
    'Valencia': ['Valencia', 'Alicante', 'Elche', 'Castellón de la Plana', 'Torrent'],
    'Sevilla': ['Sevilla', 'Jerez de la Frontera', 'Dos Hermanas', 'Alcalá de Guadaíra'],
    'Málaga': ['Málaga', 'Marbella', 'Fuengirola', 'Torremolinos', 'Benalmádena'],
    'Murcia': ['Murcia', 'Cartagena', 'Lorca', 'Molina de Segura'],
    'Las Palmas': ['Las Palmas de Gran Canaria', 'Telde', 'Santa Lucía'],
    'Vizcaya': ['Bilbao', 'Getxo', 'Portugalete', 'Santurtzi'],
    'Alicante': ['Alicante', 'Elche', 'Torrevieja', 'Orihuela', 'Benidorm'],
    'Cádiz': ['Cádiz', 'Jerez de la Frontera', 'Algeciras', 'San Fernando'],
    'Valladolid': ['Valladolid', 'Laguna de Duero', 'Medina del Campo']
};