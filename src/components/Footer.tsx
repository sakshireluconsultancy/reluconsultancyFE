import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-black py-10">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-2">
        <div className="text-white flex flex-col md:flex-row justify-center gap-2 md:gap-1  ">
          <p> 📧 For any enquiries or support please contact</p>
          <a href="mailto:moniykka.nathan@hp.com" className="underline">
            moniykka.nathan@hp.com
          </a>
        </div>
        <button
          onClick={() => navigate("/reluconsultancy/termsandconditions")}
          className="text-white text-sm "
        >
          Terms & conditions
        </button>
        <p className=" text-white text-sm">
          © 2025 HP Latex Buzz Challenge. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
