import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Drawer,
  Input,
  Popconfirm,
  Space,
  Table,
  Select,
  Form,
} from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminUsers = () => {
  const [form] = useForm();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [open, setOpen] = useState(false);
  const [choosedUser, setChoosedUser] = useState("");

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["Admin-users-query"],
    queryFn: async () => {
      const res = await axios.get(
        "https://shopify-backend-vcnq.onrender.com/api/users"
      );
      return res.data;
    },
  });
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["Admin-user-query"],
    queryFn: async () => {
      const res = await axios.get(
        `https://shopify-backend-vcnq.onrender.com/api/users/${choosedUser}`
      );
      return res.data;
    },
  });

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        fullName: userData?.fullName,
        email: userData?.email,
        role: userData?.role,
      });
    }
  }, [userData]);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
  };

  const onFinish = (values) => {
    console.log(values);
  };

  const columns = [
    {
      title: "Ismi",
      dataIndex: "fullName",
      width: 111,
      fixed: "left",
      filters: usersData
        ? Array.from(new Set(usersData.map((user) => user.fullName))).map(
            (name) => ({
              text: name,
              value: name,
            })
          )
        : [],
      filteredValue: filteredInfo.fullName || null,
      onFilter: (value, record) => record.fullName === value,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 222,
    },
    {
      title: "Role",
      dataIndex: "role",
      width: 111,
      filters: [
        { text: "Admin", value: "admin" },
        { text: "User", value: "user" },
        { text: "Buyer", value: "buyer" },
      ],
      filteredValue: filteredInfo.role || null,
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Amallar",
      width: 111,
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setChoosedUser(record?._id);
              showDrawer();
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Foydalanuvchini o'chirasizmi?"
            onConfirm={() => deleteProduct(record._id)}
          >
            <Button danger onClick={() => {}}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={usersData}
        columns={columns}
        loading={isLoading}
        rowKey="_id"
        onChange={handleChange}
        bordered
        scroll={{ x: 1000, y: 90 * 5 }}
      />

      <Drawer
        title="Basic Drawer"
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button type="primary" onClick={() => form.submit()}>
              Yangilash
            </Button>
          </div>
        }
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={userData}
          onFinish={onFinish}
        >
          <Form.Item label="User full name" name="fullName">
            {userLoading ? (
              <Input placeholder="Loading..." />
            ) : (
              <Input disabled />
            )}
          </Form.Item>

          <Form.Item label="Email" name="email">
            {userLoading ? (
              <Input placeholder="Loading..." />
            ) : (
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item name="role">
            {userLoading ? (
              <Select defaultValue="Loading..." />
            ) : (
              <Select
                defaultValue={userData?.role}
                style={{ width: 120 }}
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "admin-assistant", label: "Admin Assistant" },
                  { value: "user", label: "User" },
                  { value: "buyer", label: "Buyer" },
                ]}
              />
            )}
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default AdminUsers;

{
  // import { useQuery } from "@tanstack/react-query";
  // import { Button, Popconfirm, Space, Table } from "antd";
  // import axios from "axios";
  // import { useState } from "react";
  // const AdminUsers = () => {
  //   const [filteredInfo, setFilteredInfo] = useState({});
  //   const [sortedInfo, setSortedInfo] = useState({});
  //   const { data: usersData, isLoading } = useQuery({
  //     queryKey: "Admin-users-query",
  //     queryFn: async () => {
  //       const res = await axios(
  //         "https://shopify-backend-vcnq.onrender.com/api/users"
  //       );
  //       return res.data;
  //     },
  //   });
  //   const handleChange = (pagination, filters, sorter) => {
  //     console.log(filters);
  //     console.log(sorter);
  //     setFilteredInfo(filters);
  //     setSortedInfo(sorter);
  //   };
  //   const clearFilters = () => {
  //     setFilteredInfo({});
  //   };
  //   const clearAll = () => {
  //     setFilteredInfo({});
  //     setSortedInfo({});
  //   };
  //   const setAgeSort = () => {
  //     setSortedInfo({
  //       order: "descend",
  //       columnKey: "age",
  //     });
  //   };
  //   const setRoleSort = () => {
  //     setSortedInfo({
  //       order: "ascend",
  //       columnKey: "role",
  //     });
  //   };
  //   const columns = [
  //     {
  //       title: "Ismi",
  //       dataIndex: "fullName",
  //     },
  //     {
  //       title: "Email",
  //       dataIndex: "email",
  //     },
  //     {
  //       title: "Role",
  //       dataIndex: "role",
  //       filters: [
  //         { text: "Admin", value: "Admin" },
  //         { text: "User", value: "User" },
  //         { text: "Buyer", value: "Buyer" },
  //       ],
  //       filteredValue: filteredInfo.role || null,
  //       onFilter: (value, record) => record.role === value,
  //       sorter: (a, b) => a.role.localeCompare(b.role),
  //       sortOrder: sortedInfo.columnKey === "role" && sortedInfo.order,
  //       columnKey: "role",
  //       //   filteredValue: filteredInfo.role || null,
  //       //   onFilter: (value, record) => record.role === value,
  //       //   sorter: (a, b) => a.role.length - b.role.length,
  //     },
  //     {
  //       title: "Amallar",
  //       render: (_, record) => (
  //         <Space>
  //           <Button onClick={() => openEditDrawer(record._id)}>Edit</Button>
  //           <Popconfirm
  //             title="Mahsulotni o'chirasizmi?"
  //             onConfirm={() => deleteProduct(record._id)}
  //           >
  //             <Button danger>Delete</Button>
  //           </Popconfirm>
  //         </Space>
  //       ),
  //     },
  //   ];
  //   return (
  //     <>
  //       <Space style={{ marginBottom: 16 }}>
  //         <Button onClick={setRoleSort}>Sort age</Button>
  //       </Space>
  //       <Table
  //         dataSource={usersData}
  //         columns={columns}
  //         loading={isLoading}
  //         rowKey="_id"
  //         onChange={handleChange}
  //         bordered
  //       />
  //     </>
  //   );
  // };
  // export default AdminUsers;
}
