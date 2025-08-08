'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Slider } from "@/components/ui/slider"

interface WeightRangeSliderProps {
    /** Минимальный вес из доступных товаров (после фильтрации без веса) */
    minWeight: number
    /** Максимальный вес из доступных товаров (после фильтрации без веса) */
    maxWeight: number
    /** Текущий выбранный минимальный вес */
    currentMinWeight?: number | null
    /** Текущий выбранный максимальный вес */
    currentMaxWeight?: number | null
    /** CSS класс для стилизации */
    className?: string
}

const WeightRangeSlider = ({
                               minWeight,
                               maxWeight,
                               currentMinWeight,
                               currentMaxWeight,
                               className = ""
                           }: WeightRangeSliderProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Локальное состояние для управления слайдером
    const [localRange, setLocalRange] = useState([
        currentMinWeight ?? minWeight,
        currentMaxWeight ?? maxWeight
    ])

    // Обновляем локальное состояние при изменении пропсов
    useEffect(() => {
        setLocalRange([
            currentMinWeight ?? minWeight,
            currentMaxWeight ?? maxWeight
        ])
    }, [currentMinWeight, currentMaxWeight, minWeight, maxWeight])

    // Обработчик изменения значений во время перетаскивания
    const handleValueChange = (values: number[]) => {
        setLocalRange(values)
    }

    // Обработчик завершения изменения (отпускание ползунка)
    const handleValueCommit = (values: number[]) => {
        const [min, max] = values
        const params = new URLSearchParams(searchParams)

        // Устанавливаем минимальный вес только если он больше доступного минимума
        if (min > minWeight) {
            params.set('minWeight', min.toString())
        } else {
            params.delete('minWeight')
        }

        // Устанавливаем максимальный вес только если он меньше доступного максимума
        if (max < maxWeight) {
            params.set('maxWeight', max.toString())
        } else {
            params.delete('maxWeight')
        }

        router.push(`${pathname}?${params.toString()}`)
    }

    // Обработчик сброса минимального значения
    const handleResetMin = () => {
        const newRange = [minWeight, localRange[1]]
        setLocalRange(newRange)
        handleValueCommit(newRange)
    }

    // Обработчик сброса максимального значения
    const handleResetMax = () => {
        const newRange = [localRange[0], maxWeight]
        setLocalRange(newRange)
        handleValueCommit(newRange)
    }

    // Если минимум и максимум равны, не показываем слайдер
    if (minWeight === maxWeight || maxWeight === 0) {
        return null
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Отображение текущего выбранного диапазона */}
            <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>{localRange[0]}кг</span>
                <span>{localRange[1]}кг</span>
            </div>

            {/* Слайдер с двумя ползунками */}
            <Slider
                value={localRange}
                onValueChange={handleValueChange}
                onValueCommit={handleValueCommit}
                min={minWeight}
                max={maxWeight}
                step={0.1}
                className="w-full"
            />

            {/* Отображение доступного диапазона */}
            <div className="flex justify-between text-xs text-gray-600">
                <button
                    onClick={handleResetMin}
                    className="cursor-pointer"
                    title="Вернуть к минимуму доступного диапазона"
                >
                    Min: {minWeight}кг
                </button>
                <button
                    onClick={handleResetMax}
                    className="cursor-pointer"
                    title="Вернуть к максимуму доступного диапазона"
                >
                    Max: {maxWeight}кг
                </button>
            </div>
        </div>
    )
}

export default WeightRangeSlider