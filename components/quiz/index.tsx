import Image from "next/image";

const Quiz: React.FC = () => {
  return (
    <div className="min-h-screen px-12 max-md:px-5 md:py-10 py-8 md:pt-30 pt-16 overflow-hidden relative">
      {/* <Image
        width={1980}
        height={1024}
        src="/bg/bg-2.webp"
        alt="background dark blue image"
        className="absolute inset-0 object-cover w-full h-full z-0 object-center"
      /> */}
      <h2 className="text-6xl">Quiz</h2>
    </div>
  );
};

export default Quiz;
