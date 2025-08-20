interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}



export default async function OrderPage({ params }: ProductPageProps)  {
    const id = (await params).id

    return (
        <div>
            {id}
        </div>
    );
}





