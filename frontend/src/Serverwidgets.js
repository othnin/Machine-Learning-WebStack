import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from "axios";
import './WidgetStyles.css'; 
import './App.css';


const WidgetNVIDIAInfo = () => {
  const [nvidiaInfo, setNvidiaInfo] = useState('');

  useEffect(() => {
    axios.get('/api/v1/widget_get_nvidia_info')
      .then(response => {
        setNvidiaInfo(response.data.output);
      })
      .catch(error => {
        console.error('Error fetching NVIDIA information:', error);
      });
  }, []);

  return (
    <>
      <h3 className="widget-title">NVIDIA SMI Information</h3>
      <div className="widget-content">
        <p>{nvidiaInfo}</p>
      </div>
    </>
  );
}


const WidgetCPU = () => {
  const [CPUpercent, setCPUPercent] = useState(0);
  const [GPUpercent, setGPUPercent] = useState(0);

  const fetchPerformanceCycles = () => {
    axios.get('/api/v1/widget_get_perf_cycles')
      .then(response => {
        setCPUPercent(response.data.cpu_percent);
        setGPUPercent(response.data.gpu_percent);
      })
      .catch(error => {
        console.error('Error fetching performance cycles:', error);
      });
  };

  useEffect(() => {
    fetchPerformanceCycles();
    const intervalId = setInterval(fetchPerformanceCycles, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <h3 className="widget-title">Performance Meters</h3>
      <div className="widget-content">
        <div className="performance-meter">
          <label>CPU Usage</label>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${CPUpercent}%`}}></div>
          </div>
          <span className="progress-text">{CPUpercent}%</span>
        </div>
        <div className="performance-meter">
          <label>GPU Usage</label>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${GPUpercent}%`}}></div>
          </div>
          <span className="progress-text">
            {GPUpercent === 'No GPU found' ? GPUpercent : `${GPUpercent}%`}
          </span>
        </div>
      </div>
    </>
  );
};

const WidgetSysInfo = () => {
  const [sysInfo, setSysInfo] = useState({
    os_output: '',
    ram_output: '',
    disk_output: '',
    gpu_output: ''
  });

  useEffect(() => {
    axios.get('/api/v1/widget_get_sys_info')
      .then(response => {
        setSysInfo(response.data);    
      })
      .catch(error => {
        console.error('Error fetching system information:', error);
      });
  }, []);

  return (
    <>
      <h3 className="widget-title">System Information</h3>
      <div className="widget-content">
        <div className="info-section">
          <h4>Operating System</h4>
          <p>{sysInfo.os_output}</p>
        </div>
        <div className="info-section">
          <h4>RAM</h4>
          <p>{sysInfo.ram_output}</p>
        </div>
        <div className="info-section">
          <h4>Disk</h4>
          <p>{sysInfo.disk_output}</p>
        </div>
        <div className="info-section">
          <h4>GPU</h4>
          <p>{sysInfo.gpu_output}</p>
        </div>
      </div>
    </>
  );
};

const Serverwidgets = () => {
  const [widgets, setWidgets] = useState([]);
  const draggedWidget = useRef(null);  // data types - id, x, y
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);  // data type - DOM element, container for widgets

  const addWidget = (widgetType) => {
    const newWidget = {
      id: `widget${widgets.length + 1}`,
      type: widgetType,
      x: (widgets.length * 20) % (window.innerWidth - 400), // Stagger horizontally was 320
      y: (widgets.length * 20) % (window.innerHeight - 600), // Stagger vertically was 420
    };

    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (widgetId) => {
    setWidgets(widgets.filter(widget => widget.id !== widgetId));
  };

  const onDragStart = useCallback((e, widget) => {
    if (!containerRef.current) return;
    
    draggedWidget.current = widget;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    dragOffset.current = {
      x: e.clientX - containerRect.left - widget.x,
      y: e.clientY - containerRect.top - widget.y,
    };

    // Prevent text selection during drag
    e.preventDefault();
  }, []);

  const onDrag = useCallback((e) => {
    if (draggedWidget.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      let newX = e.clientX - containerRect.left - dragOffset.current.x;
      let newY = e.clientY - containerRect.top - dragOffset.current.y;
  
      // Constrain the widget within the container
      newX = Math.max(0, Math.min(newX, containerRect.width - 400));
      newY = Math.max(0, Math.min(newY, containerRect.height - 600));
  
      setWidgets(widgets.map(w => 
        w.id === draggedWidget.current.id 
          ? { ...w, x: newX, y: newY } 
          : w
      ));
    }
  }, [widgets]);

  const onDragEnd = useCallback(() => {
    draggedWidget.current = null;
  }, []);

  const renderWidget = (widget) => {
    let WidgetComponent;
    switch (widget.type) {
      case 'CPU':
        WidgetComponent = WidgetCPU;
        break;
      case 'SysInfo':
        WidgetComponent = WidgetSysInfo;
        break;
      case 'NVIDIAinfo':
        WidgetComponent = WidgetNVIDIAInfo;
        break;
      default:
        return null;
    }

    return (
      <div
        key={widget.id}
        className="widget-container"
        style={{
          left: `${widget.x}px`,
          top: `${widget.y}px`,
        }}
      >
        <div className="widget-header">
          <div className="drag-handle" onMouseDown={(e) => onDragStart(e, widget)}>::</div>
          <button className="close-button" onClick={() => removeWidget(widget.id)}>×</button>
        </div>
        <WidgetComponent />
      </div>
    );
  };

  return (
    <div className="home-container">
      <select 
        onChange={(e) => addWidget(e.target.value)} 
        defaultValue="" 
        className="widget-selector"
      >
        <option value="" disabled>Add Widget</option>
        <option value="CPU">CPU & GPU Performance</option>
        <option value="SysInfo">System Information</option>
        <option value="NVIDIAinfo">NVIDIA SMI Info</option>
      </select>
      <div 
        ref={containerRef}
        className="widgets-container"
        onMouseMove={onDrag}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      >
        {widgets.map(renderWidget)}
      </div>
    </div>
  );
};
export default Serverwidgets;