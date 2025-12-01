// Sidebar.js
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  ReloadOutlined,
  UserOutlined,
  BarChartOutlined,
  RiseOutlined,
  WalletOutlined,
  
} from "@ant-design/icons";
import { NavLink, useLocation } from "react-router-dom";

const { Sider } = Layout;

export default function Sidebar() {
  const location = useLocation();
     
  const menuItems = [
    { key: "/dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    { key: "/purchase-contract", label: "Purchase Contract", icon: <FileTextOutlined /> },
    { key: "/purchase-order", label: "Purchase Order", icon: <ShoppingCartOutlined /> },
    { key: "/rise-dispute", label: "Raise Dispute", icon: <ReloadOutlined /> },
  { key: "/deliverey-status", label: "Deliverey Status", icon: <FileTextOutlined /> },
    { key: "/profile-settings", label: "Profile Settings", icon: <UserOutlined /> },
    { key: "/reports", label: "Reports", icon: <BarChartOutlined /> },
    { key: "/transactions", label: "Transactions", icon: <FileTextOutlined /> },
  ];

  return (
    <Sider
      width={252}
      className="bg-white! py-1!  "
    >
       <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
       
      >
        {menuItems.map((item) => (
          <Menu.Item key={item.key} icon={item.icon} className="text-amber-500!" >
            <NavLink to={item.key} className="no-underline! text-amber-800! w-full!">
              {item.label}
            </NavLink>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
      

    
      
  );
}
