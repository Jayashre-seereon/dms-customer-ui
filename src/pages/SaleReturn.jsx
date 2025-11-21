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
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// 🔹 JSON Data
const saleReturnJSON = {
  records: [
    {
      key: 1,
      invoiceNo: "INV-001",
      orderNo: 1,
      item: "Sunflower Oil",
      customer: "Ramesh",
      quantity: 50,
      freeQty: 10,
      uom: "Ltr",
      rate: 500,
      totalAmount: 25000,
      returnDate: "2024-04-01",
      returnReason: "Damaged Packaging",
      status: "Approved",
      companyName: "Odisha Edibles",
      branchName: "Cuttack",
      depo: "Cuttack Depot",
      grossAmount: 25000,
      discountPercent: 10,
      discountAmount: 2500,
      sgstPercent: 9,
      cgstPercent: 1,
      igstPercent: 9,
      otherCharges: 7,
      roundOffAmount: 8, 
      grandTotal: 25000 - 2500 + 2250 + 250 + 7 + 8 + 500 - 20,  itemCode: "code1",
      itemGroup: "G1",
      orderNo: "n1",
      hsnCode: "hsn1",
      plantName: "p1",
      transporter: "Blue Transport",
      vehicleNo: "OD-05-AB-1234",
      driverName: "Rajesh Kumar",
      waybillNo: "WB-001",
      naarration: "narrrr",
      netQty: 50, 
      grossQty: 60, 
      sgstAmount: 2250, 
      cgstAmount: 250, 
      igstAmount: 45,
      totalGST: 2500, 
      tcsAmt: 500,
      cashDiscount: 20,
    },
  ],
  options: {
    uomOptions: ["Ltr", "Kg", "Ton"],
    statusOptions: ["Rejected", "Pending", "Approved"],
    returnReasonOptions: [
      "Quality Issue",
      "Damaged Packaging",
      "Expired",
      "Wrong Item",
    ],
    companyOptions: ["Kalinga Oil Mills", "Odisha Edibles"],
    branchOptions: ["Bhubaneswar", "Cuttack", "Puri"],
    depoOptions: ["Bhubaneswar Depot", "Cuttack Depot", "Puri Depot"],
  },
};

export default function SaleReturn() {
  const [records, setRecords] = useState(saleReturnJSON.records);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isOtherReason, setIsOtherReason] = useState(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [viewForm] = Form.useForm();

  useEffect(() => {
    setFilteredData(records);
  }, [records]);

  useEffect(() => {
    const val = searchText.toLowerCase();
    setFilteredData(
      records.filter((item) =>
        Object.values(item).some((v) => String(v).toLowerCase().includes(val))
      )
    );
  }, [searchText, records]);

  // 🔹 Updated Calculation Logic
  const calculateTotals = (values) => {
    const qty = parseFloat(values.quantity || 0);
    const freeQty = parseFloat(values.freeQty || 0);
    const rate = parseFloat(values.rate || 0);
    const discountPercent = parseFloat(values.discountPercent || 0);
    const sgstPercent = parseFloat(values.sgstPercent || 0);
    const cgstPercent = parseFloat(values.cgstPercent || 0);
    const igstPercent = parseFloat(values.igstPercent || 0);
    const otherCharges = parseFloat(values.otherCharges || 0);
    const roundOffAmount = parseFloat(values.roundOffAmount || 0); 
    const tcsAmt = parseFloat(values.tcsAmt || 0);
    const cashDiscount = parseFloat(values.cashDiscount || 0); 

    const netQty = qty; 
    const grossQty = qty + freeQty; 

    const grossAmount = qty * rate;
    const discountAmount = (grossAmount * discountPercent) / 100;
    const taxableAmount = grossAmount - discountAmount;

    const sgstAmount = (taxableAmount * sgstPercent) / 100;
    const cgstAmount = (taxableAmount * cgstPercent) / 100;
    const igstAmount = (taxableAmount * igstPercent) / 100;
    const totalTaxAmount = sgstAmount + cgstAmount + igstAmount; 

     const grandTotal =
      taxableAmount +
      totalTaxAmount +
      otherCharges +
      tcsAmt -
      cashDiscount +
      roundOffAmount;

    return {
      netQty: Number(netQty.toFixed(2)),
      grossQty: Number(grossQty.toFixed(2)), 
      totalQtyDisplay: Number(grossQty.toFixed(2)), 
      grossAmount: Number(grossAmount.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      sgstAmount: Number(sgstAmount.toFixed(2)), 
      cgstAmount: Number(cgstAmount.toFixed(2)), 
      igstAmount: Number(igstAmount.toFixed(2)), 
      totalGST: Number(totalTaxAmount.toFixed(2)), 
      taxableAmount: Number(taxableAmount.toFixed(2)), 
      grandTotal: Number(grandTotal.toFixed(2)),
    };
  };

  const handleValuesChange = (changedValues, allValues, targetForm) => {
     if (
      [
        "quantity",
        "freeQty",
        "rate",
        "discountPercent",
        "sgstPercent",
        "cgstPercent",
        "igstPercent",
        "otherCharges",
        "roundOffAmount", 
        "tcsAmt", 
        "cashDiscount", 
      ].some((key) => Object.prototype.hasOwnProperty.call(changedValues, key))
    ) {
      const totals = calculateTotals(allValues);
      targetForm.setFieldsValue(totals);
    }
    if (Object.prototype.hasOwnProperty.call(changedValues, "returnReason")) {
      setIsOtherReason(changedValues.returnReason === "Other");
    }
  };

  const setFormValues = (record, targetForm, mode = "view") => {
    const totals = calculateTotals(record);

    const base = {
      ...record,
      ...totals, 
      returnDate: record.returnDate ? dayjs(record.returnDate) : dayjs(),
      roundOffAmount: record.roundOffAmount || record.roundOff || 0,
      tcsAmt: record.tcsAmt || 0, 
      cashDiscount: record.cashDiscount || 0, 
    };

    const isCustomReason = !saleReturnJSON.options.returnReasonOptions.includes(
      record.returnReason
    );
    const reasonValue = isCustomReason ? "Other" : record.returnReason;
    const otherReasonText = isCustomReason ? record.returnReason : "";
    setIsOtherReason(isCustomReason);

    if (mode === "add") {
      targetForm.setFieldsValue({
        ...base,
        status: "Pending",
        returnDate: dayjs(),
      });
    } else {
      targetForm.setFieldsValue({
        ...base,
        returnReason: reasonValue,
        otherReasonText: otherReasonText,
      });
    }
  };

  const handleSubmit = (values, mode) => {
    const record = {
      ...values,
      returnDate: values.returnDate
        ? values.returnDate.format("YYYY-MM-DD")
        : null,
    };

    if (record.returnReason === "Other") {
      record.returnReason = record.otherReasonText || "Other";
    }
    delete record.otherReasonText;
    delete record.totalQtyDisplay; 
    delete record.taxableAmount; 

    if (mode === "edit") {
      setRecords((prev) =>
        prev.map((item) =>
          item.key === selectedRecord.key ? { ...item, ...record } : item
        )
      );
      setIsEditModalOpen(false);
      editForm.resetFields();
    } else if (mode === "add") {
      setRecords((prev) => [...prev, { ...record, key: prev.length + 1 }]);
      setIsAddModalOpen(false);
      addForm.resetFields();
    }
  };

  const handleAddClick = () => {
    addForm.resetFields();
    addForm.setFieldsValue({
      status: "Pending",
      returnDate: dayjs(),
      quantity: 0,
      freeQty: 0,
      rate: 0,
      discountPercent: 0,
      sgstPercent: 0,
      cgstPercent: 0,
      igstPercent: 0,
      otherCharges: 0,
      roundOffAmount: 0,
      tcsAmt: 0,
      cashDiscount: 0,
    });
    setIsOtherReason(false);
    setIsAddModalOpen(true);
  };

  const onInvoiceSelectForAdd = (invoiceNo) => {
    const source = records.find((r) => r.invoiceNo === invoiceNo);
    if (!source) return;

    const initialValues = {
      ...source,
      returnDate: dayjs(),
      status: "Pending",
      quantity: source.quantity,
      freeQty: source.freeQty,
      rate: source.rate,
      discountPercent: source.discountPercent,
      sgstPercent: source.sgstPercent,
      cgstPercent: source.cgstPercent,
      igstPercent: source.igstPercent,
      otherCharges: source.otherCharges,
      roundOffAmount: source.roundOffAmount || source.roundOff || 0, // 🆕
      tcsAmt: source.tcsAmt || 0, // 🆕
      cashDiscount: source.cashDiscount || 0, // 🆕
    };

    const totals = calculateTotals(initialValues);

    addForm.setFieldsValue({ ...initialValues, ...totals });
  };
  const renderFormFields = (mode = "view") => {
    const isView = mode === "view";
    const isAdd = mode === "add";
    const isEdit = mode === "edit";

    const disabledFor = (field) => {
      if (isView) return true;
       if (isAdd || isEdit) return !["invoiceNo", "quantity", "returnReason"].includes(field);
      return true;
    };

    return (
      <>
        <h6 className="text-amber-500">Invoice & Party Details</h6>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Invoice No" name="invoiceNo" rules={[{ required: true }]}>
              <Select
                onChange={(val) => isAdd && onInvoiceSelectForAdd(val)} 
                disabled={disabledFor("invoiceNo")}
              >
                {[...new Set(records.map((r) => r.invoiceNo))].map(
                  (invoiceNo) => {
                    const record = records.find(
                      (r) => r.invoiceNo === invoiceNo
                    );
                    return (
                      <Select.Option key={invoiceNo} value={invoiceNo}>
                        {invoiceNo} - {record?.item}
                      </Select.Option>
                    );
                  }
                )}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Order No" name="orderNo">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Plant Name" name="plantName">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Company" name="companyName">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Customer Name" name="customer">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Return Date"
              name="returnDate"
              rules={[{ required: true }]}
            >
              <DatePicker
                className="w-full"
                disabledDate={(current) => current && current > dayjs().endOf("day")}
                disabled={disabledFor("returnDate")}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Branch Name" name="branchName">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Depo Name" name="depo">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Transporter" name="transporter">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Way billNo" name="waybillNo">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Vehicle No" name="vehicleNo">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Driver Name" name="driverName">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Naarration" name="naarration">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Status" name="status">
              <Select disabled={disabledFor("status")}>
                {saleReturnJSON.options.statusOptions.map((v) => (
                  <Select.Option key={v}>{v}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <h6 className="text-amber-500">Item & Return Details</h6>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Item Name" name="item" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Item Code" name="itemCode" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Item Group" name="itemGroup" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="HSN code" name="hsnCode" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="UOM" name="uom" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Net Quantity" name="netQty">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Free Quantity" name="freeQty">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Return Quantity" name="quantity" rules={[{ required: true }]}>
              <Input className="w-full" disabled={disabledFor("quantity")} min={1} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          
          <Col span={6}>
            <Form.Item label="Total (Net + Free) Quantity" name="grossQty">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Rate" name="rate">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Gross Amount" name="grossAmount">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Return Reason"
              name="returnReason"
              rules={[{ required: true }]}
            >
              <Select disabled={disabledFor("returnReason")}>
                {saleReturnJSON.options.returnReasonOptions.map((v) => (
                  <Select.Option key={v} value={v}>
                    {v}
                  </Select.Option>
                ))}
                <Select.Option key="Other" value="Other">
                  Other
                </Select.Option>
              </Select>
            </Form.Item>

            {isOtherReason && (
              <Form.Item
                label="Specify Other Reason"
                name="otherReasonText"
                rules={[{ required: true, message: "Please enter a reason" }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Please describe the reason for return"
                  disabled={isView}
                />
              </Form.Item>
            )}
          </Col>
        </Row>

        <h6 className="text-amber-500">Tax & Amount Details</h6>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Discount %" name="discountPercent">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Discount Amount" name="discountAmount">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Taxable Amount" name="taxableAmount">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="SGST %" name="sgstPercent">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="SGST Amount" name="sgstAmount">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="CGST %" name="cgstPercent">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="CGST Amount" name="cgstAmount">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="IGST %" name="igstPercent">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="IGST Amount" name="igstAmount">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Total GST" name="totalGST">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="TCS Amount" name="tcsAmt">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Cash Discount" name="cashDiscount">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Other Charges" name="otherCharges">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Round Off Amount" name="roundOffAmount">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Grand Total (Total Amount)" name="grandTotal">
              <Input className="w-full" disabled />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  const columns = [
    {
      title: <span className="text-amber-700 font-semibold">Invoice No</span>,
      dataIndex: "invoiceNo",
      width: 100,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Item Name</span>,
      dataIndex: "item",
      width: 100,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Total Qty</span>,
      width: 100,
      render: (_, record) => (
        <span className="text-amber-800">
          {(record.quantity || 0) + (record.freeQty || 0)} {record.uom}
        </span>
      ),
    },
    {
      title: <span className="text-amber-700 font-semibold">Total Amt</span>,
      dataIndex: "grandTotal",
      width: 100,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Return Date</span>,
      dataIndex: "returnDate",
      width: 100,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Reason</span>,
      dataIndex: "returnReason",
      width: 100,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Status</span>,
      dataIndex: "status",
      width: 100,
      render: (status) => {
        const base = "px-3 py-1 rounded-full text-sm font-semibold";
        if (status === "Approved")
          return <span className={`${base} bg-green-100 text-green-700`}>{status}</span>;
        if (status === "Pending")
          return <span className={`${base} bg-yellow-100 text-yellow-700`}>{status}</span>;
        return <span className={`${base} bg-red-100 text-red-700`}>{status}</span>;
      },
    },
    {
      title: <span className="text-amber-700 font-semibold">Action</span>,
      width: 80,
      render: (record) => (
        <div className="flex gap-3">
          <EyeOutlined
            className="cursor-pointer! text-blue-500!"
            onClick={() => {
              setSelectedRecord(record);
              setFormValues(record, viewForm, "view");
              setIsViewModalOpen(true);
            }}
          />
          {record.status !== "Approved" && (
            <EditOutlined
              className="cursor-pointer! text-red-500!"
              onClick={() => {
                setSelectedRecord(record);
                setFormValues(record, editForm, "edit");
                setIsEditModalOpen(true);
              }}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-0">
        <div>
          <h1 className="text-3xl font-bold text-amber-700">Sales Return</h1>
          <p className="text-amber-600">Manage your sales Return easily</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined className="text-amber-600!" />}
            value={searchText}
            className="w-64! border-amber-300! focus:border-amber-500!"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => setSearchText("")}
            className="border-amber-400! text-amber-700! hover:bg-amber-100!"
          >
            Reset Search
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            icon={<DownloadOutlined />}
            className="border-amber-400! text-amber-700! hover:bg-amber-100!"
          >
            Export
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-amber-500! hover:bg-amber-600! border-none!"
            onClick={handleAddClick}
          >
            Add New
          </Button>
        </div>
      </div>

      <div className="border border-amber-300 rounded-lg p-4 shadow-md">
        <Table columns={columns} dataSource={filteredData} pagination={false} />
      </div>

      {/* Edit Modal */}
      <Modal
        title={
          <span className="text-amber-700 text-2xl font-semibold">
            Edit Sale Return
          </span>
        }
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          editForm.resetFields();
        }}
        footer={null}
        width={1000}
      >
        <Form
          form={editForm}
          layout="vertical"
          onValuesChange={(changedValues, allValues) =>
            handleValuesChange(changedValues, allValues, editForm)
          }
          onFinish={(values) => handleSubmit(values, "edit")}
        >
          {renderFormFields("edit", editForm)}

          <div className="flex justify-end gap-2 mt-6">
            <Button
              onClick={() => {
                setIsEditModalOpen(false);
                editForm.resetFields();
              }}
              className="border-amber-400! text-amber-700! hover:bg-amber-100!"
            >
              Cancel
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              className="bg-amber-500! hover:bg-amber-600! border-none!"
            >
              Update
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add Modal */}
      <Modal
        title={
          <span className="text-amber-700 text-2xl font-semibold">
            Add New Sale Return
          </span>
        }
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          addForm.resetFields();
        }}
        footer={null}
        width={1000}
      >
        <Form
          form={addForm}
          layout="vertical"
          onValuesChange={(changedValues, allValues) =>
            handleValuesChange(changedValues, allValues, addForm)
          }
          onFinish={(values) => handleSubmit(values, "add")}
        >
          {renderFormFields("add", addForm)}

          <div className="flex justify-end gap-2 mt-6">
            <Button
              onClick={() => {
                setIsAddModalOpen(false);
                addForm.resetFields();
              }}
              className="border-amber-400! text-amber-700! hover:bg-amber-100!"
            >
              Cancel
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              className="bg-amber-500! hover:bg-amber-600! border-none!"
            >
              Add
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={<span className="text-amber-700 text-2xl font-semibold">View Return</span>}
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false);
          viewForm.resetFields();
        }}
        footer={null}
        width={1000}
      >
        <Form form={viewForm} layout="vertical">
          {renderFormFields("view", viewForm)}
        </Form>
      </Modal>
    </div>
  );
}