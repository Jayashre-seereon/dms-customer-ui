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
  InputNumber,
  Space,
  notification,
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
  RollbackOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// --- 🔹 Simplified JSON Data (Kept as provided) ---
const saleReturnJSON = {
  // Grouped by invoice/order to mimic source data
  sourceInvoices: [
    {
      invoiceNo: "INV-001",
      orderNo: "ORD-001",
      customer: "Ramesh",
      returnDate: "2024-04-01",
      status: "Approved",
      companyName: "Odisha Edibles",
      plantName: "p1",
      items: [
        {
          key: "item-1-1",
          item: "Sunflower Oil",
          quantity: 50, // This is the return quantity
          uom: "Ltr",
          rate: 500,
          returnReason: "Damaged Packaging",
          itemCode: "code1",
          itemGroup: "G1",
          hsnCode: "hsn1",
        },
      ],
    },
    {
      invoiceNo: "INV-002",
      orderNo: "ORD-002",
      customer: "Suresh",
      returnDate: "2024-04-15",
      status: "Pending",
      companyName: "Kalinga Oil Mills",
      plantName: "p2",
      items: [
        {
          key: "item-2-1",
          item: "Rice Bran Oil",
          quantity: 20,
          uom: "Kg",
          rate: 600,
          returnReason: "Quality Issue",
          itemCode: "code2",
          itemGroup: "G2",
          hsnCode: "hsn2",
        },
        {
          key: "item-2-2",
          item: "Mustard Oil", // Second item in the same invoice for a better demo
          quantity: 10,
          uom: "Ltr",
          rate: 450,
          returnReason: "Wrong Item",
          itemCode: "code3",
          itemGroup: "G3",
          hsnCode: "hsn3",
        },
      ],
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
    // Expanded item options for the Add modal item selection (Lookup data)
    allItemOptions: [
      {
        item: "Sunflower Oil",
        uom: "Ltr",
        rate: 500,
        itemCode: "code1",
        itemGroup: "G1",
        hsnCode: "hsn1",
      },
      {
        item: "Rice Bran Oil",
        uom: "Kg",
        rate: 600,
        itemCode: "code2",
        itemGroup: "G2",
        hsnCode: "hsn2",
      },
      {
        item: "Mustard Oil",
        uom: "Ltr",
        rate: 450,
        itemCode: "code3",
        itemGroup: "G3",
        hsnCode: "hsn3",
      },
      {
        item: "Palm Oil",
        uom: "Kg",
        rate: 300,
        itemCode: "code4",
        itemGroup: "G4",
        hsnCode: "hsn4",
      },
    ],
  },
};

// Flatten the data for the main table view
const getFlatRecords = (data) =>
  data.sourceInvoices.flatMap((invoice) =>
    invoice.items.map((item) => ({
      ...invoice,
      ...item,
      key: item.key || `${invoice.invoiceNo}-${item.itemCode}`, // Ensure a unique key
      // Calculate totals for table
      totalAmount: (item.quantity * item.rate).toFixed(2),
      grandTotal: (item.quantity * item.rate).toFixed(2), // Simplifed grand total
    }))
  );

// --- LOGIC: Calculate Row Spans for Grouping ---
const getMergedRecords = (flatRecords) => {
  // 1. Group by invoiceNo to find the size of each group
  const invoiceGroups = flatRecords.reduce((acc, curr) => {
    const key = curr.invoiceNo;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(curr);
    return acc;
  }, {});

  // 2. Create a final flat list with rowSpan info
  return Object.values(invoiceGroups).flatMap((itemsInInvoice) => {
    const invoiceLength = itemsInInvoice.length;
    return itemsInInvoice.map((item, index) => {
      // Only the first item in the group gets a rowSpan equal to the group size.
      // All other items get a rowSpan of 0 (to hide them).
      const rowSpan = index === 0 ? invoiceLength : 0;

      return {
        ...item,
        invoiceRowSpan: rowSpan, // Property used in onCell
      };
    });
  });
};

// 🔹 Simplified Calculation Logic (Per Item)
const calculateTotals = (itemValues) => {
  const qty = parseFloat(itemValues.quantity || 0);
  const rate = parseFloat(itemValues.rate || 0);

  const totalAmount = qty * rate;

  return {
    totalAmount: Number(totalAmount.toFixed(2)),
    grandTotal: Number(totalAmount.toFixed(2)), // Simple for this demo
  };
};

/**
 * NEW COMPONENT: Focuses on allowing multiple invoices to be added at once.
 */
export default function MultiInvoiceSaleReturn() {
  // Main state for all invoices (like the original component)
  const [invoices, setInvoices] = useState(saleReturnJSON.sourceInvoices);
  const [records, setRecords] = useState(() => getFlatRecords(saleReturnJSON));
  const [filteredData, setFilteredData] = useState([]);
  const [mergedData, setMergedData] = useState([]);

  // Modals and Forms
  const [searchText, setSearchText] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null); // Used for View/Edit
  const [isMultiAddModalOpen, setIsMultiAddModalOpen] = useState(false); // NEW: For multi-add
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Kept for editing existing
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Kept for viewing existing

  const [multiAddForm] = Form.useForm(); // NEW: Form for multi-add
  const [editForm] = Form.useForm();
  const [viewForm] = Form.useForm();

  // Update records (flat list for filtering/searching) whenever invoices change
  useEffect(() => {
    setRecords(getFlatRecords({ sourceInvoices: invoices }));
  }, [invoices]);

  // Handle Search Filtering
  useEffect(() => {
    const val = searchText.toLowerCase();
    const result = records.filter((item) =>
      Object.values(item).some((v) => String(v).toLowerCase().includes(val))
    );
    setFilteredData(result);
  }, [searchText, records]);

  // Calculate Merged Data for Table Display
  useEffect(() => {
    setMergedData(getMergedRecords(filteredData));
  }, [filteredData]);

  // Handler for calculating totals & auto-filling fields
  const handleItemValuesChange = (changedValues, allValues, targetForm) => {
    // --- Existing Single Invoice Logic (Modified to accept a targetForm) ---

    // Look for changes within the main 'invoices' Form.List
    const invoicesPath = changedValues && Object.keys(changedValues)[0];
    if (!invoicesPath || !invoicesPath.startsWith("invoices")) {
        // Fallback for single item update in edit form, or initial load
        // This is complex, but for the multi-form, we focus on the invoices path
        // For the Edit form (non-multi), the original logic applies directly to the 'items' list
        if (targetForm === editForm) {
             const itemsPath = changedValues && Object.keys(changedValues)[0];
             if (itemsPath && itemsPath.startsWith("items")) {
                const itemIndex = parseInt(itemsPath.split(".")[1]);
                const itemKey = itemsPath.split(".")[2];
                const currentItems = allValues.items;

                // Handle item selection/change to auto-fill derived fields
                if (itemKey === 'item' && currentItems[itemIndex]?.item) {
                    const selectedItem = saleReturnJSON.options.allItemOptions.find(
                        (opt) => opt.item === currentItems[itemIndex].item
                    );
                    if (selectedItem) {
                        const defaultQty = currentItems[itemIndex].quantity || 1;
                        const totals = calculateTotals({ ...selectedItem, quantity: defaultQty });

                        const updatedItems = currentItems.map((item, index) =>
                            index === itemIndex
                            ? {
                                ...item,
                                ...selectedItem,
                                quantity: defaultQty,
                                totalAmount: totals.totalAmount,
                                grandTotal: totals.grandTotal,
                                }
                            : item
                        );
                        targetForm.setFieldsValue({ items: updatedItems });
                        return;
                    }
                }
                // Handle quantity/rate change (recalculate totals)
                if (itemKey === "quantity" || itemKey === "rate") {
                    const itemValues = currentItems[itemIndex];
                    const totals = calculateTotals(itemValues);

                    targetForm.setFieldsValue({
                    items: currentItems.map((item, index) =>
                        index === itemIndex ? { ...item, totalAmount: totals.totalAmount, grandTotal: totals.grandTotal } : item
                    ),
                    });
                }
             }
             return;
        }
        return; // Exit if not in the new multi-add flow
    }

    // --- NEW Multi-Add Logic ---

    // Example path: "invoices[0].items[0].item"
    const invoiceIndex = parseInt(invoicesPath.split("[")[1].split("]")[0]);
    const remainingPath = invoicesPath.split("].")[1];
    
    // Check for item-level changes inside a specific invoice
    if (remainingPath && remainingPath.startsWith("items")) {
      const itemIndex = parseInt(remainingPath.split("[")[1].split("]")[0]);
      const itemKey = remainingPath.split("].")[1];

      const currentInvoices = allValues.invoices;
      const currentItems = currentInvoices[invoiceIndex].items;

      // Check if 'item' field was changed (i.e., item selection changed)
      if (itemKey === 'item' && currentItems[itemIndex]?.item) {
        const selectedItem = saleReturnJSON.options.allItemOptions.find(
          (opt) => opt.item === currentItems[itemIndex].item
        );
        
        if (selectedItem) {
          const defaultQty = currentItems[itemIndex].quantity || 1;
          const totals = calculateTotals({ ...selectedItem, quantity: defaultQty });

          const updatedItems = currentItems.map((item, index) =>
            index === itemIndex
              ? {
                  ...item,
                  ...selectedItem, // <-- Fills Item Code, Group, HSN, UOM, Rate
                  quantity: defaultQty,
                  totalAmount: totals.totalAmount,
                  grandTotal: totals.grandTotal,
                }
              : item
          );
          
          // Must update the entire 'invoices' array field value
          const updatedInvoices = currentInvoices.map((inv, idx) => 
            idx === invoiceIndex ? { ...inv, items: updatedItems } : inv
          );

          targetForm.setFieldsValue({ invoices: updatedInvoices });
          return;
        }
      }

      // Handle quantity/rate change (recalculate totals)
      if (itemKey === "quantity" || itemKey === "rate") {
        const itemValues = currentItems[itemIndex];
        const totals = calculateTotals(itemValues);

        const updatedItems = currentItems.map((item, index) =>
            index === itemIndex ? { ...item, totalAmount: totals.totalAmount, grandTotal: totals.grandTotal } : item
        );
        
        const updatedInvoices = currentInvoices.map((inv, idx) => 
            idx === invoiceIndex ? { ...inv, items: updatedItems } : inv
        );

        targetForm.setFieldsValue({ invoices: updatedInvoices });
      }
    }
  };

  // 1. Only fill Invoice & Party Details on Invoice No select
  const onInvoiceSelectForAdd = (invoiceNo, invoiceIndex) => {
    // Find the *first* matching record details (any item)
    const sourceInvoice = records.find((r) => r.invoiceNo === invoiceNo);
    if (!sourceInvoice) return;

    const currentInvoices = multiAddForm.getFieldValue('invoices') || [];

    // Only set party/invoice-level details, NOT item details
    const initialValues = {
      ...currentInvoices[invoiceIndex],
      invoiceNo: sourceInvoice.invoiceNo,
      orderNo: sourceInvoice.orderNo,
      plantName: sourceInvoice.plantName,
      companyName: sourceInvoice.companyName,
      customer: sourceInvoice.customer,
      returnDate: dayjs(),
      status: "Pending",
      // Keep items list as is or initialize if not present
      items: currentInvoices[invoiceIndex].items || [
        {
          quantity: 1,
          rate: 0,
          totalAmount: 0,
          grandTotal: 0,
        },
      ],
    };
    
    const updatedInvoices = currentInvoices.map((inv, idx) => 
        idx === invoiceIndex ? initialValues : inv
    );

    multiAddForm.setFieldsValue({ invoices: updatedInvoices });
  };

  // Pre-fill form values for Edit/View (used for the existing invoice records)
  const setFormValues = (invoice, targetForm, mode = "view") => {
    // ... (Your original setFormValues logic for single invoice) ...
    const processedItems = invoice.items.map((item) => {
        const isCustomReason = !saleReturnJSON.options.returnReasonOptions.includes(item.returnReason);
        return {
          ...item,
          returnReason: isCustomReason ? "Other" : item.returnReason,
          otherReasonText: isCustomReason ? item.returnReason : "",
          totalAmount: calculateTotals(item).totalAmount,
          grandTotal: calculateTotals(item).grandTotal,
        };
      });
  
      const base = {
        ...invoice,
        returnDate: invoice.returnDate ? dayjs(invoice.returnDate) : dayjs(),
        items: processedItems,
      };
  
      if (mode === "add") { // Not used for multi-add but kept for consistency
        targetForm.setFieldsValue({
          ...base,
          status: "Pending",
          returnDate: dayjs(),
          items: [],
        });
      } else {
        targetForm.setFieldsValue(base);
      }
  };

  // Global Submit Handler for the Multi-Add Form
  const handleMultiSubmit = (values) => {
    if (!values.invoices || values.invoices.length === 0) {
        notification.error({ message: "Error", description: "Please add at least one invoice." });
        return;
    }

    const newInvoices = values.invoices.map((invoice) => {
        // Generate a new unique Invoice No for each new entry
        const newInvoiceNo = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // 1. Process items: Replace 'Other' selection with actual 'otherReasonText'
        const finalItems = invoice.items.map((item) => {
            const processedItem = { ...item }; 
            
            if (processedItem.returnReason === "Other") {
                processedItem.returnReason = processedItem.otherReasonText || "Other";
            }
            
            delete processedItem.otherReasonText;
            const totals = calculateTotals(processedItem);
            processedItem.totalAmount = totals.totalAmount; 
            processedItem.grandTotal = totals.grandTotal;
            
            return processedItem;
        }).filter(item => item.item && item.quantity > 0); // Filter out empty or zero-qty items

        if (finalItems.length === 0) {
            // Optional: Handle invoices with no items, maybe log or skip
            return null; 
        }

        return {
            ...invoice,
            invoiceNo: newInvoiceNo, // Use the generated number
            returnDate: invoice.returnDate.format("YYYY-MM-DD"),
            items: finalItems,
        };
    }).filter(Boolean); // Remove null entries (invoices with no valid items)

    if (newInvoices.length === 0) {
        notification.warning({ message: "Warning", description: "No valid invoices with items were submitted." });
        return;
    }

    // Add all new invoices to the state
    setInvoices((prev) => [...prev, ...newInvoices]);
    notification.success({ message: "Success", description: `${newInvoices.length} Sale Returns added successfully!` });
    
    setIsMultiAddModalOpen(false);
    multiAddForm.resetFields();
  };


  // Submission logic for the Edit Modal (Kept from original)
  const handleEditSubmit = (values) => {
    // ... (Your original handleSubmit logic for 'edit' mode) ...
    const finalItems = values.items.map((item) => {
        const processedItem = { ...item }; 
        
        if (processedItem.returnReason === "Other") {
          processedItem.returnReason = processedItem.otherReasonText || "Other";
        }
        
        delete processedItem.otherReasonText;
        const totals = calculateTotals(processedItem);
        processedItem.totalAmount = totals.totalAmount; 
        processedItem.grandTotal = totals.grandTotal;
        
        return processedItem;
    });

    const newInvoice = {
        invoiceNo: values.invoiceNo, 
        orderNo: values.orderNo,
        customer: values.customer,
        returnDate: values.returnDate.format("YYYY-MM-DD"),
        status: values.status,
        companyName: values.companyName,
        plantName: values.plantName,
        items: finalItems,
    };

    setInvoices((prev) =>
        prev.map((inv) =>
            inv.invoiceNo === selectedInvoice.invoiceNo
                ? { ...inv, ...newInvoice, items: finalItems }
                : inv
        )
    );
    setIsEditModalOpen(false);
    editForm.resetFields();
  };

  const handleAddClick = () => {
    multiAddForm.resetFields();
    multiAddForm.setFieldsValue({
      // Initialize with one empty invoice
      invoices: [
        {
          status: "Pending",
          returnDate: dayjs(),
          items: [
            {
              quantity: 1,
              rate: 0,
              totalAmount: 0,
              grandTotal: 0,
            },
          ],
        },
      ], 
    });
    setIsMultiAddModalOpen(true);
  };

  // Helper to find an invoice record by its key (invoiceNo)
  const getInvoiceByKey = (key) =>
    invoices.find((inv) => inv.invoiceNo === key);

  // --- Reusable Item Form Fields (Used in both Edit and Multi-Add) ---
  const renderItemFields = (name, fieldKey, restField, isView, targetForm) => {
    return (
      <div
        key={fieldKey}
        className="p-3 mb-4 border border-gray-200 rounded-md relative"
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              {...restField}
              name={[name, "item"]}
              fieldKey={[fieldKey, "item"]}
              label="Item Name"
              rules={[{ required: true, message: "Missing item" }]}
            >
              {/* Item Select: Editable in Add/Edit, Readonly in View */}
              <Select disabled={isView} showSearch optionFilterProp="children">
                {saleReturnJSON.options.allItemOptions.map((opt) => (
                  <Select.Option key={opt.item} value={opt.item}>
                    {opt.item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              {...restField}
              name={[name, "itemCode"]}
              fieldKey={[fieldKey, "itemCode"]}
              label="Item Code"
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              {...restField}
              name={[name, "itemGroup"]}
              fieldKey={[fieldKey, "itemGroup"]}
              label="Item Group"
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              {...restField}
              name={[name, "hsnCode"]}
              fieldKey={[fieldKey, "hsnCode"]}
              label="HSN code"
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              {...restField}
              name={[name, "uom"]}
              fieldKey={[fieldKey, "uom"]}
              label="UOM"
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              {...restField}
              name={[name, "quantity"]}
              fieldKey={[fieldKey, "quantity"]}
              label="Return Quantity"
              rules={[{ required: true, type: "number", min: 1, message: "Min Qty: 1" }]}
              initialValue={1}
            >
              <InputNumber
                className="w-full"
                disabled={isView}
                min={1}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              {...restField}
              name={[name, "rate"]}
              fieldKey={[fieldKey, "rate"]}
              label="Rate"
            >
              <InputNumber className="w-full" disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              {...restField}
              name={[name, "totalAmount"]}
              fieldKey={[fieldKey, "totalAmount"]}
              label="Total Amount (Gross)"
              initialValue={0}
            >
              <InputNumber className="w-full" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              {...restField}
              name={[name, "returnReason"]}
              fieldKey={[fieldKey, "returnReason"]}
              label="Return Reason"
              rules={[{ required: true, message: "Select a reason" }]}
            >
              <Select disabled={isView}>
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
            {/* Conditional rendering for 'Specify Other Reason' */}
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => {
                // Determine if we are in the multi-add form or single edit form
                const isMulti = currentValues.invoices !== undefined;
                if (isMulti) {
                    // Logic for multi-add: Check the current invoice and item
                    const currentInvoice = currentValues.invoices?.[fieldKey]?._name;
                    const prevInvoice = prevValues.invoices?.[fieldKey]?._name;
                    return (
                        currentValues.invoices?.[currentInvoice]?.items?.[name]?.returnReason !== 
                        prevValues.invoices?.[prevInvoice]?.items?.[name]?.returnReason
                    );
                } else {
                    // Logic for single edit: Check the item directly
                    return (
                        prevValues.items?.[name]?.returnReason !==
                        currentValues.items?.[name]?.returnReason
                    );
                }
              }}
            >
              {({ getFieldValue }) => {
                const isMulti = getFieldValue("invoices") !== undefined;
                const reasonPath = isMulti ? ["invoices", fieldKey, "items", name, "returnReason"] : ["items", name, "returnReason"];
                
                if (getFieldValue(reasonPath) === "Other") {
                    return (
                        <Form.Item
                            {...restField}
                            name={[name, "otherReasonText"]}
                            fieldKey={[fieldKey, "otherReasonText"]}
                            rules={[
                                { required: true, message: "Please enter a reason" },
                            ]}
                        >
                            <Input.TextArea
                                rows={2}
                                placeholder="Specify Other Reason"
                                disabled={isView}
                            />
                        </Form.Item>
                    );
                }
                return null;
              }}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              {...restField}
              name={[name, "grandTotal"]}
              fieldKey={[fieldKey, "grandTotal"]}
              label="Grand Total"
              initialValue={0}
            >
              <InputNumber className="w-full" disabled />
            </Form.Item>
          </Col>
        </Row>

        {/* Delete Button for Item */}
        {!isView && (
          <DeleteOutlined
            className="absolute top-2 right-2 text-red-500 cursor-pointer text-lg"
            onClick={() => targetForm.getFieldValue(["invoices"]) ? 
                targetForm.getFieldsValue().invoices[fieldKey].items.length > 1 && 
                targetForm.setFieldsValue({
                    invoices: targetForm.getFieldsValue().invoices.map((inv, idx) => 
                        idx === fieldKey ? { ...inv, items: inv.items.filter((_, i) => i !== name) } : inv
                    )
                })
                : targetForm.getFieldsValue().items.length > 1 && targetForm.setFieldsValue({ items: targetForm.getFieldsValue().items.filter((_, i) => i !== name) })
            }
          />
        )}
      </div>
    );
  };
    
  // --- NEW: Render Form for a Single Invoice within the Multi-Add Modal ---
  const renderSingleInvoiceForm = (invoiceName, invoiceFieldKey, removeInvoice, isView, targetForm) => {
    return (
      <div 
        key={invoiceFieldKey} 
        className="p-4 mb-6 border border-amber-300 rounded-lg shadow-inner relative bg-amber-50/50"
      >
        <h6 className="text-xl font-bold text-amber-600 mb-3">
          Invoice #{invoiceFieldKey + 1}
        </h6>
        {/* Remove Invoice Button (Only in Add mode) */}
        {!isView && (
            <MinusCircleOutlined
                className="absolute top-4 right-4 text-red-600 cursor-pointer text-xl"
                onClick={() => removeInvoice(invoiceName)}
            />
        )}

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="Invoice No"
              name={[invoiceName, "invoiceNo"]}
              fieldKey={[invoiceFieldKey, "invoiceNo"]}
              rules={[{ required: true, message: "Select Invoice" }]}
            >
              <Select
                onChange={(val) => onInvoiceSelectForAdd(val, invoiceFieldKey)}
                disabled={isView}
                showSearch
                optionFilterProp="children"
              >
                {[...new Set(records.map((r) => r.invoiceNo))].map(
                  (invoiceNo) => (
                    <Select.Option key={invoiceNo} value={invoiceNo}>
                      {invoiceNo}
                    </Select.Option>
                  )
                )}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Order No" name={[invoiceName, "orderNo"]}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Plant Name" name={[invoiceName, "plantName"]}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Company" name={[invoiceName, "companyName"]}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Customer Name" name={[invoiceName, "customer"]}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Return Date"
              name={[invoiceName, "returnDate"]}
              rules={[{ required: true }]}
            >
              <DatePicker
                className="w-full"
                disabledDate={(current) => current && current > dayjs().endOf("day")}
                disabled={isView}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Status" name={[invoiceName, "status"]}>
              <Select disabled={isView}>
                {saleReturnJSON.options.statusOptions.map((v) => (
                  <Select.Option key={v}>{v}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <h6 className="text-amber-500 mt-4 mb-2">Items to Return for Invoice #{invoiceFieldKey + 1}</h6>
        {/* --- Nested Form.List for Multiple Items in THIS Invoice --- */}
        <Form.List name={[invoiceName, "items"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key: itemKey, name: itemName, fieldKey: itemFieldKey, ...restField }) => (
                // Passing the parent form fields (invoiceFieldKey) to resolve dynamic names
                renderItemFields(itemName, invoiceFieldKey, restField, isView, targetForm)
              ))}
              {/* Add Item Button */}
              {!isView && (
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ quantity: 1, rate: 0, totalAmount: 0, grandTotal: 0 })}
                    block
                    icon={<PlusOutlined />}
                    className="border-amber-400! text-amber-700! hover:bg-amber-100!"
                  >
                    Add Another Items to Return for Invoice #{invoiceFieldKey + 1}
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
      </div>
    );
  };

  // --- Main Render Section (Same as your original component's outer structure) ---
  const renderOriginalInvoiceFormFields = (mode = "view", targetForm) => {
    // This is the original, single-invoice form structure, adjusted to accept a form prop
    const isView = mode === "view";
    const isAdd = mode === "add"; // This is now 'edit' or 'view' context in this function

    return (
      <>
        {/* Only include top-level fields for Edit/View as they use a flat form structure */}
        {mode !== "multi-add" && (
            <>
                <h6 className="text-amber-500">Invoice & Party Details</h6>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item label="Invoice No" name="invoiceNo" rules={[{ required: true }]}>
                            {/* Disabled as it's an existing invoice */}
                            <Input disabled /> 
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Order No" name="orderNo"><Input disabled /></Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Plant Name" name="plantName"><Input disabled /></Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Company" name="companyName"><Input disabled /></Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Customer Name" name="customer"><Input disabled /></Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Return Date" name="returnDate" rules={[{ required: true }]}>
                            <DatePicker className="w-full" disabled={isView} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Status" name="status">
                            <Select disabled={isView}>
                                {saleReturnJSON.options.statusOptions.map((v) => (<Select.Option key={v}>{v}</Select.Option>))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </>
        )}
        
        <h6 className="text-amber-500 mt-4">Items to Return</h6>
        
        {/* --- Form.List for Multiple Items --- */}
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                 // Use the reusable item fields renderer (key will be the item's index)
                renderItemFields(name, key, restField, isView, targetForm)
              ))}
              
              {/* Add Item Button */}
              {!isView && (
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ quantity: 1, rate: 0, totalAmount: 0, grandTotal: 0 })}
                    block
                    icon={<PlusOutlined />}
                    className="border-amber-400! text-amber-700! hover:bg-amber-100!"
                  >
                    Add Another Item to Return
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
      </>
    );
  };


  // Columns definition (same as your original)
  const mergedInvoiceColumnsKeys = ["invoiceNo", "orderNo", "returnDate", "status", "action"];

  const baseColumns = [
    { title: <span className="text-amber-700 font-semibold">Invoice No</span>, dataIndex: "invoiceNo", key: "invoiceNo", width: 120, render: (t) => <span className="text-amber-800">{t}</span>, },
    { title: <span className="text-amber-700 font-semibold">Order No</span>, dataIndex: "orderNo", key: "orderNo", width: 120, render: (t) => <span className="text-amber-800">{t}</span>, },
    { title: <span className="text-amber-700 font-semibold">Item Name</span>, dataIndex: "item", key: "item", width: 150, render: (t) => <span className="text-amber-800">{t}</span>, },
    { title: <span className="text-amber-700 font-semibold">Return Qty</span>, dataIndex: "quantity", key: "quantity", width: 120, render: (t, record) => (<span className="text-amber-800">{t} {record.uom}</span>), },
    { title: <span className="text-amber-700 font-semibold">Total Amt</span>, dataIndex: "grandTotal", key: "grandTotal", width: 120, render: (t) => <span className="text-amber-800">₹{t}</span>, },
    { title: <span className="text-amber-700 font-semibold">Return Date</span>, dataIndex: "returnDate", key: "returnDate", width: 120, render: (t) => <span className="text-amber-800">{t}</span>, },
    { title: <span className="text-amber-700 font-semibold">Reason</span>, dataIndex: "returnReason", key: "returnReason", width: 150, render: (t) => <span className="text-amber-800">{t}</span>, },
    { 
      title: <span className="text-amber-700 font-semibold">Status</span>, 
      dataIndex: "status", 
      key: "status", 
      width: 100, 
      render: (status) => {
        const base = "px-3 py-1 rounded-full text-sm font-semibold";
        if (status === "Approved") return (<span className={`${base} bg-green-100 text-green-700`}>{status}</span>);
        if (status === "Pending") return (<span className={`${base} bg-yellow-100 text-yellow-700`}>{status}</span>);
        return <span className={`${base} bg-red-100 text-red-700`}>{status}</span>;
      },
    },
    {
      title: <span className="text-amber-700 font-semibold">Action</span>,
      key: "action",
      width: 80,
      render: (record) => (
        <div className="flex gap-3">
          <EyeOutlined
            className="cursor-pointer! text-blue-500!"
            onClick={() => {
              const invoiceRecord = getInvoiceByKey(record.invoiceNo);
              setSelectedInvoice(invoiceRecord);
              setFormValues(invoiceRecord, viewForm, "view");
              setIsViewModalOpen(true);
            }}
          />
          {record.status !== "Approved" && (
            <EditOutlined
              className="cursor-pointer! text-red-500!"
              onClick={() => {
                const invoiceRecord = getInvoiceByKey(record.invoiceNo);
                setSelectedInvoice(invoiceRecord);
                setFormValues(invoiceRecord, editForm, "edit");
                setIsEditModalOpen(true);
              }}
            />
          )}
        </div>
      ),
    },
  ];
  
  const columns = baseColumns.map(col => {
    if (mergedInvoiceColumnsKeys.includes(col.key)) {
      return {
        ...col,
        onCell: (record) => {
          return { rowSpan: record.invoiceRowSpan };
        },
      };
    }
    return col;
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-0">
        <div>
          <h1 className="text-3xl font-bold text-amber-700">Sale Return </h1>
          <p className="text-amber-600">Manage your Sales Return transactions easily</p>
        </div>
      </div>
      
      {/* Search and Action Bar */}
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
            onClick={handleAddClick} // Opens the NEW Multi-Add Modal
          >
            Add New Return(s)
          </Button>
        </div>
      </div>
      
      {/* Main Data Table */}
      <div className="border border-amber-300 rounded-lg p-4 shadow-md">
        <Table 
            columns={columns} 
            dataSource={mergedData} 
            pagination={{ pageSize: 10 }} 
            scroll={{ x: 1000 }} // Ensure horizontal scroll for many columns
        />
      </div>

      {/* --- Edit Modal (Existing Invoice) --- */}
      <Modal
        title={
          <span className="text-amber-700 text-2xl font-semibold">
            Edit Return (Invoice: {selectedInvoice?.invoiceNo})
          </span>
        }
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          editForm.resetFields();
        }}
        footer={null}
        width={1200}
      >
        <Form
          form={editForm}
          layout="vertical"
          onValuesChange={(changedValues, allValues) =>
            handleItemValuesChange(changedValues, allValues, editForm)
          }
          onFinish={handleEditSubmit}
        >
          {renderOriginalInvoiceFormFields("edit", editForm)}
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
              Update Return
            </Button>
          </div>
        </Form>
      </Modal>

      {/* --- View Modal (Existing Invoice) --- */}
      <Modal
        title={
          <span className="text-amber-700 text-2xl font-semibold">
            View Return (Invoice: {selectedInvoice?.invoiceNo})
          </span>
        }
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={
            <Button 
                onClick={() => setIsViewModalOpen(false)}
                icon={<RollbackOutlined />}
                className="border-amber-400! text-amber-700! hover:bg-amber-100!"
            >
                Close
            </Button>
        }
        width={1200}
      >
        <Form form={viewForm} layout="vertical">
          {renderOriginalInvoiceFormFields("view", viewForm)}
        </Form>
      </Modal>

      {/* --- ⭐ NEW Multi-Add Modal (The main requirement) ⭐ --- */}
      <Modal
        title={
          <span className="text-amber-700 text-2xl font-semibold">
            Add Multiple Sale Returns
          </span>
        }
        open={isMultiAddModalOpen}
        onCancel={() => {
          setIsMultiAddModalOpen(false);
          multiAddForm.resetFields();
        }}
        footer={null}
        width={1400} // Wider modal to accommodate multiple invoices
        style={{ top: 20 }}
      >
        <Form
          form={multiAddForm}
          layout="vertical"
          onValuesChange={(changedValues, allValues) =>
            handleItemValuesChange(changedValues, allValues, multiAddForm)
          }
          onFinish={handleMultiSubmit}
        >
          {/* --- Outer Form.List for Multiple Invoices --- */}
          <Form.List name="invoices">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key: invoiceKey, name: invoiceName, fieldKey: invoiceFieldKey, ...restField }) => (
                    // Render the full form structure for each invoice
                    renderSingleInvoiceForm(invoiceName, invoiceFieldKey, remove, false, multiAddForm)
                ))}
                
                {/* Add New Invoice Button */}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ 
                        status: "Pending", 
                        returnDate: dayjs(), 
                        items: [{ quantity: 1, rate: 0, totalAmount: 0, grandTotal: 0 }] 
                    })}
                    block
                    icon={<PlusOutlined />}
                    className="border-green-400! text-green-700! hover:bg-green-100! mt-4"
                  >
                    Add Another Sale Return (New Invoice)
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <div className="flex justify-end gap-2 mt-6 border-t pt-4">
            <Button
              onClick={() => {
                setIsMultiAddModalOpen(false);
                multiAddForm.resetFields();
              }}
              className="border-amber-400! text-amber-700! hover:bg-amber-100!"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-green-500! hover:bg-green-600! border-none!"
            >
              Submit All Returns
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}