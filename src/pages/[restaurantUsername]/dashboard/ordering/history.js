import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Modal, Button } from 'react-bootstrap';
import DashboardLayout from '@/components/DashboardLayout';
import { apiFetch } from '@/lib/api';

const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
const formatTime = (dateString) => new Date(dateString).toLocaleTimeString();

const StatusBadge = ({ status }) => {
  const bgColor = status === 'fulfilled' ? '#4CAF50' : '#E53935';
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        backgroundColor: bgColor,
        color: '#FFF',
        borderRadius: 12,
        fontSize: '0.85rem',
        fontWeight: 500,
      }}
    >
      {status}
    </span>
  );
};

const renderOrderItems = (items) => {
  if (!items || items.length === 0) return 'No items';
  return items.map(item => `${item.quantity} x ${item.name} (${item.variationName})`).join('<br />');
};

const OrderTable = ({ columns, data, onSort, currentSort, sortOrder, onRowClick }) => (
  <div style={{ overflowX: 'auto', backgroundColor: '#1E1E2F', borderRadius: 8 }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', borderSpacing: 0 }}>
      <thead style={{ backgroundColor: '#2A2A3A' }}>
        <tr>
          {columns.map(col => (
            <th
              key={col.accessor}
              onClick={() => col.sortable && onSort(col.accessor)}
              style={{
                padding: '0.75rem 1rem',
                textAlign: 'left',
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 600,
                borderBottom: '1px solid #3A3A4A',
                cursor: col.sortable ? 'pointer' : 'default',
                display: 'table-cell',
                whiteSpace: 'nowrap',
              }}
            >
              {col.header}
              {col.sortable && (
                <span>
                  {currentSort === col.accessor ? (
                    sortOrder === 'asc' ? '▲' : '▼'
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  )}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ padding: '1rem', textAlign: 'center', color: '#EEE' }}>
              No orders found
            </td>
          </tr>
        ) : (
          data.map((row, i) => {
            const isEven = i % 2 === 0;
            return (
              <tr
                key={row._id}
                style={{
                  backgroundColor: isEven ? 'transparent' : 'rgba(255,255,255,0.03)',
                  transition: 'background 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => onRowClick(row)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isEven ? 'transparent' : 'rgba(255,255,255,0.03)')}
              >
                {columns.map(col => {
                  let value;
                  if (col.accessor === '_id') {
                    value = row._id.slice(-4); // Show only last 4 characters of _id
                  } else if (col.accessor.includes('.')) {
                    const [obj, prop] = col.accessor.split('.');
                    value = row[obj]?.[prop];
                  } else {
                    value = row[col.accessor];
                  }
                  const cellContent = col.renderCell ? col.renderCell(value) : value?.toString();
                  return (
                    <td
                      key={col.accessor}
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        color: '#EEE',
                        fontSize: '0.95rem',
                        display: 'table-cell',
                      }}
                    >
                      {typeof cellContent === 'string' && cellContent.includes('<br />') ? (
                        <span dangerouslySetInnerHTML={{ __html: cellContent }} />
                      ) : (
                        cellContent
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <Modal
      centered
      show={true}
      onHide={onClose}
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
      contentStyle={{
        backgroundColor: '#1E1E2F',
        color: '#EEE',
        border: '1px solid #3A3A4A',
        borderRadius: 8,
      }}
    >
      <Modal.Header
        style={{
          backgroundColor: '#2A2A3A',
          borderBottom: '1px solid #3A3A4A',
          padding: '0.75rem 1rem',
        }}
      >
        <Modal.Title style={{ color: '#FFF', fontSize: '1.25rem' }}>
          Order Details - {order._id}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: '#1E1E2F',
          color: '#EEE',
          padding: '1rem',
        }}
      >
        <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
        <p><strong>Time:</strong> {formatTime(order.createdAt)}</p>
        <p><strong>Status:</strong> <StatusBadge status={order.status} /></p>
        <p><strong>Placed by:</strong> {order.placedBy?.username}</p>
        <p><strong>Comment:</strong> {order.comment || 'No comments'}</p>
        <h5 style={{ color: '#FFF', marginTop: '1rem' }}>Order Items</h5>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #3A3A4A', padding: '0.5rem', textAlign: 'left', color: '#EEE' }}>Item</th>
              <th style={{ borderBottom: '1px solid #3A3A4A', padding: '0.5rem', textAlign: 'left', color: '#EEE' }}>Variation</th>
              <th style={{ borderBottom: '1px solid #3A3A4A', padding: '0.5rem', textAlign: 'right', color: '#EEE' }}>Qty</th>
              <th style={{ borderBottom: '1px solid #3A3A4A', padding: '0.5rem', textAlign: 'right', color: '#EEE' }}>Price</th>
              <th style={{ borderBottom: '1px solid #3A3A4A', padding: '0.5rem', textAlign: 'right', color: '#EEE' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.orderLineItems.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '0.5rem', color: '#EEE' }}>{item.name}</td>
                <td style={{ padding: '0.5rem', color: '#EEE' }}>{item.variationName}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right', color: '#EEE' }}>{item.quantity}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right', color: '#EEE' }}>${item.price.toFixed(2)}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right', color: '#EEE' }}>${item.subTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p><strong>Subtotal:</strong> ${order.subtotal.toFixed(2)}</p>
        <p><strong>Tax:</strong> ${order.tax.toFixed(2)}</p>
        <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
      </Modal.Body>
      <Modal.Footer
        style={{
          backgroundColor: '#2A2A3A',
          borderTop: '1px solid #3A3A4A',
          padding: '0.75rem',
        }}
      >
        <Button
          variant="secondary"
          onClick={onClose}
          style={{
            backgroundColor: '#2A2A3A',
            borderColor: '#3A3A4A',
            color: '#FFF',
            padding: '0.5rem 1rem',
            borderRadius: 4,
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i + 1}
        onClick={() => onPageChange(i + 1)}
        style={{
          backgroundColor: currentPage === i + 1 ? '#388E3C' : '#2A2A3A',
          color: '#FFF',
          border: 'none',
          padding: '0.5rem 1rem',
          margin: '0 0.25rem',
          borderRadius: 4,
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        {i + 1}
      </button>
    ))}
  </div>
);

const OrderHistoryPage = () => {
  const router = useRouter();
  const { restaurantUsername } = router.query;
  console.log('restaurantUsername:', restaurantUsername); // Debug log

  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '', dateFrom: '', dateTo: '' });
  const [tempFilters, setTempFilters] = useState({ status: '', dateFrom: '', dateTo: '' });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const loadOrders = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        statuses: filters.status,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        sortBy,
        sortOrder,
      }).toString();
      console.log('Fetching orders with URL:', `/order/history?${params}`);
      const response = await apiFetch(`/order/history?${params}`);
      console.log('API response:', response);
      const { orders: allOrders, total, pages } = response;

      // Filter orders locally by the last 4 digits of _id if searchTerm is provided
      const filteredOrders = searchTerm
        ? allOrders.filter(order => order._id.slice(-4) === searchTerm)
        : allOrders;

      setOrders(filteredOrders);
      setTotalOrders(total); // Note: totalOrders might need adjustment if filtered client-side
      setTotalPages(pages);
    } catch (err) {
      console.error('Failed to load orders:', err.message, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && restaurantUsername) {
      console.log('Triggering loadOrders for:', restaurantUsername);
      loadOrders();
    }
  }, [router.isReady, currentPage, searchTerm, filters, sortBy, sortOrder, restaurantUsername]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleRowClick = (order) => setSelectedOrder(order);

  const handleCloseModal = () => setSelectedOrder(null);

  const handleStatusChange = (status) => {
    setTempFilters(prev => ({ ...prev, status }));
  };

  const handleDateFromChange = (e) => {
    setTempFilters(prev => ({ ...prev, dateFrom: e.target.value }));
  };

  const handleDateToChange = (e) => {
    setTempFilters(prev => ({ ...prev, dateTo: e.target.value }));
  };

  const handleClearFilters = () => {
    setFilters({ status: '', dateFrom: '', dateTo: '' });
    setTempFilters({ status: '', dateFrom: '', dateTo: '' });
    setIsFilterOpen(false);
  };

  const handleApplyFilters = () => {
    setFilters({ ...tempFilters });
    setIsFilterOpen(false);
  };

  const columns = [
    { header: 'Order ID', accessor: '_id' },
    { header: 'Date', accessor: 'createdAt', renderCell: formatDate, sortable: true },
    { header: 'Time', accessor: 'createdAt', renderCell: formatTime },
    { header: 'Status', accessor: 'status', renderCell: (value) => <StatusBadge status={value} />, sortable: true },
    { header: 'Total', accessor: 'total', renderCell: (value) => `$${value.toFixed(2)}`, sortable: true },
    { header: 'Order Items', accessor: 'orderLineItems', renderCell: renderOrderItems },
    { header: 'Placed by', accessor: 'placedBy.username' },
  ];

  return (
    <DashboardLayout>
      <div style={{ padding: '1rem', minWidth: '0' }}>
        <h1 style={{ color: '#FFF', marginBottom: '1.5rem' }}>🧾 Order History</h1>
        {loading ? (
          <p style={{ color: '#EEE' }}>Loading orders…</p>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <svg
                  style={{ marginRight: '0.5rem', color: '#FFF' }}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by last 4 digits of order ID, staff username, or item name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 1rem',
                    borderRadius: 4,
                    border: '1px solid #3A3A4A',
                    backgroundColor: '#2A2A3A',
                    color: '#FFF',
                    width: '100%',
                  }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  style={{
                    backgroundColor: '#2A2A3A',
                    color: '#FFF',
                    border: '1px solid #3A3A4A',
                    padding: '0.5rem 1rem',
                    borderRadius: 4,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 3H2l8 9.46V19a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-6.54L22 3z" />
                  </svg>
                  Filters
                </button>
                {isFilterOpen && (
                  <div
                    ref={filterRef}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      backgroundColor: '#2A2A3A',
                      border: '1px solid #3A3A4A',
                      borderRadius: 4,
                      padding: '1rem',
                      zIndex: 1000,
                      minWidth: '250px',
                      color: '#EEE',
                    }}
                  >
                    <h6 style={{ marginBottom: '0.5rem', color: '#FFF' }}>Status</h6>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      <input
                        type="radio"
                        name="status"
                        value="fulfilled"
                        checked={tempFilters.status === 'fulfilled'}
                        onChange={() => handleStatusChange('fulfilled')}
                      /> Fulfilled
                    </label>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      <input
                        type="radio"
                        name="status"
                        value="cancelled"
                        checked={tempFilters.status === 'cancelled'}
                        onChange={() => handleStatusChange('cancelled')}
                      /> Cancelled
                    </label>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      <input
                        type="radio"
                        name="status"
                        value=""
                        checked={tempFilters.status === ''}
                        onChange={() => handleStatusChange('')}
                      /> None
                    </label>
                    <h6 style={{ margin: '1rem 0 0.5rem', color: '#FFF' }}>Date</h6>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem' }}>From:</label>
                      <input
                        type="date"
                        value={tempFilters.dateFrom}
                        onChange={handleDateFromChange}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: 4,
                          border: '1px solid #3A3A4A',
                          backgroundColor: '#1E1E2F',
                          color: '#FFF',
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem' }}>To:</label>
                      <input
                        type="date"
                        value={tempFilters.dateTo}
                        onChange={handleDateToChange}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: 4,
                          border: '1px solid #3A3A4A',
                          backgroundColor: '#1E1E2F',
                          color: '#FFF',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <Button
                        variant="secondary"
                        onClick={handleClearFilters}
                        style={{
                          backgroundColor: '#E53935',
                          borderColor: '#E53935',
                          color: '#FFF',
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: 4,
                        }}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleApplyFilters}
                        style={{
                          backgroundColor: '#388E3C',
                          borderColor: '#388E3C',
                          color: '#FFF',
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: 4,
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <OrderTable
              columns={columns}
              data={orders}
              onSort={handleSort}
              currentSort={sortBy}
              sortOrder={sortOrder}
              onRowClick={handleRowClick}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
            <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrderHistoryPage;