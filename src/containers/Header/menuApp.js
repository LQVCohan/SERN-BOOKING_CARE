export const adminMenu = [
  {
    //Quan ly nguoi dung
    name: "menu.admin.manage-user",
    menus: [
      {
        name: "menu.admin.crud",
        link: "/system/user-manage",
      },
      {
        name: "menu.admin.crud-redux",
        link: "/system/user-redux",
      },
      {
        name: "menu.admin.manage-doctor",
        link: "/system/manage-doctor",
        // subMenus: [
        //   {
        //     name: "menu.system.system-administrator.user-manage",
        //     link: "/system/user-manage",
        //   },
        //   {
        //     name: "menu.system.system-administrator.user-redux",
        //     link: "/system/user-redux",
        //   },
        // ],
      },
      {
        name: "menu.doctor.schedule",
        link: "/doctor/manage-schedule",
      },
    ],
  },
  {
    //Quan ly phong kham
    name: "menu.admin.clinic",
    menus: [
      {
        name: "menu.admin.manage-clinic",
        link: "/system/manage-clinic",
      },
    ],
  },
  {
    //Quan ly chuyen khoa
    name: "menu.admin.specialty",
    menus: [
      {
        name: "menu.admin.manage-specialty",
        link: "/system/manage-specialty",
      },
    ],
  },
  {
    //Quan ly cam nang
    name: "menu.admin.handbook",
    menus: [
      {
        name: "menu.admin.manage-handbook",
        link: "/system/manage-handbook",
      },
    ],
  },
];
export const doctorMenu = [
  {
    name: "menu.doctor.manage-patient",
    menus: [
      {
        //Quan ly kế hoạch khám bệnh

        name: "menu.doctor.manage-schedule",
        link: "/doctor/manage-schedule",
      },
      {
        //Quan ly bệnh nhân khám bệnh

        name: "menu.doctor.manage-patient",
        link: "/doctor/manage-patient",
      },
    ],
  },
  {
    name: "menu.doctor.manage-doctor-info",
    menus: [
      {
        //Quan ly thong tin ca nhan

        name: "menu.doctor.doctor-info",
        link: "/doctor/manage-doctor-info",
      },
      {
        //Quan ly bệnh nhân khám bệnh

        name: "menu.doctor.manage-patient",
        link: "/doctor/manage-patient",
      },
    ],
  },
];
