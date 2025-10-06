import { TbRulerOff } from "react-icons/tb";
import { FaUsers, FaCalendarAlt, FaBriefcase, FaChartBar, FaShieldAlt, FaMoneyBill, FaTools, FaCogs, FaWrench, FaLink } from "react-icons/fa";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFileCsv, FaFileExcel, FaFilePdf, FaEye, FaSave, FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export const searchDropDownData = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 }
];

export const AppName = "EmpDemo"

export const pageGridTitle = "Employee Record";

// top button list settings
export const pageGridSettings = {
  fontSize: 13,
  // dateFormat: "MM-DD-YYYY", 
  //dateFormat: "YYYY-MM-DD",
  //dateFormat: "DD-MM-YYYY",
  dateFormat: "MM/DD/YYYY",
  //dateFormat: "YYYY/MM/DD",
  // dateFormat: "DD/MM/YYYY",
  fontFamily: "sans-serif",
  color: 'white',
  background: '#099BE0',
  freezebackground: '#d7ecf9',
  isGlobalSearchVisible: false,
  ButtonAction: [
    { name: "Add", icon: FaPlus, tabId: 1, order: 1 },
    { name: "Edit", icon: FaEdit, tabId: 1, order: 2 },
    { name: "CSV", icon: FaFileCsv, tabId: 1, order: 6 },
    { name: "XLSX", icon: FaFileExcel, tabId: 1, order: 4 },
    { name: "PDF", icon: FaFilePdf, tabId: 1, order: 5 },
    { name: "CustomizeColumns", icon: FaEye, tabId: 1, order: 7 },
    { name: "Delete", icon: FaTrash, tabId: 1, order: 3 },
    { name: "Search", icon: FaSearch, tabId: 2, order: 1 },
    { name: "Save", icon: FaSave, tabId: 2, order: 2 },
    { name: "Cancel", icon: FaTimes, tabId: 2, order: 4 },
    { name: "Previous", icon: FaArrowLeft, tabId: 3, order: 1 },
    { name: "Forward", icon: FaArrowRight, tabId: 3, order: 2 }
  ],
  IsButtonVisible: {
    Add: true,
    Edit: true,
    Delete: true,
    Search: true,
    CSV: true,
    XLSX: true,
    PDF: true,
    CustomizeColumns: true,
    Save: true,
    Cancel: true,
    Previous: true,
    Forward: true
  },
  IsButtonEnabled: {
    Add: true,
    Edit: true,
    Delete: true,
    Search: true,
    CSV: true,
    XLSX: true,
    PDF: true,
    CustomizeColumns: true,
    Save: true,
    Cancel: true,
    Previous: true,
    Forward: true
  }
};

//Section Grid Settings 
export const sectionGridSettings = {
  fontSize: 13,
  // dateFormat: "MM-DD-YYYY", 
  //dateFormat: "YYYY-MM-DD",
  //dateFormat: "DD-MM-YYYY",
  dateFormat: "MM/DD/YYYY",
  //dateFormat: "YYYY/MM/DD",
  // dateFormat: "DD/MM/YYYY",
  fontFamily: "sans-serif",
  color: 'white',
  background: '#099BE0',
  // background: 'linear-gradient(to top, #09203f 0%, #537895 100%)',
  freezebackground: '#d7ecf9',
  isGlobalSearchVisible: false,
  ButtonAction: ["Add", "Edit", "Delete", "Search", "CSV", "XLSX", "PDF", "CustomizeColumns"],
  IsButtonVisible: {
    Add: true,
    Edit: true,
    Delete: true,
    Search: true,
    CSV: true,
    XLSX: true,
    PDF: true,
    CustomizeColumns: true
  },
  IsButtonEnabled: {
    Add: true,
    Edit: true,
    Delete: true,
    Search: true,
    CSV: true,
    XLSX: true,
    PDF: true,
    CustomizeColumns: true
  }
};

// States and Union Territories Data
export const stateOptions = [
  { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
  { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
  { label: 'Assam', value: 'Assam' },
  { label: 'Bihar', value: 'Bihar' },
  { label: 'Chhattisgarh', value: 'Chhattisgarh' },
  { label: 'Goa', value: 'Goa' },
  { label: 'Gujarat', value: 'Gujarat' },
  { label: 'Haryana', value: 'Haryana' },
  { label: 'Himachal Pradesh', value: 'Himachal Pradesh' },
  { label: 'Jharkhand', value: 'Jharkhand' },
  { label: 'Karnataka', value: 'Karnataka' },
  { label: 'Kerala', value: 'Kerala' },
  { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
  { label: 'Maharashtra', value: 'Maharashtra' },
  { label: 'Manipur', value: 'Manipur' },
  { label: 'Meghalaya', value: 'Meghalaya' },
  { label: 'Mizoram', value: 'Mizoram' },
  { label: 'Nagaland', value: 'Nagaland' },
  { label: 'Odisha', value: 'Odisha' },
  { label: 'Punjab', value: 'Punjab' },
  { label: 'Rajasthan', value: 'Rajasthan' },
  { label: 'Sikkim', value: 'Sikkim' },
  { label: 'Tamil Nadu', value: 'Tamil Nadu' },
  { label: 'Telangana', value: 'Telangana' },
  { label: 'Tripura', value: 'Tripura' },
  { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
  { label: 'Uttarakhand', value: 'Uttarakhand' },
  { label: 'West Bengal', value: 'West Bengal' },

  // Union Territories
  { label: 'Andaman and Nicobar Islands', value: 'Andaman and Nicobar Islands' },
  { label: 'Chandigarh', value: 'Chandigarh' },
  { label: 'Dadra and Nagar Haveli and Daman and Diu', value: 'Dadra and Nagar Haveli and Daman and Diu' },
  { label: 'Delhi', value: 'Delhi' },
  { label: 'Jammu and Kashmir', value: 'Jammu and Kashmir' },
  { label: 'Ladakh', value: 'Ladakh' },
  { label: 'Lakshadweep', value: 'Lakshadweep' },
  { label: 'Puducherry', value: 'Puducherry' },
];

//Religion Data
export const religionOptions = [
  { label: 'Hindu', value: 'Hindu' },
  { label: 'Muslim', value: 'Muslim' },
  { label: 'Christian', value: 'Christian' },
  { label: 'Sikh', value: 'Sikh' },
];

//City List
export const cityOptions = [
  { label: 'Mumbai', value: 'Mumbai', state: 'Maharashtra' },
  { label: 'Pune', value: 'Pune', state: 'Maharashtra' },
  { label: 'Ahmedabad', value: 'Ahmedabad', state: 'Gujarat' },
  { label: 'Bangalore', value: 'Bangalore', state: 'Karnataka' },
  { label: 'Chennai', value: 'Chennai', state: 'Tamil Nadu' },
  { label: 'Hyderabad', value: 'Hyderabad', state: 'Telangana' },
  { label: 'Kolkata', value: 'Kolkata', state: 'West Bengal' },
  { label: 'Jaipur', value: 'Jaipur', state: 'Rajasthan' },
  { label: 'Lucknow', value: 'Lucknow', state: 'Uttar Pradesh' },
  { label: 'Chandigarh', value: 'Chandigarh', state: 'Chandigarh' }
];

export const AnalyticData = [
  {
    "id": 1,
    "heading": "Total Revenue",
    "amount": "₹ 1,20,000"
  },
  {
    "id": 2,
    "heading": "Net Profit",
    "amount": "₹ 35,000"
  },
  {
    "id": 3,
    "heading": "Expenses",
    "amount": "₹ 50,000"
  },
  {
    "id": 4,
    "heading": "Gross Margin",
    "amount": "₹ 70,000"
  },
  {
    "id": 5,
    "heading": "Operating Cost",
    "amount": "₹ 25,000"
  },
  {
    "id": 6,
    "heading": "Cash Flow",
    "amount": "₹ 90,000"
  }
]

export const ChartsData = [
  {
    "id": 1,
    "order": 2,
    "chartType": "Bar Chart",
    "chartName": "Quarterly Sales Analysis",
    "chart": {
      "labels": ["Q1", "Q2", "Q3", "Q4"],
      "datasets": [
        {
          "label": "Sales Revenue (in ₹K)",
          "data": [120, 150, 180, 200],
          "backgroundColor": "rgba(54, 162, 235, 0.6)",
          "borderColor": "rgba(54, 162, 235, 1)",
          "borderWidth": 1
        }
      ]
    }
  },
  {
    "id": 2,
    "order": 1,
    "chartType": "Doughnut Chart",
    "chartName": "Product Market Share",
    "chart": {
      "labels": ["Smartphones", "Laptops", "Tablets"],
      "datasets": [
        {
          "label": "Market Share (%)",
          "data": [35, 25, 20],
          "backgroundColor": ["#ff6384", "#36a2eb", "#4caf50"],
          "borderWidth": 1
        }
      ]
    }
  },
  {
    "id": 3,
    "chartType": "Pie Chart",
    "chartName": "Customer Satisfaction Levels",
    "order": 3,
    "chart": {
      "labels": ["Very Satisfied", "Satisfied", "Dissatisfied"],
      "datasets": [
        {
          "label": "Satisfaction Levels",
          "data": [40, 35, 10],
          "backgroundColor": ["#3b83d1", "#0ea111", "#ff4500"],
          "borderWidth": 1
        }
      ]
    }
  },
  {
    "id": 4,
    "chartType": "Line Chart",
    "chartName": "Monthly Expenditure Trends",
    "chart": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "datasets": [
        {
          "label": "Operating Expenses (in ₹K)",
          "data": [50, 45, 60, 55, 65, 70],
          "borderColor": "rgba(255, 99, 132, 1)",
          "backgroundColor": "rgba(255, 99, 132, 0.2)",
          "borderWidth": 2,
          "pointBackgroundColor": "rgba(255, 99, 132, 1)"
        },
        {
          "label": "Revenue (in ₹K)",
          "data": [70, 75, 80, 85, 90, 100],
          "borderColor": "rgba(54, 162, 235, 1)",
          "backgroundColor": "rgba(54, 162, 235, 0.2)",
          "borderWidth": 2,
          "pointBackgroundColor": "rgba(54, 162, 235, 1)"
        }
      ]
    }
  },
  {
    "id": 5,
    "chartType": "Horizontal Bar Chart",
    "chartName": "Business Expenditure Overview",
    "chart": {
      "labels": ["January", "February", "March", "April", "May"],
      "datasets": [
        {
          "label": "Marketing",
          "data": [1200, 1500, 1800, 1300, 1600],
          "backgroundColor": ["#FF5733", "#33FF57", "#3357FF", "#FF33B5", "#57FF33"],
          "borderWidth": 1
        }
      ]
    }
  },
  {
    "id": 6,
    "chartType": "Multi Series Pie Chart",
    "chartName": "Expenditure Breakdown Overview",
    "chart": {
      "labels": ['Retail', 'Technology', 'Healthcare'],
      "datasets": [
        {
          "label": '2023 Dataset',
          "data": [400, 150, 50],
          "backgroundColor": ['#FF6347', '#4682B4', '#FFD700'],
        },
        {
          "label": '2024 Dataset',
          "data": [300, 200, 100],
          "backgroundColor": ['#FF6347', '#4682B4', '#FFD700'],
        }
      ]
    }
  },
  {
    "id": 7,
    "chartType": "Radar Chart3",
    "chartName": "Technology Performance Overview",
    "chart": {
      "labels": ['Speed', 'Reliability', 'Security', 'Scalability', 'Innovation'],
      "datasets": [
        {
          "label": '2024 Performance',
          "data": [35, 50, 35, 66, 50],
          "backgroundColor": 'rgba(105, 11, 35, 0.73)',
          "borderWidth": 1
        },
        {
          "label": '2023 Performance',
          "data": [80, 70, 90, 85, 75],
          "backgroundColor": 'rgba(27, 77, 62, 0.8)',
          "borderWidth": 1
        }
      ]
    }
  },
  {
    "id": 8,
    "chartType": "PolarArea Chart3",
    "chartName": "Business Performance Overview",
    "chart": {
      "labels": ['Sales Growth', 'Market Reach', 'Customer Satisfaction'],
      "datasets": [
        {
          "label": '2024 Performance',
          "data": [85, 60, 10],
          "backgroundColor": 'rgba(95, 158, 160, 0.6)',
          "borderColor": 'rgba(95, 158, 160, 1)',
          "borderWidth": 2
        },
        {
          "label": '2023 Performance',
          "data": [20, 30, 90],
          "backgroundColor": 'rgba(135, 206, 235, 0.6)',
          "borderColor": 'rgba(135, 206, 235, 1)',
          "borderWidth": 2
        }
      ]
    }
  }
];


