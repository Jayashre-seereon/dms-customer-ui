// SaleReturn.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Select,
  Row,
  Col,
  InputNumber,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const saleReturnJSON = {
  records: [
    {
      key: 1,
      invoiceNo: "INV-001",
      orderNo: "ORD-1001",
      plantName: "Plant1",
      returnDate: "2024-04-01",
      status: "Approved",
      items: [
        { id: "it-1", item: "Sunflower Oil", itemCode: "code1", uom: "Ltr", rate: 500, quantity: 50, returnQty: 10, returnReason: "Quality Issue" },
        { id: "it-2", item: "Mustard Oil", itemCode: "code2", uom: "Ltr", rate: 600, quantity: 20, returnQty: 5, otherReasonText: "Xyz" },
      ],
    },
    {
      key: 2,
      invoiceNo: "INV-002",
      orderNo: "ORD-1002",
      plantName: "Plant2",
      returnDate: "2025-05-15",
      status: "Delivered",
      items: [
        { id: "it-1", item: "Rice", itemCode: "r1", uom: "Kg", rate: 40, quantity: 100 },
        { id: "it-2", item: "Sunflower Oil", itemCode: "code1", uom: "Ltr", rate: 500, quantity: 50 },
        { id: "it-3", item: "Mustard Oil", itemCode: "code2", uom: "Ltr", rate: 600, quantity: 20 },
      ],
    },
  ],
  options: {
    returnReasonOptions: ["Quality Issue", "Damaged Packaging", "Expired", "Wrong Item"],
  },
};

export default function RaiseDispute() {
  const [records, setRecords] = useState(saleReturnJSON.records);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnInvoice, setReturnInvoice] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [isOtherReason, setIsOtherReason] = useState({});
  const [form] = Form.useForm();

  useEffect(() => setFilteredData(records), [records]);

  useEffect(() => {
    const val = searchText.toLowerCase();
    setFilteredData(
      records.filter((rec) =>
        [rec.invoiceNo, rec.orderNo, rec.plantName]
          .join(" ")
          .toLowerCase()
          .includes(val)
      )
    );
  }, [searchText, records]);

  const openView = (record) => {
    setViewRecord(record);
    setIsViewModalOpen(true);
  };

  const openReturnModal = (record, isEdit = false) => {
    setReturnInvoice({
      key: record.key,
      invoiceNo: record.invoiceNo,
      orderNo: record.orderNo,
      plantName: record.plantName,
      returnDate: record.returnDate,
      status: record.status,
    });

    const items = (isEdit ? record.itemsReturned : record.items || []).map((it) => ({
      id: it.id,
      item: it.item,
      itemCode: it.itemCode,
      uom: it.uom,
      rate: it.rate,
      quantity: it.quantity,
      returnQty: it.returnQty || 0,
      returnReason: it.returnReason || undefined,
      otherReasonText: it.otherReasonText || "",
    }));

    const otherFlag = {};
    items.forEach((it) => {
      otherFlag[it.id] = it.returnReason === "Other";
    });

    setReturnItems(items);
    setIsOtherReason(otherFlag);
    form.resetFields();
    setIsReturnModalOpen(true);
  };

  const updateReturnItem = (id, changes) => {
    setReturnItems(prev =>
      prev.map(it => 
        it.id === id 
          ? { 
              ...it, 
              ...changes,
              totalAmount: ((changes.returnQty ?? it.returnQty) || 0) * it.rate 
            } 
          : it
      )
    );
  };

  const onReasonChange = (id, value) => {
    updateReturnItem(id, { returnReason: value });
    setIsOtherReason((prev) => ({ ...prev, [id]: value === "Other" }));
  };

  const handleSaveReturn = async () => {
    try {
      const values = await form.validateFields();
      const selected = returnItems.filter((it) => Number(it.returnQty) > 0);

      const newReturn = {
        key: records.length + 1 + Math.floor(Math.random() * 1000),
        invoiceNo: returnInvoice.invoiceNo,
        orderNo: returnInvoice.orderNo,
        plantName: returnInvoice.plantName,
        returnDate: dayjs().format("YYYY-MM-DD"),
        status: "Pending",
        itemsReturned: selected.map(it => ({
          ...it,
          totalAmount: (it.returnQty || 0) * it.rate,
        })),
      };

      setRecords((prev) => [...prev.filter((p) => p.invoiceNo !== newReturn.invoiceNo), newReturn]);

      setIsReturnModalOpen(false);
      setReturnInvoice(null);
      setReturnItems([]);
      form.resetFields();
    } catch (error) {
      // Handle validation errors
    }
  };

  const columns = [
    {
      title: <span className="text-amber-700 font-semibold">Invoice No</span>,
      dataIndex: "invoiceNo",
      width: 140,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Order No</span>,
      dataIndex: "orderNo",
      width: 120,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Return Date</span>,
      dataIndex: "returnDate",
      width: 160,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Plant</span>,
      dataIndex: "plantName",
      width: 120,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Items</span>,
      dataIndex: "items",
      render: (items, record) =>
        <span className="text-amber-800">{(items || record.itemsReturned || []).map(i => i.item).join(", ")}</span>
    },
    {
      title: <span className="text-amber-700 font-semibold">Status</span>,
      dataIndex: "status",
      width: 120,
      render: (status) => {
        const base = "px-3 py-1 rounded-full text-sm font-semibold";
        if (status === "Approved") return <span className={`${base} bg-green-100 text-green-700`}>{status}</span>;
        if (status === "Pending") return <span className={`${base} bg-yellow-100 text-yellow-700`}>{status}</span>;
        return <span className={`${base} bg-red-100 text-red-700`}>{status}</span>;
      },
    },
    {
      title: <span className="text-amber-700 font-semibold">Action</span>,
      width: 120,
      render: (record) => {
        if (record.status === "Approved") {
          return <EyeOutlined className="cursor-pointer! text-blue-500!" onClick={() => openView(record)} />;
        } else if (record.status === "Pending") {
          return (
            <div className="flex gap-3">
              <EyeOutlined className="cursor-pointer! text-blue-500!" onClick={() => openView(record)} />
              <ReloadOutlined className="cursor-pointer! text-red-500!" onClick={() => openReturnModal(record, true)} />
            </div>
          );
        } else {
          return (
            <div className="flex gap-3">
              <EyeOutlined className="cursor-pointer! text-blue-500!" onClick={() => openView(record)} />
              <ReloadOutlined className="cursor-pointer! text-red-500!" onClick={() => openReturnModal(record)} />
            </div>
          );
        }
      },
    },
  ];

  const returnColumns = [
    { title: "Item Name", dataIndex: "item", key: "item", render: (t) => <span className="text-amber-800">{t}</span> },
    { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
    { title: "UOM", dataIndex: "uom", key: "uom" },
    { title: "Rate", dataIndex: "rate", key: "rate" },
    { title: "Order Qty", dataIndex: "quantity", key: "quantity" },
    {
      title: "Return Qty",
      key: "returnQty",
      render: (_, row) => (
        <Form.Item
          name={`returnQty_${row.id}`}
          rules={[
            { required: true, message: "Return Qty required" },
            {
              validator: (_, value) =>
                value > row.quantity
                  ? Promise.reject(new Error(`Cannot exceed order qty (${row.quantity})`))
                  : Promise.resolve(),
            },
          ]}
          initialValue={row.returnQty}
          style={{ margin: 0 }}
        >
          <InputNumber
            min={0}
            max={row.quantity}
            value={row.returnQty}
            onChange={(val) => updateReturnItem(row.id, { returnQty: val || 0 })}
            style={{ width: "100%" }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (_, row) => <span>{((row.returnQty || 0) * row.rate).toFixed(2)}</span>,
    },
    {
      title: "Reason",
      key: "returnReason",
      render: (_, row) => (
        <Form.Item
          name={`returnReason_${row.id}`}
          rules={[
            { required: row.returnQty > 0, message: "Reason required" },
            {
              validator: (_, value) =>
                isOtherReason[row.id] && !row.otherReasonText
                  ? Promise.reject(new Error("Specify other reason"))
                  : Promise.resolve(),
            },
          ]}
          initialValue={row.returnReason}
          style={{ margin: 0 }}
        >
          <>
            <Select
              placeholder="Select reason"
              value={row.returnReason}
              onChange={(val) => onReasonChange(row.id, val)}
              style={{ width: "100%" }}
            >
              {saleReturnJSON.options.returnReasonOptions.map((v) => (
                <Select.Option key={v} value={v}>{v}</Select.Option>
              ))}
              <Select.Option key="Other" value="Other">Other</Select.Option>
            </Select>
            {isOtherReason[row.id] && (
              <Input
                placeholder="Specify other reason"
                value={row.otherReasonText}
                onChange={(e) => updateReturnItem(row.id, { otherReasonText: e.target.value })}
                style={{ marginTop: 8 }}
              />
            )}
          </>
        </Form.Item>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-0">
        <div>
          <h1 className="text-3xl font-bold text-amber-700"> Rise Dispute</h1>
          <p className="text-amber-600">Manage your Dispute easily</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined className="text-amber-600!" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border-amber-300! w-64! focus:border-amber-500!"
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => setSearchText("")}
            className="border-amber-400! text-amber-700! hover:bg-amber-100!"
          >
            Reset
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            icon={<DownloadOutlined />}
            className="border-amber-400! text-amber-700! hover:bg-amber-100!"
          >
            Export
          </Button>
        </div>
      </div>

      <div className="border border-amber-300 rounded-lg p-4 shadow-md">
        <Table columns={columns} dataSource={filteredData} pagination={false} rowKey="key" />
      </div>

      {/* View Modal */}
      <Modal
        title={<span className="text-amber-700 text-2xl font-semibold">View Dispute</span>}
        open={isViewModalOpen}
        onCancel={() => { setIsViewModalOpen(false); setViewRecord(null); }}
        footer={null}
        width={900}
      >
        {viewRecord && (
          <div>
            <Row gutter={16}>
              <Col span={6}><b>Invoice No</b><div className="text-amber-800">{viewRecord.invoiceNo}</div></Col>
              <Col span={6}><b>Order No</b><div className="text-amber-800">{viewRecord.orderNo}</div></Col>
              <Col span={6}><b>Plant</b><div className="text-amber-800">{viewRecord.plantName}</div></Col>
              <Col span={6}><b>Dispute Date</b><div className="text-amber-800">{viewRecord.returnDate}</div></Col>
            </Row>
            <h6 className="text-amber-500 mt-4">Items</h6>
            <Table
              size="small"
              dataSource={viewRecord.itemsReturned || viewRecord.items || []}
              pagination={false}
              rowKey={(r) => r.id || r.itemCode}
              columns={[
                { title: "Item", dataIndex: "item", key: "item" },
                { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
                { title: "UOM", dataIndex: "uom", key: "uom" },
                { title: "Rate", dataIndex: "rate", key: "rate" },
                { title: "Qty", dataIndex: "quantity", key: "quantity" },
                { title: "Return Qty", dataIndex: "returnQty", key: "returnQty" },
                { title: "Reason", dataIndex: "returnReason", key: "returnReason" },
                { title: "Other Reason", dataIndex: "otherReasonText", key: "otherReasonText" },
                { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount" },
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Return Modal */}  
      <Modal
        title={<span className="text-amber-700 text-2xl font-semibold">Dispute Items</span>}
        open={isReturnModalOpen}
        onCancel={() => { setIsReturnModalOpen(false); setReturnInvoice(null); setReturnItems([]); form.resetFields(); }}
        onOk={handleSaveReturn}
        okText="Save Return"
        width={1000}
      >
        {returnInvoice && (
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={6}><Form.Item label="Invoice No"><Input value={returnInvoice.invoiceNo} disabled /></Form.Item></Col>
              <Col span={6}><Form.Item label="Order No"><Input value={returnInvoice.orderNo} disabled /></Form.Item></Col>
              <Col span={6}><Form.Item label="Plant Name"><Input value={returnInvoice.plantName} disabled /></Form.Item></Col>
              <Col span={6}>
                <Form.Item label="Return Date">
                  <Input value={dayjs().format("YYYY-MM-DD")} disabled />
                </Form.Item>
              </Col>
            </Row>
            <h6 className="text-amber-500 mt-3">Select items and enter dispute qty & reason</h6>
            <Table size="small" dataSource={returnItems} pagination={false} rowKey="id" columns={returnColumns} />
          </Form>
        )}
      </Modal>
    </div>
  );
}












