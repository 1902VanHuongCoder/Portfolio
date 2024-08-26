// import { IoIosStar } from "react-icons/io";
import Certificate from "./partials/Certificate";

const testData = [{
    certificate: "https://marketplace.canva.com/EAFlVDzb7sA/1/0/1600w/canva-white-gold-elegant-modern-certificate-of-participation-bK_WEelNCjo.jpg",
    certificateContent: "Chứng chỉ tin học Quốc tế 2024 - 2025",
},
    {
        certificate: "https://cdn-ghkoj.nitrocdn.com/kjYfdEBKRwdYwvHQyjaYBdTGFpFGjqYW/assets/images/optimized/rev-39d8e95/sertifier.com/blog/wp-content/uploads/2020/10/certificate-text-samples.jpg",
        certificateContent: "Chứng chỉ Anh ngữ B1",

    },
    {
        certificate: "https://svg.template.creately.com/BVJzef5PKaw",
        certificateContent: "Chứng chỉ quậy banh chành KTX"
    }
]
const Certificates = () => {
  return (
    <div id="certificates" className="relative min-h-screen bg-[#2E236C] w-full px-4  pb-20">
      {/* <div className="absolute top-[-8px] left-0 w-full flex gap-x-2 justify-center text-white">
        <span> 
          <IoIosStar />
        </span>
        <span>
          <IoIosStar />
        </span>
        <span>
          <IoIosStar />
        </span>
      </div> */}
      <div className="flex items-center gap-x-2 pl-4">
        <span className="h-[50px] w-[6px] bg-[#C8ACD6]"></span>
        <p className="text-white text-2xl">Certificates</p>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {
                testData.map((item, index) => (
                    <Certificate key={index} certificate={item.certificate} certificateContent={item.certificateContent}/>
                ))
            }
      </div>
    </div>
  );
};

export default Certificates;
