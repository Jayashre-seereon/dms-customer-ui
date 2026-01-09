import React, { useMemo, useState } from "react";
import { Table, DatePicker, Row, Col, Card, Tag ,Button} from "antd";
import dayjs from "dayjs";
import { FilterOutlined } from "@ant-design/icons";
const { MonthPicker } = DatePicker;

/* ---------------- MOCK PENDING ORDERS JSON ---------------- */
const PendingOrdersJSON = [
  {
    key: 1,
    slno: 1,
    orderNo: "ORD-2024-101",
    plantName: "Customer A",
    orderDate: "2024-08-10",
    totalAmount: 25000,
    approvalStatus: "PENDING",
  },
  {
    key: 2,
    slno: 2,
    orderNo: "ORD-2024-118",
    plantName: "Customer B",
    orderDate: "2024-09-01",
    totalAmount: 12000,
    approvalStatus: "PENDING",
  },
  {
    key: 3,
    slno: 3,
    orderNo: "ORD-2024-125",
    plantName: "Customer C",
    orderDate: "2024-09-03",
    totalAmount: 18000,
    approvalStatus: "APPROVED",
  },
];

/* ---------------- COMPONENT ---------------- */
const PendingOrders = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredData = useMemo(() => {
    return PendingOrdersJSON.filter((rec) => {
      // show ONLY pending orders
      const isPending = rec.approvalStatus === "PENDING";

      const isSameMonth = selectedMonth
        ? dayjs(rec.orderDate).isSame(selectedMonth, "month")
        : true;

      return isPending && isSameMonth;
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
      title: <span className="text-amber-700 font-semibold">Order No</span>,
      dataIndex: "orderNo",
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
      title: <span className="text-amber-700 font-semibold">Order Date</span>,
      dataIndex: "orderDate",
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
          render: (t) =>  <Tag color="yellow">{t}</Tag>,
       },
  ];

  return (
    <div>
      {/* ---------------- FILTER BAR ---------------- */}
      <Card
        size="small"
        style={{ marginBottom: 12, border: "1px solid #FDE68A" }}
      >
           <Row gutter={12} align="bottom">
         <Col span={6}>
           <label className="text-amber-700 font-semibold">
             Select Month
           </label>
           <MonthPicker
             value={selectedMonth}
             className="w-full border-amber-400! text-amber-700! hover:bg-amber-100!"
             format="MMMM YYYY"
             allowClear
             onChange={setSelectedMonth}
           />
         </Col>
       
         <Col>
           <Button
           className="w-full border-amber-400! text-amber-700! hover:bg-amber-100!"
            
           icon={<FilterOutlined />}
             style={{ marginTop: 22 }}
             onClick={() => setSelectedMonth(null)}
           >
             Reset
           </Button>
         </Col>
       </Row>
      </Card>

      {/* ---------------- TABLE ---------------- */}
      <div className="border border-amber-300 rounded-lg p-4 shadow-md bg-white">
        <h2 className="text-lg font-semibold text-amber-700 mb-1">
          Pending Orders Report
        </h2>
        <p className="text-amber-600 mb-3">
          List of orders pending in the selected month.
        </p>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="key"
          pagination={{ pageSize: 8 }}
          scroll={{ x: 900 }}
        />
      </div>
    </div>
  );
};

export default PendingOrders;
