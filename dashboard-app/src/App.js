import React, { useState, useReducer } from 'react';
import { X, Plus, Search, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// ==================== DATA ====================
const initialData = {
  categories: [
    {
      id: 'cspm-executive',
      name: 'CSPM Executive Dashboard',
      widgets: [
        {
          id: 'widget-1',
          name: 'Cloud Accounts',
          text: 'Connected (2)\nNot Connected (2)',
          type: 'donut',
          chartData: [
            { name: 'Connected', value: 2, color: '#5470C6' },
            { name: 'Not Connected', value: 2, color: '#C4C4C4' }
          ]
        },
        {
          id: 'widget-2',
          name: 'Cloud Account Risk Assessment',
          text: 'Failed (1689)\nWarning (681)\nNot available (36)\nPassed (7253)',
          type: 'donut',
          chartData: [
            { name: 'Failed', value: 1689, color: '#C1232B' },
            { name: 'Warning', value: 681, color: '#FCCE10' },
            { name: 'Not available', value: 36, color: '#B7B7B7' },
            { name: 'Passed', value: 7253, color: '#27727B' }
          ]
        }
      ]
    },
    {
      id: 'cwpp-dashboard',
      name: 'CWPP Dashboard',
      widgets: [
        {
          id: 'widget-3',
          name: 'Top 5 Namespace Specific Alerts',
          text: 'Top 5 Namespace Specific Alerts',
          type: 'donut',
          chartData: [
            { name: 'Critical', value: 45, color: '#C1232B' },
            { name: 'High', value: 85, color: '#E87C25' },
            { name: 'Medium', value: 120, color: '#FCCE10' }
          ]
        },
        {
          id: 'widget-4',
          name: 'Workload Alerts',
          text: 'Workload Alerts',
          type: 'donut',
          chartData: [
            { name: 'Critical', value: 30, color: '#C1232B' },
            { name: 'High', value: 65, color: '#E87C25' },
            { name: 'Medium', value: 85, color: '#FCCE10' }
          ]
        }
      ]
    },
    {
      id: 'registry-scan',
      name: 'Registry Scan',
      widgets: [
        {
          id: 'widget-5',
          name: 'Image Risk Assessment',
          text: '1470 Total Vulnerabilities',
          type: 'bar',
          total: 1470,
          subtitle: 'Total Vulnerabilities',
          chartData: [
            { name: 'Critical', value: 9, color: '#C1232B' },
            { name: 'High', value: 150, color: '#E87C25' }
          ]
        },
        {
          id: 'widget-6',
          name: 'Image Security Issues',
          text: '2 Total Images',
          type: 'bar',
          total: 2,
          subtitle: 'Total Images',
          chartData: [
            { name: 'Critical', value: 2, color: '#C1232B' },
            { name: 'High', value: 2, color: '#B7B7B7' }
          ]
        }
      ]
    }
  ]
};

// ==================== REDUCER ====================
function dashboardReducer(state, action) {
  switch (action.type) {
    case 'ADD_WIDGET':
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id === action.payload.categoryId
            ? {
                ...cat,
                widgets: [...cat.widgets, action.payload.widget]
              }
            : cat
        )
      };
    case 'REMOVE_WIDGET':
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id === action.payload.categoryId
            ? {
                ...cat,
                widgets: cat.widgets.filter(w => w.id !== action.payload.widgetId)
              }
            : cat
        )
      };
    case 'TOGGLE_WIDGET':
      const widget = action.payload.widget;
      const categoryId = action.payload.categoryId;
      const category = state.categories.find(c => c.id === categoryId);
      const widgetExists = category.widgets.some(w => w.id === widget.id);
      
      if (widgetExists) {
        return {
          ...state,
          categories: state.categories.map(cat =>
            cat.id === categoryId
              ? {
                  ...cat,
                  widgets: cat.widgets.filter(w => w.id !== widget.id)
                }
              : cat
          )
        };
      } else {
        return {
          ...state,
          categories: state.categories.map(cat =>
            cat.id === categoryId
              ? {
                  ...cat,
                  widgets: [...cat.widgets, widget]
                }
              : cat
          )
        };
      }
    default:
      return state;
  }
}

// ==================== HEADER COMPONENT ====================
function Header({ searchQuery, onSearchChange }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Home &gt;</span>
          <span className="font-semibold text-sm">Dashboard V2</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm w-80"
            />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded">
            <RefreshCw size={16} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <span className="text-gray-600">⋮</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== WIDGET COMPONENT ====================
function Widget({ widget, onRemove }) {
  const renderContent = () => {
    if (widget.type === 'donut' && widget.chartData) {
      return (
        <div className="flex items-center justify-between">
          <div className="w-1/2">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={widget.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {widget.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center text-2xl font-bold mt-2">
              {widget.chartData.reduce((sum, item) => sum + item.value, 0)}
            </div>
            <div className="text-center text-xs text-gray-500">Total</div>
          </div>
          <div className="w-1/2 space-y-2">
            {widget.chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (widget.type === 'bar' && widget.chartData) {
      return (
        <div>
          <div className="mb-4">
            <div className="text-2xl font-bold">{widget.total || 0}</div>
            <div className="text-xs text-gray-500">{widget.subtitle || ''}</div>
          </div>
          <div className="relative">
            <div className="h-8 bg-gray-200 rounded-full overflow-hidden flex">
              {widget.chartData.map((item, index) => {
                const percentage = (item.value / widget.total) * 100;
                return (
                  <div
                    key={index}
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color
                    }}
                    className="h-full"
                  />
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex gap-4 text-xs">
            {widget.chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (widget.type === 'empty') {
      return (
        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div>{widget.text}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-gray-600 text-sm whitespace-pre-line">
        {widget.text}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 relative min-h-[200px]">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X size={16} />
      </button>
      <h3 className="font-semibold text-sm mb-3">{widget.name}</h3>
      {renderContent()}
    </div>
  );
}

// ==================== ADD WIDGET MODAL ====================
function AddWidgetModal({ isOpen, onClose, categories, onAddWidget, dashboard }) {
  const [selectedTab, setSelectedTab] = useState('CSPM');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [widgetName, setWidgetName] = useState('');
  const [widgetText, setWidgetText] = useState('');
  const [showManage, setShowManage] = useState(false);

  // Map tabs to category IDs
  const tabCategoryMap = {
    CSPM: 'cspm-executive',
    CWPP: 'cwpp-dashboard',
    Image: 'registry-scan',
    Ticket: 'ticket' // (can be empty for now)
  };

  const filteredCategories = categories.filter(
    cat => cat.id === tabCategoryMap[selectedTab]
  );

  const handleConfirm = () => {
    if (!selectedCategory || !widgetName || !widgetText) {
      alert('Please fill all fields');
      return;
    }

    const newWidget = {
      id: `widget-${Date.now()}`,
      name: widgetName,
      text: widgetText,
      type: 'custom'
    };

    onAddWidget(selectedCategory, newWidget);
    setWidgetName('');
    setWidgetText('');
    onClose();
  };

  const handleToggleWidget = (categoryId, widget) => {
    onAddWidget(categoryId, widget, true);
  };

  if (!isOpen) return null;

return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Widget</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <p className="text-sm text-gray-600 mb-4">
            Personalize your dashboard by adding the following widget
          </p>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b">
            {['CSPM', 'CWPP', 'Image', 'Ticket'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`pb-2 px-2 text-sm font-medium ${
                  selectedTab === tab
                    ? 'text-blue-900 border-b-2 border-blue-900'
                    : 'text-gray-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {!showManage ? (
            <>
              {filteredCategories.map(category => {
                const existingWidgets = dashboard.categories.find(c => c.id === category.id)?.widgets || [];
                const existingWidgetIds = existingWidgets.map(w => w.id);

                return (
                  <div key={category.id} className="mb-4">
                    <h3 className="font-semibold text-sm mb-2">{category.name}</h3>
                    <div className="space-y-2">
                      {category.widgets.map(widget => (
                        <label key={widget.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={existingWidgetIds.includes(widget.id)}
                            onChange={() => onAddWidget(category.id, widget, true)}
                            className="w-4 h-4"
                          />
                          <span>{widget.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => setShowManage(true)}
                className="text-blue-600 text-sm font-medium mt-4"
              >
                + Create Custom Widget
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">Choose a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Widget Name</label>
                <input
                  type="text"
                  value={widgetName}
                  onChange={(e) => setWidgetName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Enter widget name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Widget Text</label>
                <textarea
                  value={widgetText}
                  onChange={(e) => setWidgetText(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  rows="4"
                  placeholder="Enter widget text"
                />
              </div>

              <button
                onClick={() => setShowManage(false)}
                className="text-blue-600 text-sm font-medium"
              >
                ← Back to widget list
              </button>
            </div>
          )}
        </div>

        <div className="border-t p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm bg-blue-900 text-white rounded hover:bg-blue-800"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN DASHBOARD ====================
export default function Dashboard() {
  const [dashboard, dispatch] = useReducer(dashboardReducer, initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddWidget = (categoryId, widget, isToggle = false) => {
    if (isToggle) {
      dispatch({
        type: 'TOGGLE_WIDGET',
        payload: { categoryId, widget }
      });
    } else {
      dispatch({
        type: 'ADD_WIDGET',
        payload: { categoryId, widget }
      });
    }
  };

  const handleRemoveWidget = (categoryId, widgetId) => {
    dispatch({
      type: 'REMOVE_WIDGET',
      payload: { categoryId, widgetId }
    });
  };

  const filteredCategories = dashboard.categories.map(category => ({
    ...category,
    widgets: category.widgets.filter(widget =>
      widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }));

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold">CNAPP Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white border border-gray-300 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            Add Widget <Plus size={16} />
          </button>
        </div>

        {filteredCategories.map(category => (
          <div key={category.id} className="mb-8">
            <h2 className="text-base font-bold mb-4">{category.name}</h2>
            <div className="grid grid-cols-3 gap-4">
              {category.widgets.map(widget => (
                <div key={widget.id}>
                  <Widget
                    widget={widget}
                    onRemove={() => handleRemoveWidget(category.id, widget.id)}
                  />
                </div>
              ))}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 min-h-[200px] flex items-center justify-center hover:bg-gray-50"
              >
                <div className="text-center text-gray-500">
                  <Plus size={20} className="mx-auto mb-2" />
                  <span className="text-sm">Add Widget</span>
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddWidgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={initialData.categories}
        onAddWidget={handleAddWidget}
        dashboard={dashboard}
      />
    </div>
  );
}