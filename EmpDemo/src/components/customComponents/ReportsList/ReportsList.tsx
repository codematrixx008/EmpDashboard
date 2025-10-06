import React from 'react'

const ReportsList = () => {
  // Sample data
  const reports = [
    { id: 1, title: 'Monthly Sales', author: 'John Doe', date: '2024-01-15', status: 'Completed', category: 'Finance', views: 245 },
    { id: 2, title: 'Q4 Performance', author: 'Jane Smith', date: '2024-01-10', status: 'Pending', category: 'Operations', views: 189 },
    { id: 3, title: 'User Analytics', author: 'Mike Johnson', date: '2024-01-08', status: 'Completed', category: 'Marketing', views: 312 },
    { id: 4, title: 'Budget Report', author: 'Sarah Wilson', date: '2024-01-05', status: 'In Progress', category: 'Finance', views: 167 },
    { id: 5, title: 'Customer Feedback', author: 'Tom Brown', date: '2024-01-03', status: 'Completed', category: 'Support', views: 278 }
  ]

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    fontFamily: 'Arial, sans-serif'
  }

  const thStyle = {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold'
  }

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left'
  }

  const trEvenStyle = {
    backgroundColor: '#f9f9f9'
  }

  const trHoverStyle = {
    backgroundColor: '#f5f5f5'
  }

  const statusStyle = (status) => ({
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: 
      status === 'Completed' ? '#d4edda' :
      status === 'Pending' ? '#fff3cd' :
      '#cce7ff',
    color: 
      status === 'Completed' ? '#155724' :
      status === 'Pending' ? '#856404' :
      '#004085'
  })

  return (
    <div style={{ padding: '20px' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Author</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Views</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr 
              key={report.id} 
              style={index % 2 === 0 ? trEvenStyle : {}}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = trHoverStyle.backgroundColor
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = index % 2 === 0 ? trEvenStyle.backgroundColor : ''
              }}
            >
              <td style={tdStyle}>{report.id}</td>
              <td style={tdStyle}>{report.title}</td>
              <td style={tdStyle}>{report.author}</td>
              <td style={tdStyle}>{report.date}</td>
              <td style={tdStyle}>
                <span style={statusStyle(report.status)}>
                  {report.status}
                </span>
              </td>
              <td style={tdStyle}>{report.category}</td>
              <td style={tdStyle}>{report.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReportsList