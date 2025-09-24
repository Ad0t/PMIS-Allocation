import React from 'react';
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRightCircle, Camera, Video } from 'lucide-react';
import v1 from '@/assets/1.mp4';
import v2 from '@/assets/2.mp4';
import v3 from '@/assets/3.mp4';
import i4 from '@/assets/5.png';
import i5 from '@/assets/6.png';
import i6 from '@/assets/7.png';  
import { AspectRatio } from "@/components/ui/aspect-ratio";

const photos = [
  { src: i4 as string, alt: 'Intern working on machinery' },
  { src: i5 as string, alt: 'Intern in a discussion' },
  { src: i6 as string, alt: 'Intern at a desk' },
];

const videos = [
  { src: v1 as string, alt: 'Video of an intern' },
  { src: v2 as string, alt: 'Video of a workshop'},
  { src: v3 as string, alt: 'Corporate video'},
];

const GallerySection: React.FC = () => {
  const photosAutoplay = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: true })
  );
  const videosAutoplay = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  return (
    <div className="my-12">
      <div className="flex items-center justify-center mb-8">
        <span className="h-0.5 w-32 bg-orange-500"></span>
        <h2 className="text-4xl font-bold text-foreground px-8 whitespace-nowrap">Gallery</h2>
        <span className="h-0.5 w-32 bg-orange-500"></span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Photos Section */}
        <Card className="overflow-hidden">
          <CardContent className="p-0 h-full">
            <Dialog>
              <Carousel opts={{ loop: true }} plugins={[photosAutoplay.current]} onMouseEnter={photosAutoplay.current.stop} onMouseLeave={photosAutoplay.current.reset}>
                <CarouselContent>
                  {photos.map((photo, index) => (
                    <CarouselItem key={index}>
                      <DialogTrigger asChild onClick={() => setSelectedImage(photo.src)}>
                        <AspectRatio ratio={16/9}>
                          <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover cursor-pointer" />
                        </AspectRatio>
                      </DialogTrigger>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                  <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 z-20 pointer-events-auto bg-white/90 shadow-md hover:bg-white" />
                  <CarouselNext className="right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-auto bg-white/90 shadow-md hover:bg-white" />
                <DialogContent className="sm:max-w-[600px]">
                  {selectedImage && (
                    <img src={selectedImage} alt="Selected" className="w-full h-auto object-cover rounded-md" />
                  )}
                </DialogContent>
              </Carousel>
            </Dialog>
          </CardContent>
          <CardFooter className="bg-card border-t p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <Camera className="h-5 w-5" />
              <span>Photos</span>
            </div>
            {/* Removed extra bottom-right arrow */}
          </CardFooter>
        </Card>

        {/* Videos Section */}
        <Card className="overflow-hidden">
          <CardContent className="p-0 h-full">
            <Carousel opts={{ loop: true }} plugins={[videosAutoplay.current]} onMouseEnter={videosAutoplay.current.stop} onMouseLeave={videosAutoplay.current.reset}>
              <CarouselContent>
                {videos.map((video, index) => (
                  <CarouselItem key={index} className="relative">
                    <AspectRatio ratio={16/9}>
                      <video
                        src={video.src}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover pointer-events-none"
                        ref={(el) => {
                          if (el) {
                            const tryPlay = () => {
                              const p = el.play();
                              if (p && typeof p.catch === 'function') {
                                p.catch(() => {
                                  // ignore autoplay errors; browser may still start once ready
                                });
                              }
                            };
                            if (el.readyState >= 2) tryPlay();
                            else {
                              el.addEventListener('loadeddata', tryPlay, { once: true });
                              el.addEventListener('canplay', tryPlay, { once: true });
                            }
                          }
                        }}
                      />
                    </AspectRatio>
                  </CarouselItem>
                ))}
              </CarouselContent>
                  <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 z-20 pointer-events-auto bg-white/90 shadow-md hover:bg-white" />
                  <CarouselNext className="right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-auto bg-white/90 shadow-md hover:bg-white" />
            </Carousel>
          </CardContent>
          <CardFooter className="bg-card border-t p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <Video className="h-5 w-5" />
              <span>Videos</span>
            </div>
            {/* Removed extra bottom-right arrow */}
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