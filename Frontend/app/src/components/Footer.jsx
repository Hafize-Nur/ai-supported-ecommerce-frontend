import React from "react";
import { Layout } from "antd";
import "../css/Footer.css";

const { Footer } = Layout;

const FooterComponent = ({ children }) => (
  <Footer className="site-layout-footer">{children}</Footer>
);

export default FooterComponent;
