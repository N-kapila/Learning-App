// routes
import { PATH_AUTH, PATH_DOCS, PATH_PAGE } from "../../routes/paths";
// components
import { PATH_AFTER_LOGIN } from "../../config";
// components
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const menuConfig = [
  {
    title: "Register",
    icon: <Iconify icon={"eva:home-fill"} {...ICON_SIZE} />,
    path: PATH_AUTH.registerUnprotected,
  },
  {
    title: "Login",
    icon: <Iconify icon={"eva:home-fill"} {...ICON_SIZE} />,
    path: PATH_AUTH.loginUnprotected,
  },
  {
    title: "Teacher Home",
    icon: <Iconify icon={"eva:home-fill"} {...ICON_SIZE} />,
    path: "/Teacher/teacher-home",
  },
  {
    title: "Student Home",
    icon: <Iconify icon={"eva:home-fill"} {...ICON_SIZE} />,
    path: "/Student/grades-home",
  },
  // {
  //   title: "Home",
  //   icon: <Iconify icon={"eva:home-fill"} {...ICON_SIZE} />,
  //   path: "/",
  // },
  // {
  //   title: "Components",
  //   icon: <Iconify icon={"ic:round-grain"} {...ICON_SIZE} />,
  //   path: PATH_PAGE.components,
  // },
  //{
  // title: "Pages",
  // path: "/pages",
  // icon: <Iconify icon={"eva:file-fill"} {...ICON_SIZE} />,
  // children: [
  // {
  //   subheader: "Other",
  //   items: [
  //     { title: "About us", path: PATH_PAGE.about },
  //     { title: "Contact us", path: PATH_PAGE.contact },
  //     { title: "FAQs", path: PATH_PAGE.faqs },
  //     { title: "Pricing", path: PATH_PAGE.pricing },
  //     { title: "Payment", path: PATH_PAGE.payment },
  //     { title: "Maintenance", path: PATH_PAGE.maintenance },
  //     { title: "Coming Soon", path: PATH_PAGE.comingSoon },
  //   ],
  // },
  // {
  //   subheader: "Authentication",
  //   items: [
  //     { title: "Login", path: PATH_AUTH.loginUnprotected },
  //     { title: "Register", path: PATH_AUTH.registerUnprotected },
  //     // { title: "Reset password", path: PATH_AUTH.resetPassword },
  //     // { title: "Verify code", path: PATH_AUTH.verify },
  //   ],
  // },
  // {
  // subheader: "Pages",
  // items: [
  // { title: "Page 403", path: PATH_PAGE.page403 },
  // { title: "Page 404", path: PATH_PAGE.page404 },
  // { title: "Page 500", path: PATH_PAGE.page500 },
  // { title: "Teacher Home", path: PATH_PAGE.teacherHome },
  // { title: "Create paper", path: PATH_PAGE.createPaper },
  // {
  //   title: "Questions Instructions",
  //   path: PATH_PAGE.questionInstrustions,
  // },
  //{ title: "Create new question", path: PATH_PAGE.createNewQuestion },
  // { title: "Result Sheet", path: PATH_PAGE.resultSheet },
  // { title: "Select Grades", path: PATH_PAGE.gradesHome },
  // { title: "Select Subjects", path: PATH_PAGE.viewSubjects },
  // { title: "Select Papers", path: PATH_PAGE.viewPapers },
  // { title: "View Instructions", path: PATH_PAGE.viewInstructions },
  // { title: "Answering paper", path: PATH_PAGE.doingPaper },
  // { title: "Side Navbar", path: PATH_PAGE.sideNavbar },
  // { title: "Navbars", path: PATH_PAGE.Nabvar },
  //{ title: "Question Number Add", path: PATH_PAGE.questionNumberAdd },
  // ],
  // },
  // {
  //   subheader: "Dashboard",
  //   items: [{ title: "Dashboard", path: PATH_AFTER_LOGIN }],
  // },
  // ],
  //},
  // {
  //   title: "Documentation",
  //   icon: <Iconify icon={"eva:book-open-fill"} {...ICON_SIZE} />,
  //   path: PATH_DOCS,
  // },
];

export default menuConfig;
