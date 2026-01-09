import React, { useMemo, useState } from "react";
import { Table, DatePicker, Row, Col, Card, Tag ,Button} from "antd";
import dayjs from "dayjs";
import { FilterOutlined } from "@ant-design/icons";
const { MonthPicker } = DatePicker;

/* ---------------- MOCK PENDING  CONTRACT JSON ---------------- */
const PendingContractJSON = [
  {
    key: 1,
    slno: 1,
    contractNo: "ORD-2024-101",
    plantName: "Customer A",
    contractDate: "2024-08-10",
    totalAmount: 25000,
    approvalStatus: "PENDING",
  },
  {
    key: 2,
    slno: 2,
    contractNo: "ORD-2024-118",
    plantName: "Customer B",
    contractDate: "2024-09-01",
    totalAmount: 12000,
    approvalStatus: "PENDING",
  },
  {
    key: 3,
    slno: 3,
    contractNo: "ORD-2024-125",
    plantName: "Customer C",
    contractDate: "2024-09-03",
    totalAmount: 18000,
    approvalStatus: "APPROVED",
  },
];

/* ---------------- COMPONENT ---------------- */
const PendingContract = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredData = useMemo(() => {
    return PendingContractJSON.filter((rec) => {
      // show ONLY pending orders
      const isPending = rec.approvalStatus === "PENDING";

      const isSameMonth = selectedMonth
        ? dayjs(rec.contractDate).isSame(selectedMonth, "month")
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
      title: <span className="text-amber-700 font-semibold">Contract Date</span>,
      dataIndex: "contractDate",
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
          Pending  Contract Report
        </h2>
        <p className="text-amber-600 mb-3">
          List of contracts pending in the selected month.
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

export default PendingContract;
