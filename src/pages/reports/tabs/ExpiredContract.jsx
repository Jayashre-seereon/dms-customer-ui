import React, { useMemo, useState } from "react";
import { Table, DatePicker, Row, Col, Card, Tag ,Button} from "antd";
import dayjs from "dayjs";
import { FilterOutlined } from "@ant-design/icons";
const { MonthPicker } = DatePicker;

/* ---------------- MOCK SALE LoadingAdvice JSON ---------------- */
const SaleExpiredContractJSON = [
  {
    key: 1,
    slno: 1,
    ContractNo: "SCON-2024-001",
    plantName: "Customer A",
    startDate: "2024-06-01",
    endDate: "2024-09-06", // expiry date
    totalAmount: 15000,
     approvalStatus: "EXPIRED",
  },
  {
    key: 2,
    slno: 2,
    ContractNo: "PCON-2024-014",
    plantName: "Customer B",
    startDate: "2024-07-10",
    endDate: "2024-09-19",
    totalAmount: 8000,
      approvalStatus: "Not EXPIRED",
  },
];


/* ---------------- COMPONENT ---------------- */
const SaleExpiredContract = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  /* ---------------- MONTH FILTER LOGIC ---------------- */
 const filteredData = useMemo(() => {

  return SaleExpiredContractJSON.filter((rec) =>
  {
   const isExpired = rec.approvalStatus === "EXPIRED";
   const isSameMonth = selectedMonth
     ? dayjs(rec.endDate).isSame(selectedMonth, "month")
     : true;

    return isExpired && isSameMonth;
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
    
      dataIndex: "ContractNo",
      width: 160,
      
          render: (t) => <span className="text-amber-800">{t}</span>,
    },
    
    {
       title: <span className="text-amber-700 font-semibold">Plant Name</span>,
      dataIndex: "plantName",
      width: 120, 
       render: (d) => <span className="text-amber-800">{d}</span>,
 
    },
   
    {
       title: <span className="text-amber-700 font-semibold">Total Amount</span>,
      dataIndex: "totalAmount",
      width: 120,
      
          render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Expired Date</span>,      
      dataIndex: "endDate",
      width: 120, 
        render: (d) => <span className="text-amber-800">{ dayjs(d).format("DD-MM-YYYY")}</span>, 
    },
    {
          title: <span className="text-amber-700 font-semibold">Status</span>,
          dataIndex: "approvalStatus",
          width: 120,
           render: (t) =>  <Tag color="red">{t}</Tag>,
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
      Expired  Contract Details
        </h2>
        <p className="text-amber-600 mb-3">
          List of contracts that have expired.
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

export default SaleExpiredContract;
