
// components/admin/SpecificationsTable.tsx
'use client'

/**
 * Компонент SpecificationsTable отображает таблицу спецификаций для заданной категории.
 * Позволяет просматривать и редактировать значения спецификаций.
 * Спецификации могут иметь типы "number" или "text", а также специальные варианты выбора для ключа "actividades".
 */

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usando } from "@/db/data";
import {
    AISLANTE,
    COLOR, MATERIAL_INFERIOR, MATERIAL_SUPERIOR, RELLENO_DE_LA_ESTERILLA,
    RESISTENCIA_VIENTO, TEJIDO_EXTERIOR_INFERIOR, TEJIDO_EXTERIOR_SUPERIOR, TEJIDO_INTERIOR,
    TEMPORADA,
    TIENDA_EXTERIOR,
    TIENDA_INTERIOR,
    TIENDA_SUELO,
    VARILLAS
} from "@/db/specificacions";


// --- Мок-опции для select ---
const selectOptions: Record<string, string[]> = {
    actividades: ["extremo", "senderismo", "camping", "aventura", "pesca y caza"],
    "material-exterior": TIENDA_EXTERIOR,
    "material-del-suelo": TIENDA_SUELO,
    "tejido-exterior-superior": TEJIDO_EXTERIOR_SUPERIOR,
    "tienda-interior": TIENDA_INTERIOR,
    "material-varillas": VARILLAS,
    "tejido-exterior-inferior": TEJIDO_EXTERIOR_INFERIOR,
    "tejido-interior": TEJIDO_INTERIOR,
    "resistencia-al-viento": RESISTENCIA_VIENTO,
    "material-inferior": MATERIAL_INFERIOR,
    "material-superior": MATERIAL_SUPERIOR,
    "relleno-de-la-esterilla": RELLENO_DE_LA_ESTERILLA,


    aislante: AISLANTE,
    color: COLOR,
    temporada: TEMPORADA,
};


// --- Типы данных ---
interface SpecificationValue {
    specificationId: string;
    value: string;
}

interface Specification {
    id: string;
    name: string;
    type: "number" | "text";
    key: string;
    unit: string | null;
    isRequired: boolean | null;
    sortOrder: number;
}

// --- Пропсы компонента ---
interface SpecificationsTableProps {
    specifications: Specification[];
    values: SpecificationValue[];
    onChange: (values: SpecificationValue[]) => void;
}

// --- Компонент ---
const SpecificationsTable = ({ specifications, values, onChange }: SpecificationsTableProps) => {

    console.log('component---------------------', specifications, values)

    // --- Утилиты ---
    // Создаем мапу key -> id для быстрого поиска
    const keyToIdMap = specifications.reduce((acc, spec) => {
        acc[spec.key] = spec.id;
        return acc;
    }, {} as Record<string, string>);

    // --- Функции обработки ---
    const handleValueChange = (specificationId: string, newValue: string) => {
        const currentValues = values || [];
        const existingIndex = currentValues.findIndex(sv => sv.specificationId === specificationId);
        if (existingIndex >= 0) {
            // Обновляем существующее значение
            const newValues = [...currentValues];
            newValues[existingIndex] = {
                specificationId,
                value: newValue
            };
            onChange(newValues);
        } else {
            // Добавляем новое значение
            onChange([
                ...currentValues,
                {
                    specificationId,
                    value: newValue
                }
            ]);
        }
    };

    const getCurrentValue = (specificationId: string): string => {
        return values?.find(sv => sv.specificationId === specificationId)?.value || '';
    };

    // Получаем значение по key спецификации
    const getCurrentValueByKey = (key: string): string => {
        const specId = keyToIdMap[key];
        return specId ? getCurrentValue(specId) : '';
    };

    // --- JSX рендер ---
    if (!specifications || specifications.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground border rounded-lg">
                No specifications available for this category
            </div>
        );
    }

    return (
        <div className="border rounded-lg">
            <Table>
                {/* Заголовок таблицы */}
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Specification</TableHead>
                        <TableHead className="w-[100px]">Unit</TableHead>
                        <TableHead>Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Строки спецификаций */}
                    {specifications
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((spec) => (
                            <TableRow key={spec.id}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>
                                            {spec.name}
                                            {spec.isRequired && (
                                                <span className="text-red-500 ml-1">*</span>
                                            )}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {spec.unit || '-'}
                                </TableCell>
                                <TableCell>
                                    {/* Рендер значения спецификации */}
                                    {spec.key in selectOptions ? (
                                        <Select
                                            value={getCurrentValue(spec.id)}
                                            onValueChange={(value) => handleValueChange(spec.id, value)}
                                        >
                                            <SelectTrigger className="max-w-xs">
                                                <SelectValue placeholder={`Выберите ${spec.name.toLowerCase()}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {selectOptions[spec.key].map((option) => (
                                                    <SelectItem key={option} value={option}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            type={spec.type === 'number' ? 'number' : 'text'}
                                            placeholder={`Enter ${spec.name.toLowerCase()}`}
                                            value={getCurrentValue(spec.id)}
                                            onChange={(e) => handleValueChange(spec.id, e.target.value)}
                                            className="max-w-xs"
                                        />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
};

export default SpecificationsTable;


