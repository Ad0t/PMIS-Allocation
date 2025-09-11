import React from 'react';
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRightCircle, Camera, Video } from 'lucide-react';

const photos = [
  { src: 'https://placehold.co/600x400/orange/white?text=Intern+1', alt: 'Intern working on machinery' },
  { src: 'https://placehold.co/600x400/orange/white?text=Intern+2', alt: 'Intern in a discussion' },
  { src: 'https://placehold.co/600x400/orange/white?text=Intern+3', alt: 'Intern at a desk' },
];

const videos = [
  { src: 'https://placehold.co/600x400/000000/ffffff?text=Video+1', alt: 'Video of an intern' },
  { src: 'https://placehold.co/600x400/000000/ffffff?text=Video+2', alt: 'Video of a workshop' },
  { src: 'https://placehold.co/600x400/000000/ffffff?text=Video+3', alt: 'Corporate video' },
];

const GallerySection: React.FC = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  return (
    <div className="my-12">
      <div className="flex items-center justify-center mb-8">
        <span className="h-0.5 w-32 bg-orange-500"></span>
        <h2 className="text-4xl font-bold text-gray-800 px-8 whitespace-nowrap">Gallery</h2>
        <span className="h-0.5 w-32 bg-orange-500"></span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Photos Section */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Dialog>
              <Carousel plugins={[plugin.current]} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
                <CarouselContent>
                  {photos.map((photo, index) => (
                    <CarouselItem key={index}>
                      <DialogTrigger asChild onClick={() => setSelectedImage(photo.src)}>
                        <img src={photo.src} alt={photo.alt} className="w-full h-70 object-cover cursor-pointer" />
                      </DialogTrigger>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <DialogContent className="sm:max-w-[600px]">
                   {selectedImage && <img src={selectedImage} alt="Selected" className="w-full h-auto object-cover rounded-md" />}
                </DialogContent>
              </Carousel>
            </Dialog>
          </CardContent>
          <CardFooter className="bg-gray-50 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <Camera className="h-5 w-5" />
              <span>Photos</span>
            </div>
            <a href="#" className="text-orange-600 hover:text-orange-700">
              <ArrowRightCircle className="h-6 w-6" />
            </a>
          </CardFooter>
        </Card>

        {/* Videos Section */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Carousel plugins={[plugin.current]} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
              <CarouselContent>
                {videos.map((video, index) => (
                  <CarouselItem key={index} className="relative">
                    <img src={video.src} alt={video.alt} className="w-full h-70 object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <PlayCircle className="h-16 w-16 text-white opacity-80" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </CardContent>
          <CardFooter className="bg-gray-50 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <Video className="h-5 w-5" />
              <span>Videos</span>
            </div>
            <a href="#" className="text-orange-600 hover:text-orange-700">
              <ArrowRightCircle className="h-6 w-6" />
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

const PlayCircle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
    </svg>
);

export default GallerySection;