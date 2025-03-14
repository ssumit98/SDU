import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, startAfter, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './FeedbacksTable.css';

const FeedbacksTable = () => {
  const [allFeedbacks, setAllFeedbacks] = useState([]); // Store all fetched feedbacks
  const [displayedFeedbacks, setDisplayedFeedbacks] = useState([]); // Filtered feedbacks to display
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState(new Set());
  
  const ITEMS_PER_PAGE = 5;

  const fetchFeedbacks = async (startAfterDoc = null) => {
    try {
      let feedbackQuery = collection(db, 'feedbacks');
      let constraints = [
        orderBy('createdAt', 'desc'),
        limit(ITEMS_PER_PAGE)
      ];

      if (dateFilter) {
        const startDate = new Date(dateFilter);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dateFilter);
        endDate.setHours(23, 59, 59, 999);
        constraints.push(where('createdAt', '>=', startDate));
        constraints.push(where('createdAt', '<=', endDate));
      }

      if (startAfterDoc) {
        constraints.push(startAfter(startAfterDoc));
      }

      const q = query(feedbackQuery, ...constraints);
      const querySnapshot = await getDocs(q);

      const newFeedbacks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));

      if (startAfterDoc) {
        setAllFeedbacks(prev => [...prev, ...newFeedbacks]);
      } else {
        setAllFeedbacks(newFeedbacks);
      }

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to allFeedbacks
  const applyFilters = () => {
    let filtered = [...allFeedbacks];

    // Apply user type filter
    if (userTypeFilter === 'anonymous') {
      filtered = filtered.filter(feedback => feedback.email === 'anonymous@user.com');
    } else if (userTypeFilter === 'registered') {
      filtered = filtered.filter(feedback => feedback.email !== 'anonymous@user.com');
    }

    setDisplayedFeedbacks(filtered);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [dateFilter]); // Only fetch from DB when date filter changes

  useEffect(() => {
    applyFilters();
  }, [allFeedbacks, userTypeFilter]); // Apply filters when all feedbacks or user type filter changes

  const handleLoadMore = () => {
    if (lastVisible) {
      fetchFeedbacks(lastVisible);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleRowSelect = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(displayedFeedbacks.map(f => f.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Feedback Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 25);

    const selectedFeedbacks = displayedFeedbacks.filter(f => selectedRows.has(f.id));
    
    const tableData = selectedFeedbacks.map(feedback => [
      formatDate(feedback.createdAt),
      feedback.name || 'N/A',
      feedback.email === 'anonymous@user.com' ? 'Anonymous User' : feedback.email,
      feedback.mobile || 'N/A',
      feedback.feedback || 'N/A'
    ]);

    autoTable(doc, {
      head: [['Date', 'Name', 'Email', 'Mobile', 'Feedback']],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 35 },
      theme: 'grid'
    });

    doc.save('feedback-report.pdf');
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading feedbacks...</p>
      </div>
    );
  }

  return (
    <div className="feedbacks-container">
      <div className="filters">
        <div className="filter-group">
          <label>Filter by Date:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>User Type:</label>
          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="anonymous">Anonymous Users</option>
            <option value="registered">Registered Users</option>
          </select>
        </div>
        <button 
          className="print-button"
          onClick={handlePrint}
          disabled={selectedRows.size === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print Selected
        </button>
      </div>

      <div className="table-container">
        <table className="feedbacks-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.size === displayedFeedbacks.length && displayedFeedbacks.length > 0}
                />
              </th>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {displayedFeedbacks.map((feedback) => (
              <tr 
                key={feedback.id}
                className={selectedRows.has(feedback.id) ? 'selected' : ''}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(feedback.id)}
                    onChange={() => handleRowSelect(feedback.id)}
                  />
                </td>
                <td>{formatDate(feedback.createdAt)}</td>
                <td>{feedback.name}</td>
                <td>
                  {feedback.email === 'anonymous@user.com' 
                    ? 'Anonymous User' 
                    : feedback.email}
                </td>
                <td>{feedback.mobile}</td>
                <td>{feedback.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <button 
          className="load-more-button"
          onClick={handleLoadMore}
        >
          Load More
        </button>
      )}

      {displayedFeedbacks.length === 0 && (
        <div className="no-feedbacks">
          <p>No feedbacks found</p>
        </div>
      )}
    </div>
  );
};

export default FeedbacksTable; 