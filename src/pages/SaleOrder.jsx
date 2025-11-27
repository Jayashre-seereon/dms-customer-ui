// SalesOrder.jsx
import React, { useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Select,
  InputNumber,
  DatePicker,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  FilterOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Wallet from "../pages/Wallet";

const salesContractJSON = {
  initialData: [
    {
      key: 1,
      orderGroupId: "ORD-2025-001",
      contractNo: "SC-001",
      orderDate: "2025-10-01",
      companyName: "ABC Oils Ltd",
      customer: "Bhubaneswar Market",
      item: "Mustard Oil",
      qty: 2000,
      uom: "Ltrs",
      location: "Warehouse A",
      deliveryDate: "2025-10-15",
      deliveryAddress: "Warehouse A, Bhubaneswar",
      status: "Approved",
      totalAmt: 250000,
    },
  ],
  contractOptions: [
    {
      contractNo: "SC-001",
      companyName: "ABC Oils Ltd",
      customer: "Bhubaneswar Market",
      items: [
        { item: "Mustard Oil", uom: "Ltrs", restQty: 5000, rate: 120 },
        { item: "Palm Oil", uom: "Ltrs", restQty: 1500, rate: 125 },
      ],
    },
    {
      contractNo: "SC-002",
      companyName: "XYZ Refineries",
      customer: "Cuttack Wholesale",
      items: [
        { item: "Sunflower Oil", uom: "Ltrs", restQty: 3000, rate: 110 },
        { item: "Coconut Oil", uom: "Ltrs", restQty: 800, rate: 140 },
      ],
    },
    {
      contractNo: "SC-003",
      companyName: "PQR Traders",
      customer: "Berhampur Dealers",
      items: [{ item: "Coconut Oil", uom: "Ltrs", restQty: 1200, rate: 130 }],
    },
  ],
  uomOptions: ["Ltrs", "Kg"],
  statusOptions: ["Approved", "Pending", "Rejected"],
  locationOptions: ["Warehouse A", "Warehouse B", "Warehouse C"],
  companyOptions: ["ABC Oils Ltd", "XYZ Refineries", "PQR Traders"],
};

const emptyItem = { item: undefined, qty: 0, uom: undefined, rate: 0 };
const emptyContract = { contractNo: undefined, companyName: undefined, items: [emptyItem] };
const initialOrderGroup = {
  deliveryDate: dayjs().add(3, "day"),
  deliveryAddress: "",
  customer: undefined,
  location: undefined,
  contracts: [emptyContract],
};

export default function SalesOrder() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [viewForm] = Form.useForm();
  const [walletOpen, setWalletOpen] = useState(false);

  const [data, setData] = useState(salesContractJSON.initialData);
  const [searchText, setSearchText] = useState("");

  // maps "orderIdx-contractIdx" -> items[] available for that contract
  const [contractItemsMap, setContractItemsMap] = useState({});
  // maps "orderIdx-contractIdx-itemIdx" -> restQty (current selected item's available max)
  const [selectedItemMaxMap, setSelectedItemMaxMap] = useState({});

  const disablePastDates = (current) => current && current < dayjs().startOf("day");

  // Flattened table filter
  const filteredData = data.filter(
    (d) =>
      (d.companyName || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (d.customer || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (d.item || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (d.status || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (d.contractNo || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (d.orderGroupId || "").toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: <span className="text-amber-700 font-semibold">Order Group</span>,
      dataIndex: "orderGroupId",
      width: 140,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Contract No</span>,
      dataIndex: "contractNo",
      width: 110,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Company</span>,
      dataIndex: "companyName",
      width: 160,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    // {
    //   title: <span className="text-amber-700 font-semibold">Customer</span>,
    //   dataIndex: "customer",
    //   width: 160,
    //   render: (t) => <span className="text-amber-800">{t}</span>,
    // },
    // {
    //   title: <span className="text-amber-700 font-semibold">Delivery Date</span>,
    //   dataIndex: "deliveryDate",
    //   width: 120,
    //   render: (t) => <span className="text-amber-800">{t}</span>,
    // },
    // {
    //   title: <span className="text-amber-700 font-semibold">Delivery Address</span>,
    //   dataIndex: "deliveryAddress",
    //   width: 240,
    //   render: (t) => <span className="text-amber-800">{t}</span>,
    // },
    {
      title: <span className="text-amber-700 font-semibold">Item</span>,
      dataIndex: "item",
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Qty</span>,
      render: (_, r) => (
        <span className="text-amber-800">
          {r.qty} {r.uom}
        </span>
      ),
    },
    {
      title: <span className="text-amber-700 font-semibold">Status</span>,
      dataIndex: "status",
      render: (status) => {
        const base = "px-3 py-1 rounded-full text-sm font-semibold";
        if (status === "Approved")
          return <span className={`${base} bg-green-100 text-green-700`}>Approved</span>;
        if (status === "Pending")
          return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
        return <span className={`${base} bg-red-100 text-red-700`}>{status}</span>;
      },
    },
    {
      title: <span className="text-amber-700 font-semibold">Actions</span>,
      render: (record) => (
        <div className="flex gap-3">
          <EyeOutlined
            className="cursor-pointer! text-blue-500!"
            onClick={() => {
              setSelectedRecord(record);
              viewForm.setFieldsValue({
                ...record,
                orderDate: record.orderDate ? dayjs(record.orderDate) : null,
                deliveryDate: record.deliveryDate ? dayjs(record.deliveryDate) : null,
              });
              setIsViewModalOpen(true);
            }}
          />
          {record.status !== "Approved" && (
            <EditOutlined
              className="cursor-pointer! text-red-500!"
              onClick={() => {
                setSelectedRecord(record);
                editForm.setFieldsValue({
                  ...record,
                  orderDate: record.orderDate ? dayjs(record.orderDate) : null,
                  deliveryDate: record.deliveryDate ? dayjs(record.deliveryDate) : null,
                });
                setIsEditModalOpen(true);
              }}
            />
          )}
        </div>
      ),
    },
  ];

  // When selecting a contract for a contract-entry inside the orderGroup (orderIdx=0 since single group),
  // we populate the contractItemsMap for that contract slot and auto-fill company/customer.
  const handleSelectContract = (contractNo, contractIndex) => {
    const c = salesContractJSON.contractOptions.find((x) => x.contractNo === contractNo);
    if (!c) return;

    // store available items for this contract slot keyed by contractIndex (single order group)
    setContractItemsMap((prev) => ({ ...prev, [contractIndex]: c.items || [] }));

    // update the form: set companyName and customer for that contract item set
    const orders = addForm.getFieldValue("contracts") || [];
    const updated = orders.map((entry, idx) =>
      idx === contractIndex
        ? { ...entry, contractNo, companyName: c.companyName, customer: c.customer, items: [emptyItem] }
        : entry
    );
    addForm.setFieldsValue({ contracts: updated });
    // reset selectedItemMaxMap for that contract
    setSelectedItemMaxMap((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((k) => {
        if (k.startsWith(`${contractIndex}-`)) delete copy[k];
      });
      return copy;
    });
  };

  // When selecting an item inside a specific contract-index and item-index we set the max available.
  const handleSelectItemInContract = (itemName, contractIndex, itemIndex) => {
    const items = contractItemsMap[contractIndex] || [];
    const sel = items.find((it) => it.item === itemName);
    if (!sel) {
      setSelectedItemMaxMap((p) => ({ ...p, [`${contractIndex}-${itemIndex}`]: 0 }));
      return;
    }
    // set uom/rate/available and reset qty to 0 in that item form
    const contracts = addForm.getFieldValue("contracts") || [];
    const updatedContracts = contracts.map((c, ci) => {
      if (ci !== contractIndex) return c;
      const updatedItems = (c.items || []).map((it, ii) =>
        ii === itemIndex ? { ...it, item: sel.item, uom: sel.uom, rate: sel.rate, qty: 0 } : it
      );
      return { ...c, items: updatedItems };
    });
    addForm.setFieldsValue({ contracts: updatedContracts });

    setSelectedItemMaxMap((prev) => ({ ...prev, [`${contractIndex}-${itemIndex}`]: sel.restQty || 0 }));
  };

  // Submit the order group: flatten contract->items into table rows and assign same header fields
  const handleAddOrderGroupSubmit = (values) => {
    // values: { deliveryDate, deliveryAddress, customer, location, contracts: [{contractNo, companyName, items:[{item, qty, uom, rate}]}] }
    const headerDeliveryDate = values.deliveryDate ? values.deliveryDate.format("YYYY-MM-DD") : undefined;
    const deliveryAddress = values.deliveryAddress || "";
    const customer = values.customer || "";
    const location = values.location || "";

    // generate simple orderGroupId
    const orderGroupId = `ORD-${dayjs().format("YYYYMMDD")}-${String(Date.now()).slice(-5)}`;

    const newRows = [];
    const baseKey = data.length ? data[data.length - 1].key : 0;
    let idx = 1;
    (values.contracts || []).forEach((contract) => {
      const contractNo = contract.contractNo;
      const companyName = contract.companyName;
      (contract.items || []).forEach((it) => {
        // ignore items with zero qty or no item selected
        if (!it || !it.item || !it.qty || Number(it.qty) <= 0) return;
        newRows.push({
          key: baseKey + idx,
          orderGroupId,
          contractNo,
          companyName,
          customer,
          item: it.item,
          qty: Number(it.qty),
          uom: it.uom,
          rate: it.rate,
          location,
          orderDate: dayjs().format("YYYY-MM-DD"),
          deliveryDate: headerDeliveryDate,
          deliveryAddress,
          status: "Pending",
        });
        idx++;
      });
    });

    if (newRows.length === 0) {
      // nothing to add
      return;
    }

    setData((prev) => [...prev, ...newRows]);
    addForm.resetFields();
    setContractItemsMap({});
    setSelectedItemMaxMap({});
    setIsAddModalOpen(false);
  };

  // Render the nested Form.List for items inside a contract
  const renderItemsList = (contractIndex, fields, { add, remove }) =>
    fields.map((f) => (
      <div key={f.key} className="border p-2 rounded mb-2 relative">
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name={[f.name, "item"]}
              fieldKey={[f.fieldKey, "item"]}
              label="Item"
              rules={[{ required: true, message: "Select item" }]}
            >
              <Select
                placeholder="Select item"
                onChange={(val) => handleSelectItemInContract(val, contractIndex, f.name)}
              >
                {(contractItemsMap[contractIndex] || []).map((it) => (
                  <Select.Option key={it.item} value={it.item}>
                    {it.item} — available: {it.restQty} {it.uom}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name={[f.name, "qty"]}
              fieldKey={[f.fieldKey, "qty"]}
              label="Qty"
              rules={[
                { required: true, message: "Enter qty" },
                {
                  validator: (_, value) => {
                    const max = selectedItemMaxMap[`${contractIndex}-${f.name}`] || 0;
                    if (!value || Number(value) <= 0) return Promise.reject(new Error("Qty must be > 0"));
                    if (value > max) return Promise.reject(new Error(`Qty cannot exceed available ${max}`));
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item name={[f.name, "uom"]} fieldKey={[f.fieldKey, "uom"]} label="UOM" rules={[{ required: true }]}>
              <Select placeholder="UOM">
                {salesContractJSON.uomOptions.map((u) => (
                  <Select.Option key={u} value={u}>
                    {u}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item name={[f.name, "rate"]} fieldKey={[f.fieldKey, "rate"]} label="Rate">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={2}>
            <Button danger type="text" onClick={() => remove(f.name)} icon={<MinusCircleOutlined />} />
          </Col>
        </Row>
      </div>
    ));

  // Render contract blocks (repeatable contracts within the order group)
  const renderContractsList = (fields, { add, remove }) =>
    fields.map((field) => (
      <div key={field.key} className="border border-amber-200 rounded-lg p-3 mb-3 relative">
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name={[field.name, "contractNo"]}
              fieldKey={[field.fieldKey, "contractNo"]}
              label="Contract No"
              rules={[{ required: true, message: "Select Contract" }]}
            >
              <Select placeholder="Select Contract" onChange={(val) => handleSelectContract(val, field.name)}>
                {salesContractJSON.contractOptions.map((c) => (
                  <Select.Option key={c.contractNo} value={c.contractNo}>
                    {c.contractNo} — {c.companyName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name={[field.name, "companyName"]} fieldKey={[field.fieldKey, "companyName"]} label="Company" >
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name={[field.name, "customer"]} fieldKey={[field.fieldKey, "customer"]} label="Customer">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Form.List name={[field.name, "items"]}>
          {(itemsFields, itemsOps) => (
            <>
              {renderItemsList(field.name, itemsFields, itemsOps)}
              <div className="flex gap-2">
                <Button type="dashed" onClick={() => itemsOps.add(emptyItem)} icon={<PlusOutlined />}>
                  Add Item
                </Button>
              </div>
            </>
          )}
        </Form.List>

        {fields.length > 1 && (
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            className="absolute top-2 right-2 text-red-500"
            onClick={() => {
              // cleanup associated maps for this contract index
              setContractItemsMap((prev) => {
                const copy = { ...prev };
                delete copy[field.name];
                return copy;
              });
              // remove any selectedItemMaxMap keys that start with this contractIndex
              setSelectedItemMaxMap((prev) => {
                const copy = { ...prev };
                Object.keys(copy).forEach((k) => {
                  if (k.startsWith(`${field.name}-`)) delete copy[k];
                });
                return copy;
              });
              remove(field.name);
            }}
          >
            Remove Contract
          </Button>
        )}
      </div>
    ));

  // Basic view/edit single row fields (unchanged)
  function renderBasicFields(disabled = false) {
    return (
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Contract No" name="contractNo" rules={[{ required: true }]}>
            <Select placeholder="Select Contract" disabled={disabled}>
              {salesContractJSON.contractOptions.map((c) => (
                <Select.Option key={c.contractNo} value={c.contractNo}>
                  {c.contractNo}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Order Date" name="orderDate" rules={[{ required: true }]}>
            <DatePicker className="w-full" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Company " name="companyName" rules={[{ required: true }]}>
            <Input placeholder="Company" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Customer Name" name="customer" rules={[{ required: true }]}>
            <Input placeholder="Customer" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Item Name" name="item" rules={[{ required: true }]}>
            <Input placeholder="Item" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Quantity" name="qty" rules={[{ required: true, type: "number", min: 1 }]}>
            <Input className="w-full" min={1} disabled={disabled} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="UOM" name="uom" rules={[{ required: true }]}>
            <Select placeholder="Select UOM" disabled={disabled}>
              {salesContractJSON.uomOptions.map((u) => (
                <Select.Option key={u} value={u}>
                  {u}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Location" name="location" rules={[{ required: true }]}>
            <Select placeholder="Select Location" disabled={disabled}>
              {salesContractJSON.locationOptions.map((loc) => (
                <Select.Option key={loc} value={loc}>
                  {loc}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Delivery Date" name="deliveryDate" rules={[{ required: true }]}>
            <DatePicker className="w-full" disabled={disabled} disabledDate={disablePastDates} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Status" name="status">
            <Input disabled value={disabled ? selectedRecord?.status : "Pending"} />
          </Form.Item>
        </Col>
      </Row>
    );
  }

  function renderApprovedView() {
    if (!selectedRecord) return null;
    return (
      <div>
        <h6 className=" text-amber-500 font-bold text-lg mb-2 mt-4">Basic Info</h6>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Order Group">
              <Input value={selectedRecord.orderGroupId} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Contract No">
              <Input value={selectedRecord.contractNo} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Order Date">
              <Input value={selectedRecord.orderDate} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Delivery Date">
              <Input value={selectedRecord.deliveryDate} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Delivery Address">
              <Input value={selectedRecord.deliveryAddress} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Company">
              <Input value={selectedRecord.companyName} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Customer Name">
              <Input value={selectedRecord.customer} disabled />
            </Form.Item>
          </Col>
        </Row>

        <h6 className=" text-amber-500 font-bold text-lg mb-2 mt-4">Item & Quantity</h6>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Item">
              <Input value={selectedRecord.item} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Qty">
              <Input value={selectedRecord.qty} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="UOM">
              <Input value={selectedRecord.uom} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Location">
              <Input value={selectedRecord.location} disabled />
            </Form.Item>
          </Col>
        </Row>

        <h6 className=" text-amber-500 font-bold text-lg mb-2 mt-4">Status & Others</h6>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Status">
              <Input value={selectedRecord.status} disabled />
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-0">
        <div>
          <h1 className="text-3xl font-bold text-amber-700">Sales Order</h1>
          <p className="text-amber-600">Manage your sales Order easily</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <Input
            prefix={<SearchOutlined className="text-amber-600!" />}
            placeholder="Search"
            className="w-full sm:w-80! border-amber-300! focus:border-amber-500! rounded-lg"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button icon={<FilterOutlined />} onClick={() => setSearchText("")} className="border-amber-400! text-amber-700! hover:bg-amber-100!">
            Reset Search
          </Button>
        </div>
        <div className="flex gap-2">
          <Button className="border-amber-400! text-amber-700! hover:bg-amber-100!" onClick={() => setWalletOpen(true)}>
            Wallet
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-amber-500! hover:bg-amber-600! border-none!"
            onClick={() => {
              addForm.resetFields();
              addForm.setFieldsValue({ ...initialOrderGroup });
              setContractItemsMap({});
              setSelectedItemMaxMap({});
              setIsAddModalOpen(true);
            }}
          >
            Add New
          </Button>
          <Button icon={<DownloadOutlined />} className="border-amber-400! text-amber-700! hover:bg-amber-100!">
            Export
          </Button>
        </div>
      </div>

      <div className="border border-amber-300 rounded-lg p-4 shadow-md">
        <Table columns={columns} dataSource={filteredData} pagination={false} scroll={{ y: 350 }} rowKey="key" />
      </div>

      {/* Add modal: Order Group header + contracts (repeatable) + items (repeatable per contract) */}
      <Modal title={<span className="text-amber-700 font-semibold">Add Sales Order (Order Group)</span>} open={isAddModalOpen} onCancel={() => setIsAddModalOpen(false)} footer={null} width={1100} destroyOnClose>
        <Form layout="vertical" form={addForm} onFinish={handleAddOrderGroupSubmit} initialValues={{ ...initialOrderGroup }}>
          {/* Shared header fields */}
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Customer" name="customer" rules={[{ required: true }]}>
                <Input placeholder="Customer for entire order" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Location" name="location" rules={[{ required: true }]}>
                <Select placeholder="Select Location">
                  {salesContractJSON.locationOptions.map((loc) => (
                    <Select.Option key={loc} value={loc}>
                      {loc}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Delivery Date" name="deliveryDate" rules={[{ required: true }]}>
                <DatePicker className="w-full" disabledDate={disablePastDates} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Delivery Address" name="deliveryAddress" rules={[{ required: true }]}>
                <Input placeholder="Delivery address (applies to all contracts/items)" />
              </Form.Item>
            </Col>
          </Row>

          {/* Contracts list */}
          <Form.List name="contracts">
            {(fields, ops) => (
              <>
                {renderContractsList(fields, ops)}
                <div className="flex justify-between mt-3">
                  <Button type="dashed" onClick={() => ops.add(emptyContract)} icon={<PlusOutlined />}>
                    Add Contract
                  </Button>
                  <Button type="primary" htmlType="submit" className="bg-amber-500! hover:bg-amber-600! border-none!">
                    Submit Order Group
                  </Button>
                </div>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* Edit modal (unchanged single-row edit) */}
      <Modal title={<span className="text-amber-700 font-semibold">Edit Sales Order</span>} open={isEditModalOpen} onCancel={() => setIsEditModalOpen(false)} footer={null} width={800} destroyOnClose>
        <Form layout="vertical" form={editForm} onFinish={(values) => {
          const contractData = salesContractJSON.contractOptions.find((c) => c.contractNo === values.contractNo);
          const payload = {
            ...selectedRecord,
            ...values,
            orderDate: values.orderDate ? values.orderDate.format("YYYY-MM-DD") : selectedRecord.orderDate,
            deliveryDate: values.deliveryDate ? values.deliveryDate.format("YYYY-MM-DD") : selectedRecord.deliveryDate,
            status: "Pending",
            companyName: contractData?.companyName,
            customer: contractData?.customer,
            item: values.item || contractData?.items?.[0]?.item,
          };
          setData((prev) => prev.map((item) => (item.key === selectedRecord.key ? { ...item, ...payload } : item)));
          setIsEditModalOpen(false);
          editForm.resetFields();
        }}>
          {renderBasicFields(false)}
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsEditModalOpen(false)} className="border-amber-400! text-amber-700! hover:bg-amber-100!">Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-amber-500! hover:bg-amber-600! border-none!">Update</Button>
          </div>
        </Form>
      </Modal>

      {/* View modal */}
      <Modal title={<span className="text-amber-700 text-2xl font-semibold">View Sales Order</span>} open={isViewModalOpen} onCancel={() => setIsViewModalOpen(false)} footer={null} width={900} destroyOnClose>
        <Form layout="vertical" form={viewForm}>
          {selectedRecord?.status === "Approved" ? renderApprovedView() : renderBasicFields(true)}
        </Form>
      </Modal>

      {/* Wallet */}
      <Modal open={walletOpen} title={<span className="text-3xl font-bold text-amber-700">Wallet</span>} footer={null} width={1100} onCancel={() => setWalletOpen(false)}>
        <Wallet />
      </Modal>
    </div>
  );
}
