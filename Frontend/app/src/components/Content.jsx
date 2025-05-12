import React from "react";
import { Layout, theme } from "antd";
import "../css/Content.css";

const { Content } = Layout;

const ContentComponent = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Content style={{ margin: "24px 16px 0" }}>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        content
      </div>
    </Content>
  );
};

export default ContentComponent;
