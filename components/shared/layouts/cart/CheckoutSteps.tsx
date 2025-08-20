import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface CheckoutStepsProps {
    currentStep: number;
    onStepClick: (step: number) => void;
}

const steps = [
    { id: 1, name: 'Carrito', description: 'Revisar productos' },
    { id: 2, name: 'Entrega', description: 'Dirección y envío' },
    { id: 3, name: 'Pago', description: 'Método de pago' },
    { id: 4, name: 'Confirmación', description: 'Revisar pedido' }
];

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
                                                                currentStep,
                                                                onStepClick
                                                            }) => {
    const handleStepClick = (stepId: number) => {
        // Разрешаем переход только на текущий или предыдущие шаги
        if (stepId <= currentStep) {
            onStepClick(stepId);
        }
    };

    const getStepStatus = (stepId: number) => {
        if (stepId < currentStep) return 'completed';
        if (stepId === currentStep) return 'current';
        return 'upcoming';
    };

    const getStepClasses = (stepId: number) => {
        const status = getStepStatus(stepId);
        const baseClasses = 'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors';

        switch (status) {
            case 'completed':
                return `${baseClasses} bg-brand-hover text-white`;
            case 'current':
                return `${baseClasses} bg-brand text-white`;
            case 'upcoming':
                return `${baseClasses} bg-brand-muted text-white`;
            default:
                return baseClasses;
        }
    };

    const getTextClasses = (stepId: number) => {
        const status = getStepStatus(stepId);

        switch (status) {
            case 'completed':
                return 'text-gray-700 font-medium';
            case 'current':
                return 'text-gray-700';
            case 'upcoming':
                return 'text-gray-500';
            default:
                return '';
        }
    };

    const isClickable = (stepId: number) => stepId <= currentStep;

    return (
        <div className="w-full bg-white border-b border-gray-200 py-4">
            <div className="max-w-full mx-auto px-4 flex justify-center">
                <nav aria-label="Progreso del checkout ">
                    <ol className="flex items-center justify-center">
                        {steps.map((step, index) => (
                            <li key={step.id} className="flex items-center">
                                <div
                                    className={`flex flex-col items-center cursor-pointer group ${
                                        isClickable(step.id) ? 'hover:opacity-80' : 'cursor-not-allowed'
                                    }`}
                                    onClick={() => handleStepClick(step.id)}
                                >
                                    <div className="flex items-center">
                                        <div className={getStepClasses(step.id)}>
                                            {getStepStatus(step.id) === 'completed' ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                step.id
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <p className={`text-sm font-medium ${getTextClasses(step.id)}`}>
                                            {step.name}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Разделитель между шагами */}
                                {index < steps.length - 1 && (
                                    <div className="w-24 mx-4 mt-[-20px]">
                                        <div className="h-0.5 bg-gray-200 relative">
                                            <div
                                                className={`h-0.5 transition-all duration-300 ${
                                                    step.id < currentStep ? 'bg-green-600' : 'bg-gray-200'
                                                }`}
                                                style={{
                                                    width: step.id < currentStep ? '100%' : '0%'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
        </div>
    );
};