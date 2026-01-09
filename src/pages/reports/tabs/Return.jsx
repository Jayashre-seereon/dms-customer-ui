import React, { useMemo, useState } from "react";
import { Table, DatePicker, Row, Col, Card, Button } from "antd";
import dayjs from "dayjs";
import { FilterOutlined } from "@ant-design/icons";
const { MonthPicker } = DatePicker;

/* ---------------- MOCK SALE RETURN JSON ---------------- */
const saleReturnJSON = [
  {
    key: 1,
    slno: 1,
    plantName: "Kalinga Oils Pvt Ltd",
    returnAmount:50,
    returnReason: "Damaged Goods",
    returnDate: "2024-09-12",
    status: "Approved",
  },
  {
    key: 2,
    slno: 2,
    plantName: "Odisha Edibles",
    returnAmount: 25,
    returnReason: "Damaged Goods",
    returnDate: "2024-09-26",
    status: "Pending",
  },
  {
    key: 3,
    slno: 3,
    plantName: "Kalinga Oils Pvt Ltd",
    returnAmount: 50,
    returnReason: "Damaged Goods",
    returnDate: "2024-10-08",
    status: "Approved",
  },
  {
    key: 4,
    slno: 4,
    plantName: "Odisha Edibles",
    returnAmount: 20,
    returnReason: "Damaged Goods",
    returnDate: "2024-11-15",
    status: "Rejected",
  },
];

/* ---------------- COMPONENT ---------------- */
const SaleReturn = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  /* ---------------- MONTH FILTER LOGIC ---------------- */
  const filteredData = useMemo(() => {
    if (!selectedMonth) return saleReturnJSON;

    return saleReturnJSON.filter((rec) =>
      dayjs(rec.returnDate).isSame(selectedMonth, "month")
    );
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
             title: <span className="text-amber-700 font-semibold">Plant Name</span>,
   
      dataIndex: "plantName",
      width: 220,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
      {
   title: <span className="text-amber-700 font-semibold"> Return Date
</span>,
   
      dataIndex: "returnDate",
      width: 120, 
       render: (d) => <span className="text-amber-800">{d ? dayjs(d).format("YYYY-MM-DD") : ""}</span>,
 
    },
   {
      title: <span className="text-amber-700 font-semibold">Return Amount</span>,
      dataIndex: "returnAmount",  
      width: 130,
      render: (t) => <span className="text-amber-800">{t}</span>, 
   },
   {
    title: <span className="text-amber-700 font-semibold">Return Reason</span>,
      dataIndex: "returnReason",
      width: 150,
      render: (t) => <span className="text-amber-800">{t}</span>,

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
          Returns
        </h2>
        <p className="text-amber-600 mb-3">
          Month-wise return records
        </p>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="key"
          pagination={{ pageSize: 8 }}
          scroll={{ x: 100 }}
        />
      </div>
    </div>
  );
};

export default SaleReturn;
