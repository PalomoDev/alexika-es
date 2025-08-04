
import Carousel from "@/components/shared/carousel";
import {homeSlides} from "@/db/data";

export default function HomePage() {
  return (
      <div className="">
          <Carousel data={homeSlides}/>
      </div>
  )
}