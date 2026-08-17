import hpLogo from "../assets/logo.webp";
import banner from "../assets/HP_Latex_Banner.jpg";

const HeaderV2 = () => (
  <header className="relative flex flex-col-reverse lg:flex-row bg-hpBlue text-white overflow-hidden animate-fadeUp">
    <div className="blob top-[-20%] left-[-10%]"></div>
    <div className="lg:w-1/2 w-full mx-auto flex flex-col justify-center items-center lg:items-start gap-4 py-16 lg:py-24 px-4 text-center z-10 relative">
      <div className="blob bottom-[-20%] right-[-20%]"></div>
      <div className="text-center lg:mr-auto mb-4 lg:pl-4">
        <img src={hpLogo} alt="HP logo" className="w-20" />
      </div>
      <h1 className="text-2xl sm:text-4xl md:text-5xl text-center lg:text-left font-extrabold lg:pl-4">
        HP Latex Buzz Challenge&nbsp;2025–2026
      </h1>
      <p className="text-lg md:text-xl text-center lg:text-left lg:pl-4">
        Showcase your passion for HP Latex. Participate. Win. Be recognized.
      </p>
    </div>
    <div className="hero-image h-[240px] sm:h-auto lg:w-1/2 w-full shrink-0">
      <img
        src={banner}
        className="w-full object-cover h-full block object-right"
        alt=""
      />
    </div>
  </header>
);

export default HeaderV2;
