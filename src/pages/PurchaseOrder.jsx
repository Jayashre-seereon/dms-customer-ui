import React, { useState, useMemo, useCallback } from "react";
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
  Tag,
  Divider,
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
import Wallet from "./Wallet";

// --- Mock Data (Unchanged) ---
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
      rate: 125,
    },
    {
      key: 2,
      orderGroupId: "ORD-2025-001", 
      contractNo: "SC-002",
      orderDate: "2025-10-01",
      companyName: "XYZ Refineries",
      customer: "Bhubaneswar Market",
      item: "Sunflower Oil",
      qty: 1000,
      uom: "Ltrs",
      location: "Warehouse A",
      deliveryDate: "2025-10-15",
      deliveryAddress: "Warehouse A, Bhubaneswar",
      status: "Approved",
      totalAmt: 110000,
      rate: 110,
    },
    {
      key: 3,
      orderGroupId: "ORD-2025-002",
      contractNo: "SC-003",
      orderDate: "2025-10-05",
      companyName: "PQR Traders",
      customer: "Cuttack Market",
      item: "Coconut Oil",
      qty: 500,
      uom: "Ltrs",
      location: "Warehouse B",
      deliveryDate: "2025-10-20",
      deliveryAddress: "Warehouse B, Cuttack",
      status: "Pending",
      totalAmt: 65000,
      rate: 130,
    },
    {
        key: 4,
        orderGroupId: "ORD-2025-002",
        contractNo: "SC-003",
        orderDate: "2025-10-05",
        companyName: "PQR Traders",
        customer: "Cuttack Market",
        item: "Palm Oil",
        qty: 300,
        uom: "Ltrs",
        location: "Warehouse B",
        deliveryDate: "2025-10-20",
        deliveryAddress: "Warehouse B, Cuttack",
        status: "Pending",
        totalAmt: 39000,
        rate: 130,
    },
  ],
  contractOptions: [
    {
      contractNo: "SC-001",
      companyName: "ABC Oils Ltd",
      customer: "Bhubaneswar Market",
      items: [
        { item: "Mustard Oil", uom: "Ltrs", restQty: 5000, rate: 125 },
        { item: "Palm Oil", uom: "Ltrs", restQty: 1500, rate: 125 },
      ],
    },
    {
      contractNo: "SC-002",
      companyName: "XYZ Refineries",
      customer: "Bhubaneswar Market",
      items: [
        { item: "Sunflower Oil", uom: "Ltrs", restQty: 3000, rate: 110 },
        { item: "Coconut Oil", uom: "Ltrs", restQty: 800, rate: 140 },
      ],
    },
    {
      contractNo: "SC-003",
      companyName: "PQR Traders",
      customer: "Cuttack Market",
      items: [
        { item: "Coconut Oil", uom: "Ltrs", restQty: 1200, rate: 130 },
        { item: "Palm Oil", uom: "Ltrs", restQty: 1200, rate: 130 },
      ],
    },
  ],
  uomOptions: ["Ltrs", "Kg"],
  statusOptions: ["Approved", "Pending", "Rejected"],
  locationOptions: ["Warehouse A", "Warehouse B", "Warehouse C"],
  companyOptions: ["ABC Oils Ltd", "XYZ Refineries", "PQR Traders"],
};

// --- Initial States and Helpers (Unchanged) ---
const emptyItem = { item: undefined, qty: 0, uom: undefined, rate: 0 };
const emptyContract = { contractNo: undefined, companyName: undefined, items: [emptyItem] };
const initialOrderGroup = {
  deliveryDate: dayjs().add(3, "day"),
  deliveryAddress: "",
  customer: undefined,
  location: undefined,
  contracts: [emptyContract],
};

/**
 * Groups the flat sales data by orderGroupId and contract.
 * @param {Array<Object>} flatData - The data array with one row per item/contract.
 * @returns {Array<Object>} Grouped data, with one entry per orderGroupId.
 */
const groupDataByOrderGroup = (flatData) => {
  const groups = flatData.reduce((acc, curr) => {
    const { orderGroupId, contractNo, item, qty, uom, rate, totalAmt, key, ...rest } = curr;

    if (!acc[orderGroupId]) {
      acc[orderGroupId] = {
        orderGroupId,
        key: orderGroupId, // Use orderGroupId as key for grouping
        orderDate: rest.orderDate,
        deliveryDate: rest.deliveryDate,
        deliveryAddress: rest.deliveryAddress,
        customer: rest.customer,
        location: rest.location,
        status: rest.status,
        totalItems: 0,
        totalAmount: 0,
        contracts: {},
        flatKeys: [], // Store keys for easy lookup later
      };
    }

    const group = acc[orderGroupId];

    if (!group.contracts[contractNo]) {
      group.contracts[contractNo] = {
        contractNo,
        companyName: rest.companyName,
        items: [],
      };
    }

    // Include the original flat key for updating the main data source
    group.contracts[contractNo].items.push({ item, qty, uom, rate, key });
    group.totalItems += qty;
    group.totalAmount += (rate || 0) * qty;
    group.flatKeys.push(key);

    return acc;
  }, {});

  return Object.values(groups).map(g => ({
      ...g,
      contracts: Object.values(g.contracts) // Convert contracts map to array for easier rendering
  }));
};

export default function SalesOrder() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrderGroup, setSelectedOrderGroup] = useState(null);
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [viewForm] = Form.useForm();
  const [walletOpen, setWalletOpen] = useState(false);

  const [data, setData] = useState(salesContractJSON.initialData); 
  const [searchText, setSearchText] = useState("");
  const [contractItemsMap, setContractItemsMap] = useState({});
  const [selectedItemMaxMap, setSelectedItemMaxMap] = useState({});

  const disablePastDates = (current) => current && current < dayjs().startOf("day");

  const groupedData = useMemo(() => groupDataByOrderGroup(data), [data]);

  const filteredData = groupedData.filter(
    (d) =>
      (d.customer || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (d.orderGroupId || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (d.status || "").toLowerCase().includes(searchText.toLowerCase()) ||
      d.contracts.some(c => c.contractNo.toLowerCase().includes(searchText.toLowerCase()) || c.companyName.toLowerCase().includes(searchText.toLowerCase()))
  );

  
  // --- Actions ---

  const openEditModal = (record) => {
    if (record.status === 'Approved') return;

    const fullGroup = groupedData.find(g => g.orderGroupId === record.orderGroupId);
    if (!fullGroup) return;

    const initialValues = {
      // **All editable header fields are correctly mapped here**
      customer: fullGroup.customer,
      location: fullGroup.location,
      deliveryAddress: fullGroup.deliveryAddress,
      deliveryDate: fullGroup.deliveryDate ? dayjs(fullGroup.deliveryDate) : null,
      
      orderGroupId: fullGroup.orderGroupId,
      orderDate: fullGroup.orderDate ? dayjs(fullGroup.orderDate) : null,
      
      contracts: fullGroup.contracts.map(contract => ({
        contractNo: contract.contractNo,
        companyName: contract.companyName,
        items: contract.items,
      })),
    };

    setSelectedOrderGroup(fullGroup);
    editForm.setFieldsValue(initialValues);
    setIsEditModalOpen(true);
  };

  const handleEditOrderGroupSubmit = (values) => {
    const { contracts, customer, location, deliveryDate, deliveryAddress, orderGroupId } = values;

    const updatedFlatRows = [];
    const updatedDeliveryDate = deliveryDate ? deliveryDate.format("YYYY-MM-DD") : undefined;

    const otherFlatRows = data.filter(item => item.orderGroupId !== orderGroupId);
    
    contracts.forEach(contract => {
        const { contractNo, items } = contract;
        const contractDetails = salesContractJSON.contractOptions.find(c => c.contractNo === contractNo);
        const companyName = contractDetails?.companyName;

        items.forEach(item => {
            if (!item || !item.item || !item.qty || Number(item.qty) <= 0) return;

            const originalRecord = selectedOrderGroup.contracts
                                    .flatMap(c => c.items)
                                    .find(i => i.key === item.key);

            if (!originalRecord) return; 

            updatedFlatRows.push({
                key: item.key, 
                orderGroupId,
                contractNo,
                companyName,
                customer, // Use updated customer from header
                item: item.item,
                qty: Number(item.qty),
                uom: item.uom,
                rate: item.rate,
                location, // Use updated location from header
                orderDate: selectedOrderGroup.orderDate,
                deliveryDate: updatedDeliveryDate, // Use updated delivery date from header
                deliveryAddress, // Use updated delivery address from header
                status: "Pending", 
                totalAmt: (item.rate || 0) * Number(item.qty)
            });
        });
    });

    if (updatedFlatRows.length === 0) {
        setIsEditModalOpen(false);
        return;
    }

    const finalData = [...otherFlatRows, ...updatedFlatRows];
    setData(finalData);

    setIsEditModalOpen(false);
    editForm.resetFields();
    setSelectedOrderGroup(null);
  };


  // --- Table Columns (Unchanged) ---

  const columns = [
    {
      title: <span className="text-amber-700 font-semibold">Order Group</span>,
      dataIndex: "orderGroupId",
      key: "orderGroupId",
      width: 140,
      render: (t) => <span className="text-amber-800 font-bold">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Customer</span>,
      dataIndex: "customer",
      key: "customer",
      width: 160,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
        title: <span className="text-amber-700 font-semibold">Contracts</span>,
        dataIndex: "contracts",
        key: "contracts",
        render: (contracts) => (
            <>
                {(contracts || []).map((c) => (
                    <Tag key={c.contractNo} color="volcano" className="mb-1">
                        {c.contractNo} - {c.companyName} ({c.items.length} items)
                    </Tag>
                ))}
            </>
        ),
    },
    {
      title: <span className="text-amber-700 font-semibold">Total Qty</span>,
      dataIndex: "totalItems",
      key: "totalItems",
      width: 100,
      render: (t) => <span className="text-amber-800">{t}</span>,
    },
    {
      title: <span className="text-amber-700 font-semibold">Status</span>,
      dataIndex: "status",
      key: "status",
      width: 120,
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
      key: "actions",
      width: 100,
      render: (record) => (
        <div className="flex gap-3">
          <EyeOutlined
            className="cursor-pointer! text-blue-500!"
            onClick={() => {
              setSelectedOrderGroup(record);
              setIsViewModalOpen(true);
            }}
          />
          {record.status !== "Approved" && (
            <EditOutlined
              className="cursor-pointer! text-red-500!"
              onClick={() => openEditModal(record)}
            />
          )}
        </div>
      ),
    },
  ];


  // --- Add Modal Handlers (PREFILL LOGIC CONFIRMED) ---

  const handleSelectContract = (contractNo, contractIndex) => {
    const c = salesContractJSON.contractOptions.find((x) => x.contractNo === contractNo);
    if (!c) return;
    setContractItemsMap((prev) => ({ ...prev, [contractIndex]: c.items || [] }));

    const orders = addForm.getFieldValue("contracts") || [];
    const updated = orders.map((entry, idx) =>
      idx === contractIndex
        // **This line ensures Company Name and Customer prefill when Contract No is selected**
        ? { ...entry, contractNo, companyName: c.companyName, customer: c.customer, items: [emptyItem] }
        : entry
    );
    addForm.setFieldsValue({ contracts: updated });
    setSelectedItemMaxMap((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((k) => {
        if (k.startsWith(`${contractIndex}-`)) delete copy[k];
      });
      return copy;
    });
  };

  const handleSelectItemInContract = (itemName, contractIndex, itemIndex) => {
    const items = contractItemsMap[contractIndex] || [];
    const sel = items.find((it) => it.item === itemName);
    if (!sel) {
      setSelectedItemMaxMap((p) => ({ ...p, [`${contractIndex}-${itemIndex}`]: 0 }));
      return;
    }
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

  const handleAddOrderGroupSubmit = (values) => {
    const headerDeliveryDate = values.deliveryDate ? values.deliveryDate.format("YYYY-MM-DD") : undefined;
    const deliveryAddress = values.deliveryAddress || "";
    const customer = values.customer || ""; 
    const location = values.location || "";
    const orderGroupId = `ORD-${dayjs().format("YYYYMMDD")}-${String(Date.now()).slice(-5)}`;

    const newRows = [];
    let baseKey = data.length ? data[data.length - 1].key : 0;
    let idx = 1;
    (values.contracts || []).forEach((contract) => {
      const contractNo = contract.contractNo;
      const contractDetails = salesContractJSON.contractOptions.find(c => c.contractNo === contractNo);
      const companyName = contractDetails?.companyName;
      
      (contract.items || []).forEach((it) => {
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
          totalAmt: (it.rate || 0) * Number(it.qty)
        });
        idx++;
      });
    });

    if (newRows.length === 0) {
      return;
    }

    setData((prev) => [...prev, ...newRows]);
    addForm.resetFields();
    setContractItemsMap({});
    setSelectedItemMaxMap({});
    setIsAddModalOpen(false);
  };


  // --- Render Functions ---
  
  // RENDER FOR ADD MODAL
  const renderItemsList = useCallback((contractIndex, fields, { add, remove }) =>
    fields.map((f) => (
      <div key={f.key} className="border! p-2! rounded! mb-2! relative! border-amber-300!">
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
              <Select placeholder="UOM" disabled>
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
              <InputNumber style={{ width: "100%" }} disabled />
            </Form.Item>
          </Col>

          <Col span={2}>
            <Button danger type="text" onClick={() => remove(f.name)} icon={<MinusCircleOutlined />} />
          </Col>
        </Row>
      </div>
    )), [contractItemsMap, selectedItemMaxMap, handleSelectItemInContract]);

  // RENDER FOR ADD MODAL 
  const renderContractsList = useCallback((fields, { add, remove }) =>
    fields.map((field) => {
        // Get the current contract item from the form state to ensure disabled fields show the value
        const contractDetails = addForm.getFieldValue(["contracts", field.name]);

        return (
            <div key={field.key} className="p-4 border border-amber-500 rounded-lg mb-4 relative">
                <h3 className="text-amber-700 font-semibold mb-2">Contract Details</h3>
                <Row gutter={12}>
                    <Col span={8}>
                        <Form.Item
                            name={[field.name, "contractNo"]}
                            fieldKey={[field.fieldKey, "contractNo"]}
                            label="Contract No"
                            rules={[{ required: true, message: "Select Contract" }]}
                        >
                            <Select 
                                placeholder="Select Contract" 
                                onChange={(val) => handleSelectContract(val, field.name)}
                            >
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
                            {/* FIX: Explicitly set the value for the disabled Input to ensure it pre-fills */}
                            <Input disabled value={contractDetails?.companyName}/> 
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name={[field.name, "customer"]} fieldKey={[field.fieldKey, "customer"]} label="Customer (from Contract)">
                            {/* FIX: Explicitly set the value for the disabled Input to ensure it pre-fills */}
                            <Input disabled value={contractDetails?.customer}/> 
                        </Form.Item>
                    </Col>
                </Row>
                <Divider className="my-2"/>
                <h4 className="text-amber-600 font-medium mb-2">Items</h4>

                <Form.List name={[field.name, "items"]}>
                    {(itemsFields, itemsOps) => (
                        <>
                            {renderItemsList(field.name, itemsFields, itemsOps)}
                            <div className="flex gap-2">
                                <Button type="dashed" onClick={() => itemsOps.add(emptyItem)} icon={<PlusOutlined />} className="border-amber-400! text-amber-700! hover:bg-amber-100!">
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
                            setContractItemsMap((prev) => {
                                const copy = { ...prev };
                                delete copy[field.name];
                                return copy;
                            });
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
        )
    }), [handleSelectContract, renderItemsList, addForm]);


    // RENDER FOR EDIT MODAL
   // ==== EDIT MODAL UI (Same as Add Modal UI but with edit logic) =====

const renderEditItemsList = useCallback((contractIndex, fields, { add, remove }) =>
  fields.map((f) => (
    <div key={f.key} className="border! p-2! rounded! mb-2! border-amber-300! relative!">
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
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const max = selectedItemMaxMap[`${contractIndex}-${f.name}`] || 99999;
                  if (!value || value <= 0) return Promise.reject("Qty must be > 0");
                  if (value > max) return Promise.reject(`Max allowed: ${max}`);
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={4}>
          <Form.Item name={[f.name, "uom"]} label="UOM">
            <Input disabled />
          </Form.Item>
        </Col>

        <Col span={4}>
          <Form.Item name={[f.name, "rate"]} label="Rate">
            <InputNumber disabled style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={2}>
          <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(f.name)} />
        </Col>
      </Row>
    </div>
  )),
[contractItemsMap, selectedItemMaxMap, handleSelectItemInContract]);


    // RENDER FOR EDIT MODAL (Contract details - read-only)
   const renderEditContractList = useCallback((fields, { add, remove }) =>
  fields.map((field) => {
    const contractDetails = editForm.getFieldValue(["contracts", field.name]);

    return (
      <div key={field.key} className="p-4 border border-amber-500 rounded-lg mb-4 relative">
        <h3 className="text-amber-700 font-semibold mb-2">Contract Details</h3>

        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name={[field.name, "contractNo"]}
              label="Contract No"
              rules={[{ required: true }]}
            >
              <Select onChange={(val) => handleSelectContract(val, field.name)}>
                {salesContractJSON.contractOptions.map((c) => (
                  <Select.Option key={c.contractNo} value={c.contractNo}>
                    {c.contractNo} — {c.companyName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name={[field.name, "companyName"]} label="Company">
              <Input disabled value={contractDetails?.companyName} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name={[field.name, "customer"]} label="Customer">
              <Input disabled value={contractDetails?.customer} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Form.List name={[field.name, "items"]}>
          {(itemsFields, itemsOps) => (
            <>
              {renderEditItemsList(field.name, itemsFields, itemsOps)}
              <Button type="dashed" icon={<PlusOutlined />} onClick={() => itemsOps.add()}>
                Add Item
              </Button>
            </>
          )}
        </Form.List>

        {fields.length > 1 && (
          <Button danger type="text" icon={<DeleteOutlined />} className="absolute top-2 right-2"
            onClick={() => remove(field.name)}>
            Remove Contract
          </Button>
        )}
      </div>
    );
  }),
[handleSelectContract, renderEditItemsList, editForm]);

    // VIEW Modal Content (Unchanged)
    function renderOrderGroupView(groupData) {
        if (!groupData) return null;

        const {
            orderGroupId,
            orderDate,
            deliveryDate,
            deliveryAddress,
            customer,
            location,
            status,
            totalItems,
            totalAmount,
            contracts,
        } = groupData;

        const itemColumns = [
            {
                title: 'Item',
                dataIndex: 'item',
                key: 'item',
                width: '30%',
            },
            {
                title: 'Qty',
                dataIndex: 'qty',
                key: 'qty',
                width: '20%',
            },
            {
                title: 'UOM',
                dataIndex: 'uom',
                key: 'uom',
                width: '15%',
            },
            {
                title: 'Rate',
                dataIndex: 'rate',
                key: 'rate',
                width: '15%',
            },
            {
                title: 'Total',
                key: 'total',
                render: (_, record) => (record.qty * record.rate).toFixed(2),
                width: '20%',
            }
        ];

        return (
            <div className="p-2">
                <h3 className="text-amber-700 font-bold text-xl mb-3">Order Group: {orderGroupId}</h3>
                <Row gutter={16} className="mb-4 text-amber-800">
                    <Col span={6}>
                        <div className="font-semibold">Customer:</div>
                        <div>{customer}</div>
                    </Col>
                    <Col span={6}>
                        <div className="font-semibold">Order Date:</div>
                        <div>{orderDate}</div>
                    </Col>
                    <Col span={6}>
                        <div className="font-semibold">Delivery Date:</div>
                        <div>{deliveryDate}</div>
                    </Col>
                    <Col span={6}>
                        <div className="font-semibold">Status:</div>
                        <Tag color={status === 'Approved' ? 'green' : 'yellow'} className="text-sm">{status}</Tag>
                    </Col>
                    <Col span={12} className="mt-2">
                        <div className="font-semibold">Delivery Address:</div>
                        <div>{deliveryAddress}</div>
                    </Col>
                    <Col span={6} className="mt-2">
                        <div className="font-semibold">Location:</div>
                        <div>{location}</div>
                    </Col>
                    <Col span={6} className="mt-2">
                        <div className="font-semibold">Total Quantity:</div>
                        <div>{totalItems}</div>
                    </Col>
                </Row>
                <Divider orientation="left" className="text-amber-700 font-semibold text-lg">
                    Contracts & Items ({contracts.length})
                </Divider>

                {contracts.map((contract, index) => (
                    <div key={contract.contractNo} className="mb-4 p-3 border border-amber-300 rounded-lg bg-amber-50">
                        <h4 className="text-amber-600 font-semibold mb-2">
                            Contract No: {contract.contractNo} - {contract.companyName}
                        </h4>
                        <Table
                            columns={itemColumns}
                            dataSource={contract.items.map((item, i) => ({ ...item, key: `${contract.contractNo}-${i}` }))}
                            pagination={false}
                            size="small"
                            rowKey="key"
                        />
                    </div>
                ))}

                <Divider className="my-2"/>
                <div className="text-right text-lg font-bold text-amber-700">
                    Grand Total Amount (Approx.): {totalAmount.toFixed(2)}
                </div>
            </div>
        );
    }
    
    // --- Main Render ---

    return (
        <div>
            {/* Header and Controls */}
            <div className="flex justify-between items-center mb-0">
                <div>
                    <h1 className="text-3xl font-bold text-amber-700">Purchase Order</h1>
                    <p className="text-amber-600">Manage your purchase Order easily</p>
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

            {/* Main Table (Grouped by Order Group) */}
            <div className="border border-amber-300 rounded-lg p-4 shadow-md">
                <Table 
                    columns={columns} 
                    dataSource={filteredData} 
                    pagination={false} 
                    scroll={{ y: 350 }} 
                    rowKey="orderGroupId"
                />
            </div>

            {/* Add modal (Order Group) */}
            <Modal title={<span className="text-amber-700 font-semibold">Add Purchase Order (Order Group)</span>} open={isAddModalOpen} onCancel={() => setIsAddModalOpen(false)} footer={null} width={1100} destroyOnClose>
                <Form layout="vertical" form={addForm} onFinish={handleAddOrderGroupSubmit} initialValues={{ ...initialOrderGroup }}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item label="Customer (Order Group)" name="customer" rules={[{ required: true }]}>
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
                                    <Button type="dashed" onClick={() => ops.add(emptyContract)} icon={<PlusOutlined />} className="border-amber-400! text-amber-700! hover:bg-amber-100!">
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

            {/* Edit modal (Grouped Edit) */}
         <Modal
  title="Edit Order Group"
  open={isEditModalOpen}
  onCancel={() => setIsEditModalOpen(false)}
  width={900}
  footer={[
    <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>,
    <Button type="primary" onClick={() => editForm.submit()} className="bg-amber-600! border-none!">
      Update
    </Button>,
  ]}
>
  <Form form={editForm} layout="vertical" onFinish={handleEditOrderGroupSubmit}>
    <Row gutter={12}>
      <Col span={8}>
        <Form.Item name="customer" label="Customer" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item name="location" label="Location" rules={[{ required: true }]}>
          <Select>
            {salesContractJSON.locationOptions.map((l) => (
              <Select.Option key={l} value={l}>{l}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item name="deliveryDate" label="Delivery Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} disabledDate={disablePastDates} />
        </Form.Item>
      </Col>
    </Row>

    <Form.Item name="deliveryAddress" label="Delivery Address" rules={[{ required: true }]}>
      <Input.TextArea />
    </Form.Item>

    <Divider className="my-3" />

    <Form.List name="contracts">{renderEditContractList}</Form.List>
  </Form>
</Modal>


            {/* View modal (Grouped View) */}
            <Modal title={<span className="text-amber-700 text-2xl font-semibold">View Purchase Order Group</span>} open={isViewModalOpen} onCancel={() => setIsViewModalOpen(false)} footer={null} width={900} destroyOnClose>
                {renderOrderGroupView(selectedOrderGroup)}
            </Modal>

            {/* Wallet */}
            <Modal open={walletOpen} title={<span className="text-3xl font-bold text-amber-700">Wallet</span>} footer={null} width={1100} onCancel={() => setWalletOpen(false)}>
                <Wallet />
            </Modal>
        </div>
    );
}