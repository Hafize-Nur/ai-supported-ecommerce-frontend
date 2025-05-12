import React from "react";
import { Pagination } from "antd";
import "../css/Pagination.css";
const App = () => (
  <Pagination
    className="pagination"
    total={85}
    showSizeChanger
    showQuickJumper
    showTotal={(total) => `Total ${total} items`}
  />
);
export default App;
