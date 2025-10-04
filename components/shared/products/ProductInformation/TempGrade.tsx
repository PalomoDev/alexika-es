export type Temperature = {
    comfortable: string
    comfortLimit: string
    extreme: string
}
type TempComponentsProps = {
    temperature: Temperature
}





const TempGrade = ({ temperature }: TempComponentsProps) => {

    return (
        <div className={'w-full flex flex-col gap-2 cursor-help'}>

            <div className="group">
                <div className="bg-[url('/svg/temp_grade.svg')] bg-contain bg-no-repeat w-[390px] h-10 flex items-center font-mono ">
                    <div className={'w-full text-white font-bold text-xl flex'}>
                        <div className="w-[150px] text-center pl-2">{temperature.comfortable}°C</div>
                        <div className="ml-8">{temperature.comfortLimit}°C</div>
                        <div className="ml-14">{temperature.extreme}°C</div>
                    </div>
                </div>
                <div className="w-[390px] flex justify-start mt-2">
                    <div className="text-xs text-center ">Comfortable Temperature</div>
                    <div className="text-xs text-center ">Comfort Limit Temperature</div>
                    <div className="text-xs text-center -ml-2">Extreme Temperature</div>
                </div>
                <div className="w-86  text-xs text-white bg-gray-500 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none max-h-0 group-hover:max-h-20 overflow-hidden">
                    Todos los sacos de dormir Alexika están certificados según la norma europea EN 13537.
                </div>
            </div>
        </div>
    );
};

export default TempGrade;