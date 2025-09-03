import {motion} from "framer-motion"; 
import { Blocks } from "react-loader-spinner";

const Loading = () => {
  return (
    <motion.div
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,.2)] flex justify-center items-center"
  >
    <Blocks
      height="80"
      width="80"
      color="#2E236C"
      ariaLabel="blocks-loading"
      wrapperStyle={{}}
      wrapperClass="blocks-wrapper"
      visible={true}
    />
  </motion.div>
  )
}

export default Loading