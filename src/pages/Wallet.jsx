// WalletPage.jsx
import React, { useState } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Modal,
  Form,
  InputNumber,
  Row,
  Col
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const amber = {
  light: "#fef3c7",
  main: "#f59e0b",
  dark: "#b45309",
};

// ⭐ Updated Wallet Data with Qty + UOM
const walletData = [
  {
    id: 1,
    type: "Credit",
    noteNo: "CN-1001",
    amount: 4500,
    qty: 10,
    uom: "PCS",
    refType: "Order",
    refId: "ORD-9852",
    date: "2025-01-15",
    status: " Not Applied",
  },
  {
    id: 2,
    type: "Debit",
    noteNo: "CN-1002",
    amount: 3000,
    qty: 5,
    uom: "BOX",
    refType: "Dispute",
    refId: "DIS-2291",
    date: "2025-01-20",
    status: "Applied",
  },
  
];

const WalletPage = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterRef, setFilterRef] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [form] = Form.useForm();

  const filterData = walletData.filter((row) => {
    return (
      row.noteNo.toLowerCase().includes(search.toLowerCase()) &&
      (filterType ? row.type === filterType : true) &&
      (filterRef ? row.refType === filterRef : true)
    );
  });

  const columns = [
    {  title: <span className="text-amber-700! font-semibold!">Note No</span>,
      dataIndex: "noteNo" ,
        render: (text) => <span className="text-amber-800">{text}</span>,

    },

      

    {
      title: <span className="text-amber-700 font-semibold">Reference</span>,
      dataIndex: "refType",
        render: (text) => <span className="text-amber-800">{text}</span>,

    },

    {
      title: <span className="text-amber-700 font-semibold">Type</span>,
      dataIndex: "type",
      
      render: (type) => {
        const base = "px-3 py-1 rounded-full text-sm font-semibold";
        if (type === "Credit")
          return <span className={`${base} text-green-600`}>Credit</span>;
        return <span className={`${base} text-blue-700`}>Debit</span>;
      },
    },

    {  title: <span className="text-amber-700! font-semibold!">Order/Dispute No</span>,
      dataIndex: "refId" 
    ,  render: (text) => <span className="text-amber-800">{text}</span>,
},
      

   {
  title: <span className="text-amber-700! font-semibold!">Qty</span>,
     
  dataIndex: "qty",
  render: (_,text) => <span className="text-amber-800">{text.qty}{text.uom}</span>,

},

    {
       title: <span className="text-amber-700! font-semibold!">Amount</span>,
     
      dataIndex: "amount",
        render: (text) => <span className="text-amber-800"> {text}</span>,

    },

    {  title: <span className="text-amber-700! font-semibold!">Date</span>,
     dataIndex: "date" 
     ,  render: (text) => <span className="text-amber-800">{text}</span>,

    },

    {
      title: <span className="text-amber-700! font-semibold!">Status</span>,
      dataIndex: "status",
      width:150,
      render: (status) => {
        const base = "px-3 py-1 rounded-full text-sm font-semibold";
        if (status === "Applied")
          return <span className={`${base} bg-red-100 text-red-700`}>Applied</span>;
        return (
          <span className={`${base} bg-green-100 text-green-700`}>Not Applied</span>
        );
      },
    },

    {
      title: <span className="text-amber-700! font-semibold!">Action</span>,
      render: (_, record) => (
        <div className="flex gap-3">
          <EyeOutlined
            className="cursor-pointer! text-blue-500! hover:text-blue-700!"
            onClick={() => {
              setSelectedRow(record);
              form.setFieldsValue(record);
              setViewModalOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-0">
         <p className="text-amber-600">View all Credit and Debit Notes</p>
      </div>

      {/* Search */}
      <div className="flex justify-between mb-2">
        <div className="flex gap-2">
          <Input
            prefix={<SearchOutlined className="text-amber-600!" />}
            placeholder="Search Note No..."
            className="w-64! border-amber-300!"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
           <Select
          className="w-52! border-amber-300!"
          placeholder="Filter by Type"
          allowClear
          onChange={(v) => setFilterType(v)}
        >
          <Select.Option value="Credit">Credit</Select.Option>
          <Select.Option value="Debit">Debit</Select.Option>
        </Select>

        <Select
          className="w-52! border-amber-300!"
          placeholder="Filter by Reference"
          allowClear
          onChange={(v) => setFilterRef(v)}
        >
          <Select.Option value="Order">Order</Select.Option>
          <Select.Option value="Dispute">Dispute</Select.Option>
        </Select>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearch("");
              setFilterType("");
              setFilterRef("");
            }}
            className="border-amber-400! text-amber-700! hover:bg-amber-100!"
          >
            Reset
          </Button>
        </div>
      </div>


      {/* Table */}
      <div className="border border-amber-300 rounded-lg p-4">
        <Table
          dataSource={filterData}
          columns={columns}
          pagination={false}
          scroll={{ y: 350 }}
        />
      </div>

      {/* View Modal */}
      <Modal
        title={
          <span className="text-amber-700 text-2xl font-semibold">View Note</span>
        }
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={600}
      >
    <Form layout="vertical" form={form}>
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item label="Note Type" name="type">
        <Input disabled />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item label="Note Number" name="noteNo">
        <Input disabled />
      </Form.Item>
    </Col>
  </Row>

  <Row gutter={16}>
    <Col span={12}>
      <Form.Item label="Reference Type" name="refType">
        <Input disabled />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item label="Reference ID" name="refId">
        <Input disabled />
      </Form.Item>
    </Col>
  </Row>

  <Row gutter={16}>
    <Col span={12}>
      <Form.Item label="Quantity" name="qty">
        <InputNumber className="w-full!" disabled />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item label="UOM" name="uom">
        <Input disabled />
      </Form.Item>
    </Col>
  </Row>

  <Row gutter={16}>
    <Col span={12}>
      <Form.Item label="Amount" name="amount">
        <InputNumber className="w-full!" disabled />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item label="Date" name="date">
        <Input disabled />
      </Form.Item>
    </Col>
  </Row>

  <Row gutter={16}>
    <Col span={12}>
      <Form.Item label="Status" name="status">
        <Input disabled />
      </Form.Item>
    </Col>

     </Row>
</Form>


      </Modal>
    </div>
  );
};

export default WalletPage;
