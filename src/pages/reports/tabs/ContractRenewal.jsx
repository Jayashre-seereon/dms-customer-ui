import React, { useMemo, useState } from "react";
import { Table, DatePicker, Row, Col, Card, Tag,Button } from "antd";
import dayjs from "dayjs";
import { FilterOutlined } from "@ant-design/icons";
const { MonthPicker } = DatePicker;

/* ---------------- MOCK PENDING CONTRACT JSON ---------------- */
const SaleContractRenewalJSON = [
  {
    key: 1,
    slno: 1,
    contractNo: "ORD-2024-101",
    plantName: "Customer A",
    renewalDate: "2024-08-10",
    totalAmount: 25000,
    approvalStatus: "RENEWAL",
  },
  {
    key: 2,
    slno: 2,
    contractNo: "ORD-2024-118",
    plantName: "Customer B",
    renewalDate: "2024-09-01",
    totalAmount: 12000,
    approvalStatus: "RENEWAL",
  },
  {
    key: 3,
    slno: 3,
    contractNo: "ORD-2024-125",
    plantName: "Customer C",
    renewalDate: "2024-09-03",
    totalAmount: 18000,
    approvalStatus: "APPROVED",
  },
];

/* ---------------- COMPONENT ---------------- */
const SaleContractRenewal = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredData = useMemo(() => {
    return SaleContractRenewalJSON.filter((rec) => {
      // show ONLY pending orders
      const isRenewal = rec.approvalStatus === "RENEWAL";

      const isSameMonth = selectedMonth
        ? dayjs(rec.renewalDate).isSame(selectedMonth, "month")
        : true;

      return isRenewal && isSameMonth;
    });
  }, [selectedMonth]);

  /* ---------------- TABLE COLUMNS ---------------- */
  const columns = [
    {
      title: <span className="text-amber-700 font-semibold">Sl No</span>,
      dataIndex: "slno",
      width: 70,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Contract No</span>,
      dataIndex: "contractNo",
      width: 150,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Plant Name</span>,
      dataIndex: "plantName",
      width: 150,
      render: (d) => <span className="text-amber-800">{d}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Renewal Date</span>,
      dataIndex: "renewalDate",
      width: 120,
      render: (d) => (
        <span className="text-amber-800">
          {dayjs(d).format("DD-MM-YYYY")}
        </span>
      ),
    },
    
    {
      title: <span className="text-amber-700 font-semibold">Total Amount</span>,
      dataIndex: "totalAmount",
      width: 120,
      render: (t) => <span className="text-amber-800">₹ {t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Status</span>,
      dataIndex: "approvalStatus",
      width: 120,
       render: (t) =>  <Tag color="blue">{t}</Tag>,
    },
  ];

  return (
     <div>
       {/* ---------------- FILTER BAR ---------------- */}
          <div className="border border-amber-300 rounded-lg p-4 shadow-md bg-white">
      
        {/* Header Row */}
        <Row justify="space-between" align="middle" className="mb-1">
      
          {/* Left: Title */}
          <Col>
            <h2 className="text-lg font-semibold text-amber-700">
                Contract Renewal Report
            </h2>
            <p className="text-amber-600 text-sm">
               Detailed overview of all contracts due for renewal
            </p>
          </Col>
      
          {/* Right: Filters */}
          <Col>
            <Row gutter={8} align="middle">
              <Col>
                <MonthPicker
                  value={selectedMonth}
                  format="MMMM YYYY"
                  allowClear
                  onChange={setSelectedMonth}
                  className="border-amber-400! text-amber-700!"
                />
              </Col>
      
              <Col>
                <Button
                  icon={<FilterOutlined />}
                  className="border-amber-400! text-amber-700!"
                  onClick={() => setSelectedMonth(null)}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Col>
      
        </Row>
      
        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="key"
          pagination={{ pageSize: 8 }}
          scroll={{ x: 700 }}
        />
      </div>
     </div>
   );
};

export default SaleContractRenewal;
