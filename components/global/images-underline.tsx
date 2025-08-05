import Image from "next/image";

const ImagesUnderline: React.FC = () => {
  return (
    <div className="absolute pointer-events-none w-full h-full">
      <div className="w-full h-full absolute -z-1">
        <Image
          width={1980}
          height={1024}
          src="/bg/bg-1.webp"
          alt="background dark blue image"
          className="block w-screen h-auto min-h-svh object-cover object-center"
        />
        <Image
          width={1980}
          height={1024}
          src="/bg/bg-8.webp"
          alt="background dark blue image"
          className="block w-screen h-auto md:min-h-svh  object-cover object-center rotate-180"
        />
        <Image
          width={1980}
          height={1024}
          src="/bg/bg-2.webp"
          alt="background dark blue image"
          className="block w-screen h-auto min-h-svh  object-cover object-center rotate-180"
        />
        <Image
          width={1980}
          height={1024}
          src="/bg/bg-3.webp"
          alt="background dark blue image"
          className="block w-screen h-auto min-h-svh object-cover object-center "
        />
        <Image
          width={1980}
          height={1024}
          src="/bg/bg-3.webp"
          alt="background dark blue image"
          className="block w-screen h-auto min-h-svh object-cover object-center rotate-180"
        />

        <Image
          width={1980}
          height={1024}
          src="/bg/bg-3.webp"
          alt="background dark blue image"
          className="block w-screen h-auto  object-cover object-center"
        />
        <Image
          width={1980}
          height={1024}
          src="/bg/bg-3.webp"
          alt="background dark blue image"
          className="block w-screen h-auto min-h-svh object-cover object-center rotate-180"
        />
      </div>
    </div>
  );
};

export default ImagesUnderline;
