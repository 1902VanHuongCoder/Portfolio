import { useContext, useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Gapcursor from "@tiptap/extension-gapcursor";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";
import { formatVND } from "../../lib/formatVND";
import { MdMenu } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import { SideBarBlogListContext } from "../../contexts/SideBarBlogListContext";
import AdminLoading from "../partials/AdminLoading";
import { GrProjects } from "react-icons/gr";

const ViewSourceDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // State to manage host's personal info
  const [personalInfo, setPersonalInfo] = useState({});

  const { setShow } = useContext(SideBarBlogListContext);

  const handleCloseSideBarBlogList = () => {
    setShow(true);
  };

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      const docRef = doc(db, "sourceProjects", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList,
      ListItem,
      Paragraph,
      Text,
      TaskList,
      TaskItem.configure({ nested: true }),
      HorizontalRule,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Gapcursor,
    ],
    content: "",
  });

  useEffect(() => {
    if (editor && project) {
      editor.commands.setContent(project.content || "");
    }
  }, [editor, project]);

  // Fetch personal information to show in the form
  useEffect(() => {
    const fetchPersonalInfo = async () => {
      const docRef = doc(db, "personalInfo", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPersonalInfo(docSnap.data());
      }
    };
    fetchPersonalInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0]">
        <AdminLoading />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0]">
        <span className="text-white text-xl font-bold mb-4">
          Source code not found.
        </span>
        <Link
          to="/exchange-source-code"
          className="text-[#33A1E0] underline font-bold"
        >
          Back to Source List
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0]">
      <div className="flex justify-between items-center px-4 sm:px-10 py-4 bg-white/10 backdrop-blur-md shadow-lg border-b border-[#33A1E0]/30">
        <div className="flex gap-2 items-center justify-between w-full">
          <p className="text-2xl text-white font-bold hidden sm:block drop-shadow">
            Paul To - <span>Challenge is an opportunity</span>
          </p>
          <div className="flex gap-x-4">
            <div className="flex gap-2 items-center">
              <Link
                to="/"
                className="bg-[#33A1E0]/10 text-white px-4 py-2 gap-x-2 rounded-md flex justify-center items-center border border-[#33A1E0]/40 shadow hover:bg-[#33A1E0]/30 transition"
              >
                <span className="text-2xl lg:text-sm">
                  <IoHome />
                </span>
                <span className="hidden lg:block">Homepage</span>
              </Link>
            </div>
            <div className="flex gap-2 items-center">
              <Link
                to="/exchange-source-code"
                className="bg-[#33A1E0]/10 text-white px-4 py-2 gap-x-2 rounded-md flex justify-center items-center border border-[#33A1E0]/40 shadow hover:bg-[#33A1E0]/30 transition"
              > <span className="text-2xl lg:text-sm">
                  <GrProjects />
                </span>
                <span className="hidden lg:block">Projects</span>
               
              </Link>
            </div>
          </div>
        </div>
        <p
          onClick={handleCloseSideBarBlogList}
          className="block sm:hidden text-4xl text-white rounded-full hover:bg-[#33A1E0]/20 p-1 transition-all cursor-pointer"
        >
          <MdMenu />
        </p>
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-6">
          {project.images && project.images.length > 0 && (
            <div className="w-full h-[200px] object-cover relative rounded-xl overflow-hidden">
              <img
                key="imagetitle"
                src={project.images[0].secure_url}
                alt={project.title}
                className="w-full h-full object-cover rounded shadow "
              />
              <div className="absolute top-0 left-0 w-full h-full bg-black/50 rounded flex justify-center items-center">
                <p className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg">
                  VIEW PROJECT DETAILS
                </p>
              </div>
              {/* <div className="absolute inset-0 bg-black/30 rounded shadow grid grid-cols-1 md:grid-cols-2 items-center px-4">
                <div className="flex justify-center items-center">
                  {project.youtube && (
                    <div>
                      <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: project.youtube }}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <p className="text-white">Contact Information</p>
                  <p className="flex items-center gap-x-2 text-slate-600 bg-white rounded-full px-4 py-2">
                    <span className="text-gray-500 text-xl">
                      <MdOutlineMailOutline />
                    </span>{" "}
                    <span>tovanhuong007@gmail.com</span>
                  </p>
                  <p className="flex items-center gap-x-2 text-slate-600 bg-white rounded-full px-4 py-2">
                    <span className="text-gray-500">
                      <FaPhoneAlt />
                    </span>
                    <span>0334745377</span>
                  </p>
                  <p className="flex items-center gap-x-2 text-slate-600 bg-white rounded-full px-4 py-2">
                    <span className="text-[#3b5998]">
                      <FaFacebook />
                    </span>
                    <span>https://www.facebook.com/vanhuong.to.71</span>
                  </p>
                </div>
              </div> */}
            </div>
          )}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {project.title}
              </h1>
              <h2 className="text-lg text-white/70 mb-2">{project.subtitle}</h2>
              <div className="text-[#05f7c0] mb-2">
                <span className="font-semibold">Price: </span>
                {project.price ? formatVND(project.price) : "Contact for price"}
                <div className="flex gap-4 mt-6 flex-wrap">
                  <span className="bg-white/20 px-4 py-2 rounded-full text-white">
                    {personalInfo?.name}
                  </span>
                  <span className="bg-white/20 px-4 py-2 rounded-full text-white">
                    {personalInfo?.email}
                  </span>
                  <span className="bg-white/20 px-4 py-2 rounded-full text-white">
                    {personalInfo?.phone}
                  </span>
                  <span className="bg-white/20 px-4 py-2 rounded-full text-white">
                    {personalInfo?.facebook}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-[#33A1E0]/20 pt-4">
              <p className="text-white mb-2">Mô Tả Chi Tiết</p>
              <div className="prose max-w-none rounded p-4">
                {editor && (
                  <EditorContent
                    editor={editor}
                    className="tiptap-content min-h-[300px] focus:outline-none rounded-br-md rounded-bl-md focus:border-none text-white"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSourceDetail;
