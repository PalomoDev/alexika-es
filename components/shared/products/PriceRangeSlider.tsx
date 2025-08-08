'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Slider } from "@/components/ui/slider"

interface PriceRangeSliderProps {
    /** Минимальная цена из доступных товаров (после фильтрации без цены) */
    minPrice: number
    /** Максимальная цена из доступных товаров (после фильтрации без цены) */
    maxPrice: number
    /** Текущая выбранная минимальная цена */
    currentMinPrice?: number | null
    /** Текущая выбранная максимальная цена */
    currentMaxPrice?: number | null
    /** CSS класс для стилизации */
    className?: string
}

const PriceRangeSlider = ({
                              minPrice,
                              maxPrice,
                              currentMinPrice,
                              currentMaxPrice,
                              className = ""
                          }: PriceRangeSliderProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Локальное состояние для управления слайдером
    const [localRange, setLocalRange] = useState([
        currentMinPrice ?? minPrice,
        currentMaxPrice ?? maxPrice
    ])

    // Обновляем локальное состояние при изменении пропсов
    useEffect(() => {
        setLocalRange([
            currentMinPrice ?? minPrice,
            currentMaxPrice ?? maxPrice
        ])
    }, [currentMinPrice, currentMaxPrice, minPrice, maxPrice])

    // Обработчик изменения значений во время перетаскивания
    const handleValueChange = (values: number[]) => {
        setLocalRange(values)
    }

    // Обработчик завершения изменения (отпускание ползунка)
    const handleValueCommit = (values: number[]) => {
        const [min, max] = values
        const params = new URLSearchParams(searchParams)

        // Устанавливаем минимальную цену только если она больше доступного минимума
        if (min > minPrice) {
            params.set('minPrice', min.toString())
        } else {
            params.delete('minPrice')
        }

        // Устанавливаем максимальную цену только если она меньше доступного максимума
        if (max < maxPrice) {
            params.set('maxPrice', max.toString())
        } else {
            params.delete('maxPrice')
        }

        router.push(`${pathname}?${params.toString()}`)
    }

    // Обработчик сброса минимального значения
    const handleResetMin = () => {
        const newRange = [minPrice, localRange[1]]
        setLocalRange(newRange)
        handleValueCommit(newRange)
    }

    // Обработчик сброса максимального значения  
    const handleResetMax = () => {
        const newRange = [localRange[0], maxPrice]
        setLocalRange(newRange)
        handleValueCommit(newRange)
    }

    // Если минимум и максимум равны, не показываем слайдер
    if (minPrice === maxPrice || maxPrice === 0) {
        return null
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Отображение текущего выбранного диапазона - теперь кликабельные */}
            <div className="flex justify-between text-sm font-medium text-gray-700">

                    <span>€{localRange[0]}</span>


                    <span>€{localRange[1]}</span>

            </div>

            {/* Слайдер с двумя ползунками */}
            <Slider
                value={localRange}
                onValueChange={handleValueChange}
                onValueCommit={handleValueCommit}
                min={minPrice}
                max={maxPrice}
                step={1}
                className="w-full bg-red-400"
            />

            {/* Отображение доступного диапазона (после применения других фильтров) */}
            <div className="flex justify-between text-xs text-gray-600">
                <button
                    onClick={handleResetMin}
                    className="cursor-pointer"
                    title="Вернуть к минимуму доступного диапазона"
                >
                    Min: €{minPrice}
                </button>
                <button
                    onClick={handleResetMax}
                    className="cursor-pointer"
                    title="Вернуть к максимуму доступного диапазона"
                >
                    Max: €{maxPrice}
                </button>

            </div>
        </div>
    )
}

export default PriceRangeSlider