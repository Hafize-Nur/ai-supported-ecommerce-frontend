import React, { useState, useEffect } from "react";
import { Checkbox, Modal, Button } from "antd";

const AgreementCheckbox = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreementText, setAgreementText] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetch("/Agreement.txt")
      .then((res) => res.text())
      .then((text) => setAgreementText(text))
      .catch((err) => console.error("Sözleşme yüklenemedi:", err));
  }, []);

  return (
    <>
      <Checkbox>
        <span
          onClick={showModal}
          style={{
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Sözleşmeyi
        </span>{" "}
        okudum, kabul ediyorum.
      </Checkbox>

      <Modal
        title="Üyelik Sözleşmesi"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        <pre style={{ whiteSpace: "pre-wrap" }}>{agreementText}</pre>
      </Modal>
    </>
  );
};

export default AgreementCheckbox;
