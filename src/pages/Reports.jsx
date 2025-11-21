// Reports.js
import React from "react";
import { Card, Button, Tabs, Select, Table, Tag } from "antd";
import {
  DollarOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  TeamOutlined,
  DownloadOutlined,
  LineChartOutlined,
  BarChartOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Option } = Select;

// ===================== JSON DATA =====================
const reportsData = {
  kpiCards: [
    {
      title: "Total Revenue",
      value: "₹18,45,280",
      growth: "+24.1% from last month",
      icon: <DollarOutlined className="text-xl! text-amber-500!" />,
      borderColor: "border-amber-300",
      textColor: "text-amber-600",
    },
    {
      title: "Total Orders",
      value: "167",
      growth: "+28% from last month",
      icon: <ShoppingOutlined className="text-xl! text-amber-500!" />,
      borderColor: "border-amber-300",
      textColor: "text-amber-600",
    },
    {
      title: "Active Contracts",
      value: "42",
      growth: "+18% from last month",
      icon: <FileTextOutlined className="text-xl! text-amber-500!" />,
      borderColor: "border-amber-300",
      textColor: "text-amber-600",
    },
    {
      title: "Customer Growth",
      value: "+22%",
      growth: "New customers in Odisha",
      icon: <TeamOutlined className="text-xl! text-amber-500!" />,
      borderColor: "border-amber-300",
      textColor: "text-amber-600",
    },
  ],

  salesReports: [
    {
      title: "Monthly Sales Report - January 2024",
      subtitle: "Sales • 125 records • Generated 2024-02-01",
      size: "2.4 MB",
      icon: <FileTextOutlined className="text-amber-500! text-xl! mr-2! mt-3!" />,
    },
    {
      title: "Quarterly Revenue Analysis - Q4 2023",
      subtitle: "Revenue • 487 records • Generated 2024-01-15",
      size: "5.1 MB",
      icon: <BarChartOutlined className="text-amber-500! text-xl! mr-2! mt-3!" />,
    },
    {
      title: "Weekly Sales Performance",
      subtitle: "Performance • 89 records • Generated 2024-01-22",
      size: "1.8 MB",
      icon: <LineChartOutlined className="text-amber-500! text-xl! mr-2! mt-3!" />,
    },
  ],

  contractReports: [
    {
      title: "Active Contracts Summary",
      subtitle: "Contracts • 76 records • Generated 2024-01-20",
      size: "3.2 MB",
      icon: <SolutionOutlined className="text-amber-500! text-xl! mr-2! mt-3!" />,
    },
    {
      title: "Contract Renewal Schedule",
      subtitle: "Renewals • 23 records • Generated 2024-01-18",
      size: "1.5 MB",
      icon: <FileTextOutlined className="text-amber-500! text-xl! mr-2! mt-3!" />,
    },
    {
      title: "Expired Contracts Overview",
      subtitle: "Expired • 12 records • Generated 2024-01-10",
      size: "850 KB",
      icon: <FileTextOutlined className="text-amber-500! text-xl! mr-2! mt-3!" />,
    },
  ],

  analyticsTable: {
    columns: [
      { title: "Period", dataIndex: "period", key: "period" },
      { title: "Revenue", dataIndex: "revenue", key: "revenue" },
      { title: "Orders", dataIndex: "orders", key: "orders" },
      { title: "Contracts", dataIndex: "contracts", key: "contracts" },
      { title: "Returns", dataIndex: "returns", key: "returns" },
      {
        title: "Growth",
        dataIndex: "growth",
        key: "growth",
        render: (growth) => (
          <Tag color="green" className="px-2 py-1 rounded-md">
            {growth}
          </Tag>
        ),
      },
    ],
    data: [
      {
        key: "1",
        period: "January 2024",
        revenue: "₹8,45,280",
        orders: 167,
        contracts: 42,
        returns: 12,
        growth: "+12%",
      },
      {
        key: "2",
        period: "February 2024",
        revenue: "₹10,00,500",
        orders: 192,
        contracts: 47,
        returns: 15,
        growth: "+18%",
      },
      {
        key: "3",
        period: "March 2024",
        revenue: "₹9,72,340",
        orders: 175,
        contracts: 44,
        returns: 10,
        growth: "+9%",
      },
    ],
  },
};

// ===================== COMPONENT =====================
export default function Reports() {
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-0">
        <div>
          <h1 className="text-3xl font-bold text-amber-700">Reports</h1>
          <p className="text-amber-500">
            View and download business reports and analytics
          </p>
        </div>
        <div className="flex! items-center! space-x-3! ">
          <Select
            defaultValue="This Month"
            className="w-40! border-amber-400! focus:border-amber-500! focus:ring-amber-300! text-amber-700!"
          >
            <Option value="thisMonth">This Month</Option>
            <Option value="lastMonth">Last Month</Option>
            <Option value="quarter">This Quarter</Option>
          </Select>
          <Button className="bg-amber-500! border-amber-500! hover:bg-amber-600! text-white!">
            Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {reportsData.kpiCards.map((card, index) => (
          <Card
            key={index}
            className={`border-2! ${card.borderColor}! rounded-lg! h-36! shadow-sm!`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-amber-700">{card.title}</p>
                <h2 className="text-lg font-bold text-amber-700">{card.value}</h2>
                <p className={`${card.textColor} text-xs`}>{card.growth}</p>
              </div>
              {card.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs Section */}
      <Tabs
        defaultActiveKey="1"
        className="text-amber-700"
        tabBarGutter={10}
        tabBarStyle={{ color: "#b45309" }}
      >
        {/* Available Reports */}
        <TabPane tab={<span className="text-amber-700 font-semibold">Available Reports</span>} key="1">
          {/* Sales Reports */}
          <div className="mb-6">
            <h2 className="font-semibold text-base text-amber-700 mb-1">Sales Reports</h2>
            <p className="text-amber-600 text-sm">
              Download and view sales performance reports
            </p>

            <div className="space-y-2">
              {reportsData.salesReports.map((report, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white pt-2 rounded-md "
                >
                  <div className="flex items-start pl-3">
                    {report.icon}
                    <div>
                      <h3 className="font-medium text-sm text-amber-700 pl-2">{report.title}</h3>
                      <p className="text-amber-600 text-xs pl-2">{report.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pr-3">
                    <span className="text-green-600 bg-green-100 rounded-full px-2 py-0.5 text-xs font-medium">
                      Completed
                    </span>
                    <span className="text-amber-700 text-xs">{report.size}</span>
                    <Button
                      size="small"
                      icon={<DownloadOutlined />}
                      className="flex items-center! bg-amber-500! border-amber-500! hover:bg-amber-600! text-white!"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contract Reports */}
          <div>
            <h2 className="font-semibold text-base text-amber-700 mb-1">Contract Reports</h2>
            <p className="text-amber-600 text-sm mb-3">
              Contract analysis and management reports
            </p>

            <div className="space-y-2">
              {reportsData.contractReports.map((report, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white pt-2 rounded-md "
                >
                  <div className="flex items-start pl-3">
                    {report.icon}
                    <div>
                      <h3 className="font-medium text-sm text-amber-700 pl-2">{report.title}</h3>
                      <p className="text-amber-600 text-xs pl-2">{report.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pr-3">
                    <span className="text-green-600 bg-green-100 rounded-full px-2 py-0.5 text-xs font-medium">
                      Completed
                    </span>
                    <span className="text-amber-700 text-xs">{report.size}</span>
                    <Button
                      size="small"
                      icon={<DownloadOutlined  />}
                      className="flex items-center! bg-amber-500! border-amber-500! hover:bg-amber-600! text-white!"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabPane>

        {/* Analytics Overview */}
        <TabPane tab={<span className="text-amber-700 font-semibold">Analytics Overview</span>} key="2">
          <Card>
            <h2 className="font-semibold text-base flex items-center gap-2 mb-1 text-amber-700">
              <LineChartOutlined /> Financial Overview
            </h2>
            <p className="text-amber-600 text-sm mb-3">
              Monthly performance metrics and trends
            </p>
            <Table
              columns={reportsData.analyticsTable.columns.map((col) => ({
                ...col,
                title: <span className="text-amber-700">{col.title}</span>,
                render: col.render
                  ? col.render
                  : (text) => <span className="text-amber-700">{text}</span>,
              }))}
              dataSource={reportsData.analyticsTable.data}
              pagination={false}
              bordered={false}
              size="small"
              className="text-amber-700"
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}
