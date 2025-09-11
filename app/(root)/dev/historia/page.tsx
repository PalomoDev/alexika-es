import Image from "next/image";

const HistoriaPage = () => {
    return (
        <div className="main-wrapper mt-12 bg-white">
            {/* Header con título */}
            <div className="mx-auto px-6 py-8">


                {/* Placeholder para fotografía */}
                <div className="w-full aspect-video bg-gray-200 mb-8 relative">
                    <Image
                        src="/service/historia_2.png"
                        alt="alexika-historia-amazonka"
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>

                {/* Contenido del texto */}
                <div className="prose prose-lg max-w-4xl mx-auto mb-8">
                    <h1 className="text-xl pl-1 md:text-3xl font-bold text-gray-900 uppercase mb-8 ">
                        Historia de la marca

                    </h1>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        Nuestra historia comenzó en 1995, en Estados Unidos, cuando un grupo de apasionados viajeros y montañistas decidió transformar su experiencia en la montaña en equipos diseñados para acompañar a otros aventureros. Después de años recorriendo senderos, escalando picos y acampando bajo las estrellas, nos dimos cuenta de que existía una necesidad real: crear material que realmente funcionara en condiciones extremas. Desde el principio, la idea fue simple pero ambiciosa: crear material resistente, funcional y cómodo para quienes disfrutan del aire libre, sin importar si son principiantes o expertos.
                    </p>

                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        Durante nuestros primeros años, cada prototipo era probado meticulosamente por nuestro equipo fundador en expediciones reales. Las montañas de Colorado, los bosques de Oregon y los desiertos de Utah se convirtieron en nuestros laboratorios de pruebas naturales. Cada fallo del equipo era una lección, cada éxito una confirmación de que íbamos por el buen camino.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        A principios de los años 2000, tomamos una decisión estratégica que cambiaría nuestro futuro: trasladamos nuestra sede principal a Europa. Este movimiento marcó un nuevo capítulo en nuestro crecimiento y nos permitió no solo expandirnos geográficamente, sino también enriquecer nuestra perspectiva cultural sobre el outdoor. Europa, con su diversidad de paisajes y tradiciones montañeras, nos ofreció nuevos desafíos y oportunidades de innovación. Gracias a esta evolución estratégica, hoy en día nuestros productos se venden en numerosos países europeos y en diferentes partes del mundo, desde los Alpes hasta los Andes, desde Escandinavia hasta Nueva Zelanda.                    </p>

                    <p className="text-lg leading-relaxed text-gray-700">
                        Con el paso del tiempo y más de dos décadas de experiencia, nuestra filosofía fundamental no ha cambiado: probamos y mejoramos cada detalle de nuestro equipo en condiciones reales de viaje. Nuestros diseñadores y ingenieros siguen siendo viajeros activos que entienden las necesidades del terreno. Al mismo tiempo, nuestro equipo de I+D sigue de cerca las nuevas tecnologías y materiales, incorporándolas inteligentemente en nuestras colecciones para garantizar innovación constante, durabilidad excepcional y comodidad superior.
                    </p>

                    <p className="text-lg leading-relaxed text-gray-700">
                        Miramos hacia el futuro con entusiasmo renovado: queremos seguir ampliando nuestras líneas de equipamiento para viajes y excursiones, desarrollando soluciones más sostenibles y tecnológicamente avanzadas. Nuestro objetivo es inspirar a más personas a descubrir la naturaleza con confianza y libertad, sabiendo que cuentan con el equipo adecuado para vivir sus propias aventuras inolvidables.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HistoriaPage;