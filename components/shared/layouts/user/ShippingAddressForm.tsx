'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/lib/auth-client';
import { ShippingAddress, ShippingAddressSchema, SPAIN_PROVINCES, MAJOR_CITIES_BY_PROVINCE } from '@/lib/validations/user/address-validation';
import {UserBase} from "@/lib/validations/product/base";
import {updateUserAddress} from "@/lib/actions/user/user.action";

interface ShippingAddressFormProps {
    onAddressSaved?: (address: ShippingAddress) => void;
    onNext?: () => void;
    user: UserBase;
}

export const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
                                                                            onAddressSaved,
                                                                            onNext,
                                                                            user
                                                                        }) => {

    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [hasExistingAddress, setHasExistingAddress] = useState(false);
    const [openProvince, setOpenProvince] = useState(false);
    const [openCity, setOpenCity] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [availableCities, setAvailableCities] = useState<string[]>([]);

    const form = useForm<ShippingAddress>({
        resolver: zodResolver(ShippingAddressSchema),
        defaultValues: {
            street: '',
            city: '',
            province: '',
            postalCode: '',
            country: 'España',
            phone: '',
            apartment: '',
            instructions: ''
        },
    });

    // Загружаем существующий адрес пользователя
    useEffect(() => {
        if (user?.address) {
            const address = user.address as ShippingAddress;
            setHasExistingAddress(true);
            form.reset(address);
            setSelectedProvince(address.province);
            updateAvailableCities(address.province);
        }
    }, [user, form]);

    // Обновляем список городов при выборе провинции
    const updateAvailableCities = (province: string) => {
        const cities = MAJOR_CITIES_BY_PROVINCE[province] || [];
        setAvailableCities(cities);
    };

    const handleProvinceChange = (province: string) => {
        setSelectedProvince(province);
        form.setValue('province', province);
        form.setValue('city', ''); // Сбрасываем город при смене провинции
        updateAvailableCities(province);
        setOpenProvince(false);
    };

    const handleCityChange = (city: string) => {
        form.setValue('city', city);
        setOpenCity(false);
    };

    const onSubmit = async (data: ShippingAddress) => {
        setIsLoading(true);

        const addressData = { ...data, userId: user.id };
        try {
            const direction = await updateUserAddress(addressData)


            if(!direction.success) throw new Error(direction.message);


            toast.success('Dirección guardada', {
                description: `Tu dirección de envío ha sido guardada: ${data.street}, ${data.city}`
            });

            onAddressSaved?.(data);
            onNext?.();

        } catch (error) {
            toast.error('Error', {
                description: 'No se pudo guardar la dirección'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Dirección de envío
                </CardTitle>
                <CardDescription>
                    {hasExistingAddress
                        ? 'Puedes editar tu dirección existente o confirmarla tal como está'
                        : 'Ingresa tu dirección de envío para continuar con el pedido'
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Dirección */}
                            <FormField
                                control={form.control}
                                name="street"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dirección *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Calle y número"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Apartamento */}
                            <FormField
                                control={form.control}
                                name="apartment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Apartamento/Piso</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Piso, puerta, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Provincia */}
                            <FormField
                                control={form.control}
                                name="province"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Provincia *</FormLabel>
                                        <Popover open={openProvince} onOpenChange={setOpenProvince}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value || "Selecciona provincia"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Buscar provincia..." />
                                                    <CommandEmpty>No se encontró la provincia</CommandEmpty>
                                                    <CommandGroup className="max-h-64 overflow-auto">
                                                        {SPAIN_PROVINCES.map((province: string, index: number) => (
                                                            <CommandItem
                                                                key={province}
                                                                onSelect={() => handleProvinceChange(province)}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        field.value === province ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {province}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Ciudad */}
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ciudad *</FormLabel>
                                        {availableCities.length > 0 ? (
                                            <Popover open={openCity} onOpenChange={setOpenCity}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value || "Selecciona ciudad"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Buscar ciudad o escribir nueva..."
                                                            onValueChange={(value) => {
                                                                if (value && !availableCities.includes(value)) {
                                                                    form.setValue('city', value);
                                                                }
                                                            }}
                                                        />
                                                        <CommandEmpty>
                                                            <Button
                                                                variant="ghost"
                                                                className="w-full"
                                                                onClick={() => {
                                                                    const inputValue = form.getValues('city');
                                                                    if (inputValue) {
                                                                        handleCityChange(inputValue);
                                                                    }
                                                                }}
                                                            >
                                                                Usar {form.watch('city')}
                                                            </Button>
                                                        </CommandEmpty>
                                                        <CommandGroup className="max-h-48 overflow-auto">
                                                            {availableCities.map((city) => (
                                                                <CommandItem
                                                                    key={city}
                                                                    onSelect={() => handleCityChange(city)}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value === city ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {city}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        ) : (
                                            <FormControl>
                                                <Input
                                                    placeholder="Introduce tu ciudad"
                                                    {...field}
                                                />
                                            </FormControl>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Código postal */}
                            <FormField
                                control={form.control}
                                name="postalCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Código postal *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="28001"
                                                maxLength={5}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Teléfono */}
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teléfono *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="+34 600 123 456"
                                                type="tel"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* País */}
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>País</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled
                                                className="bg-muted"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Instrucciones de entrega */}
                        <FormField
                            control={form.control}
                            name="instructions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instrucciones de entrega (opcional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Información adicional para el repartidor..."
                                            className="min-h-20"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {isLoading ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};