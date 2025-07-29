import AnimatedText from "./ui/animated-text";

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col gap-8 items-center justify-center text-4xl p-10">
      <AnimatedText>
        <p className="uppercase  md:text-base text-sm text-center mb-4">
          Courageous explorer, plunge into a realm of divine power and shadowed
          secrets, where empires rise and fall in a clash of fate and fury.
          <br />
          Ready to unravel the mystery?
        </p>
      </AnimatedText>
      <h2 className="font-alegreya">This is test only</h2>
      <h2 className="font-cardo">This is test only</h2>
      <h2 className="font-cinzel">This is test only</h2>
      <h2 className="font-medievalsharp">This is test only</h2>
      <h2 className="font-montserrat">This is test only</h2>
      <h2 className="font-imfellenglish">This is test only</h2>
      <h2 className="font-alegreya">This is test only</h2>
      <h2 className="font-cinzeldecorative">This is test only</h2>
    </div>
  );
};

export default About;
