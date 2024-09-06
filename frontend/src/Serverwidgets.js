import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import axios from "axios";
import './WidgetStyles.css'; 
import './App.css';


const WidgetNVIDIAInfo = () => {
  const [nvidiaInfo, setNvidiaInfo] = useState(0);

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
    <div className="modal-window widget-sysinfo drag-handle">
      <h3 className="modal-title">NVIDIA SMI Information</h3>
      <p>{nvidiaInfo}</p>
    </div>
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
    <div className="modal-window widget-cpu drag-handle">
      <h3 className="modal-title">Performance Meters</h3>
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
        {GPUpercent === 'No GPU found' ? GPUpercent : `${GPUpercent}%`}
      </div>
    </div>
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
    <div className="modal-window widget-sysinfo drag-handle">
      <h3 className="modal-title">System Information</h3>
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
  );
};

const Serverwidgets = () => {
  const [layout, setLayout] = useState([]);

  const addWidget = (widgetType) => {
    const newWidgetId = `widget${layout.length + 1}`;
    let newWidget;

    if (widgetType === 'CPU') {
      newWidget = { i: newWidgetId, x: 0, y: Infinity, w: 3, h: 2, component: WidgetCPU };
    } else if (widgetType === 'SysInfo') {
      newWidget = { i: newWidgetId, x: 3, y: Infinity, w: 5, h: 4, component: WidgetSysInfo };
    }
    else if (widgetType === 'NVIDIAinfo') {
      newWidget = { i: newWidgetId, x: 6, y: Infinity, w: 5, h: 4, component: WidgetNVIDIAInfo };
    }


    

    if (newWidget) {
      setLayout([...layout, newWidget]);
    }
  };

  const onLayoutChange = (newLayout) => {
    setLayout((prevLayout) =>
      newLayout.map((item) => {
        const existingItem = prevLayout.find((l) => l.i === item.i);
        return { ...existingItem, ...item };
      })
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
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        onLayoutChange={onLayoutChange}
      >
        {layout.map((item) => {
          const WidgetComponent = item.component;
          return (
            <div key={item.i} data-grid={item}>
              <WidgetComponent />
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
};

export default Serverwidgets;