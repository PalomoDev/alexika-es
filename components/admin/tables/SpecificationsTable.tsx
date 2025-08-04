// components/admin/SpecificationsTable.tsx
'use client'

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usando } from "@/db/data";

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

interface SpecificationsTableProps {
    specifications: Specification[];
    values: SpecificationValue[];
    onChange: (values: SpecificationValue[]) => void;
}

const SpecificationsTable = ({ specifications, values, onChange }: SpecificationsTableProps) => {

    console.log('component---------------------', specifications, values)

    // Создаем мапу key -> id для быстрого поиска
    const keyToIdMap = specifications.reduce((acc, spec) => {
        acc[spec.key] = spec.id;
        return acc;
    }, {} as Record<string, string>);

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
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Specification</TableHead>
                        <TableHead className="w-[100px]">Unit</TableHead>
                        <TableHead>Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
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
                                    {spec.key === "actividades" ? (
                                        <Select
                                            value={getCurrentValueByKey("actividades")}
                                            onValueChange={(value) => handleValueChange(spec.id, value)}
                                        >
                                            <SelectTrigger className="max-w-xs">
                                                <SelectValue placeholder="Select activity" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {usando.map((activity) => (
                                                    <SelectItem key={activity} value={activity}>
                                                        {activity}
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