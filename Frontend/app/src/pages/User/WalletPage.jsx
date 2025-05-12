import React, { useEffect, useState } from "react";
import {
  Layout,
  InputNumber,
  Button,
  message,
  Spin,
  Typography,
  Table,
  Flex,
} from "antd";
import { PlusCircleOutlined, CreditCardOutlined } from "@ant-design/icons";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  loadBalance,
  getUserBalance,
  getBalanceHistory,
} from "../../services/UserService/WalletService";
import "../User/UserCss/WalletPage.css";

const { Title, Text } = Typography;

const WalletPage = () => {
  const [balance, setBalance] = useState(null);
  const [prevBalance, setPrevBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchBalance();
    fetchHistory(0);
  }, []);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const result = await getUserBalance();
      setPrevBalance(balance || 0);
      setBalance(result?.balance || 0);
      setUser(result);
    } catch {
      message.error("Bakiye alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (pageNum = 0) => {
    try {
      if (pageNum === 0) setLoadingHistory(true);
      else setLoadingMore(true);

      const data = await getBalanceHistory(pageNum, 10);

      if (Array.isArray(data?.content)) {
        const sortedData = data.content.sort(
          (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
        );

        setHistory((prev) => {
          // Yeni veriyi mevcut geçmişe ekleyin
          const combinedData = [...prev, ...sortedData];

          // Zaman sırasına göre sıralayın
          const uniqueHistory = combinedData
            .sort(
              (a, b) =>
                new Date(b.transaction_date) - new Date(a.transaction_date)
            )
            .filter(
              (value, index, self) =>
                index ===
                self.findIndex(
                  (t) => t.transaction_date === value.transaction_date
                )
            );

          return uniqueHistory;
        });

        setHasMore(data?.last ? false : true);
      } else {
        console.error("Geçersiz tarih verisi:", data);
        setHasMore(false);
      }
    } catch (error) {
      message.error("Cüzdan geçmişi alınamadı.");
    } finally {
      setLoadingHistory(false);
      setLoadingMore(false);
    }
  };

  const handleLoad = async () => {
    if (amount <= 0) {
      message.warning("Lütfen geçerli bir tutar giriniz.");
      return;
    }
    try {
      setLoading(true);
      await loadBalance({ balance: amount });
      message.success("Bakiye yüklendi.");

      // Yeni işlemi history'ye ekleyin
      const newTransaction = {
        description: "Bakiye Yüklemesi",
        amount: amount,
        transaction_date: new Date().toISOString(),
      };

      // Add new transaction to the history without duplicates
      setHistory((prev) => {
        const updatedHistory = [newTransaction, ...prev];

        // Remove duplicates by ensuring each transaction date is unique
        const uniqueHistory = updatedHistory.filter(
          (value, index, self) =>
            index ===
            self.findIndex((t) => t.transaction_date === value.transaction_date)
        );

        return uniqueHistory.sort(
          (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
        );
      });

      fetchBalance(); // Bakiye güncellemesini al
    } catch {
      message.error("Yükleme başarısız.");
    } finally {
      setLoading(false);
    }
  };

  // Table columns for transaction history
  const columns = [
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Tutar (₺)",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `${text} ₺`,
    },
    {
      title: "Tarih",
      dataIndex: "transaction_date",
      key: "transaction_date",
      render: (date) =>
        new Date(date).toLocaleString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      sorter: (a, b) => {
        return new Date(b.transaction_date) - new Date(a.transaction_date);
      },
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        className="wallet-layout"
        style={{
          marginLeft: collapsed ? 0 : 200,
        }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="wallet-content">
          <div className="wallet-main-layout">
            {/* Sol panel */}
            <div className="wallet-left-panel">
              <div className="credit-card">
                <div className="card-chip" />
                <div className="card-info">
                  <div className="card-type">
                    <CreditCardOutlined
                      style={{ fontSize: 24, color: "#fff" }}
                    />
                    <span style={{ marginLeft: 10 }}>Sanal Cüzdan</span>
                  </div>
                  <div className="card-balance">
                    <Text style={{ color: "#aaa" }}>Bakiye</Text>
                    <Title level={2} style={{ color: "#fff", margin: 0 }}>
                      {balance !== null ? (
                        <CountUp
                          start={prevBalance}
                          end={balance}
                          duration={1.5}
                          separator="."
                          decimals={2}
                          decimal=","
                          suffix=" ₺"
                        />
                      ) : (
                        "Yükleniyor..."
                      )}
                    </Title>
                  </div>
                  <div className="card-holder">
                    <Text style={{ color: "#fff" }}>
                      Kullanıcı: {user?.name || "Bilinmiyor"}
                    </Text>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 30 }}>
                <InputNumber
                  min={1}
                  value={amount}
                  onChange={setAmount}
                  style={{ width: "100%", marginBottom: 16 }}
                  placeholder="Tutar giriniz"
                />
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    style={{ width: "400px" }}
                    className="bakiyebuton"
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={handleLoad}
                    block
                  >
                    Bakiye Yükle
                  </Button>
                </div>
              </div>

              {loading && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <Spin />
                </div>
              )}
            </div>

            {/* Sağ panel - geçmiş */}
            <div className="wallet-right-panel">
              <Flex
                justify="space-between"
                align="center"
                style={{ marginBottom: 16 }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  Cüzdan Geçmişi
                </Title>
              </Flex>

              <Table
                columns={columns}
                dataSource={history}
                loading={loadingHistory}
                pagination={{
                  pageSize: 3,
                  onChange: (page) => {
                    setPage(page - 1);
                    fetchHistory(page - 1);
                  },
                  total: hasMore ? (page + 2) * 3 : (page + 1) * 3,
                }}
                rowKey={(record, index) => index}
                locale={{ emptyText: "Henüz bir işlem bulunmamaktadır." }}
                scroll={false}
              />
            </div>
          </div>
        </div>
        <Footer>
          <div className="pagination-inside-footer">
            <p className="footer-text">@Fashion Design</p>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default WalletPage;
