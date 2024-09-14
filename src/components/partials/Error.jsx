import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Error = ({ error }) => {
  return (
    <div className="w-full h-screen bg-[rgb(46,35,108)] flex justify-center items-center flex-col gap-y-3 text-white">
      <div className="text-center mb-8">
        <p className="text-[100px]">Uh-Oh</p>
        <p className="text-slate-300 text-xl">{error}</p>
      </div>
      <Link
        to="/"
        className="bg-white px-8 py-3 text-[#2E236C] font-bold uppercase"
      >
        Home
      </Link>
    </div>
  );
};

Error.propTypes = {
  error: PropTypes.string.isRequired,
};

export default Error;
