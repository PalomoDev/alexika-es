import Image from "next/image";

const SobrePage = () => {
    return (
        <div className="main-wrapper mt-12 bg-white">
            {/* Header con título */}
            <div className="mx-auto px-6 py-8">


                {/* Placeholder para fotografía */}
                <div className="w-full aspect-video bg-gray-200 mb-8 relative">
                    <Image
                        src="/service/sobre.png"
                        alt="sobre-alexika-norvegia"
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>

                {/* Contenido del texto */}
                <div className="prose prose-lg max-w-4xl mx-auto mb-8">
                    <h1 className="text-xl pl-1 md:text-3xl font-bold text-gray-900 uppercase mb-8 ">
                        Sobre nosotros


                    </h1>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        Somos un equipo de personas que aman la montaña y el camino. Nuestra marca nació de los viajes y de las noches bajo las estrellas. Nosotros mismos recorremos senderos, levantamos tiendas en las cumbres y sabemos lo importante que es contar con un equipo confiable.
                    </p>

                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        En nuestra colección encontrarás todo lo necesario para disfrutar de la naturaleza: tiendas de campaña, sacos de dormir, esterillas y otros equipos para el senderismo. Cada producto está diseñado pensando en la comodidad y la seguridad, porque lo probamos en nuestras propias aventuras.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        Para nosotros no se trata solo de vender equipo, sino de compartir el amor por la libertad, los espacios abiertos y el aire puro. Queremos que cada persona que elija nuestro material sienta la misma alegría del camino que sentimos nosotros.
                    </p>


                </div>
            </div>
        </div>
    )
}

export default SobrePage;