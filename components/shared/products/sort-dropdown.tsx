import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface SortDropdownProps {
    onSortChange: (value: string) => void;
}


export const SortDropdown = ({onSortChange} : SortDropdownProps) => {
    const handleSortChange = (value: string) => {
        onSortChange(value)// Логика сортировки
    }

    return (
        <div className="max-w-1/5 w-full ">
            <Select onValueChange={handleSortChange} >
                <SelectTrigger className="w-full  focus:border-brand focus:border-1 rounded-none">
                    <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="price-asc" >
                        Precio: menor a mayor
                    </SelectItem>
                    <SelectItem value="price-desc" >
                        Precio: mayor a menor
                    </SelectItem>
                    <SelectItem value="name-asc" >
                        Nombre: A-Z
                    </SelectItem>
                    <SelectItem value="name-desc" >
                        Nombre: Z-A
                    </SelectItem>
                    <SelectItem value="discount" >
                        Mayor descuento
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}