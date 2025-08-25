import paultoavatar1 from "../assets/paultoavatar1.jpg";

const images = [
  paultoavatar1,
  "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
];

const Marquee = () => {
  return (
    <div className="w-full overflow-hidden py-6 bg-white/60">
      <div className="flex animate-marquee whitespace-nowrap gap-8">
        {images.concat(images).map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`personal-${idx}`}
            className="h-48 w-48 object-cover rounded-xl shadow-lg border-2 border-[#33A1E0] bg-white/80 mx-2"
          />
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        }
      `}</style>
    </div>
  );
};

export default Marquee;
