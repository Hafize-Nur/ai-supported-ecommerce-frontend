import React, { useState } from "react";
import { Input, List, Spin, message } from "antd";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import "../css/SearchBar.css";

const { Search } = Input;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchResults = debounce(async (searchQuery) => {
    if (!searchQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8082/api/productElastic/v1/autocomplete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: searchQuery }),
        }
      );

      if (!response.ok) {
        throw new Error("Arama başarısız");
      }

      const products = await response.json();

      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          try {
            const imageResponse = await fetch(
              `http://localhost:8082/api/image/v1/infos/${product.id}`
            );
            if (!imageResponse.ok) throw new Error("Resim yüklenemedi");
            const imageData = await imageResponse.json();
            const images = imageData.map(
              (base64) => `data:image/jpeg;base64,${base64}`
            );
            return { ...product, image: images[0] || null };
          } catch {
            return { ...product, image: null };
          }
        })
      );

      setResults(productsWithImages);
    } catch (error) {
      console.error("Arama hatası:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleSearch = (value) => {
    setQuery(value);
    fetchResults(value);
    setTimeout(() => {
      if (results.length > 0) {
        navigate(`/user/ProductDetails/${results[0].id}`);
      }
    }, 500);
  };

  const handleItemClick = async (id) => {
    console.log("Seçilen ürün ID:", id);
    setQuery("");
    setResults([]);

    try {
      const response = await fetch(
        `http://localhost:8082/api/product/v1/${id}`
      );
      if (!response.ok) {
        throw new Error("Ürün bulunamadı");
      }

      const productData = await response.json();

      navigate(`/user/ProductDetails/${id}`);
    } catch (error) {
      console.error("Ürün kontrol edilirken hata:", error);
      message.error("Ürün bulunamadı!");
      navigate("/user/Products");
    }
  };

  return (
    <div className="search-container">
      <Search
        placeholder="Ürün ara..."
        onChange={(e) => handleSearch(e.target.value)}
        onSearch={handleSearch}
        value={query}
        allowClear
        enterButton="Ara"
        size="large"
      />
      {loading && <Spin className="search-spin" />}
      {results.length > 0 && (
        <List
          className="search-list"
          size="small"
          bordered
          dataSource={results}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleItemClick(item.id)}
              style={{ cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      marginRight: 10,
                    }}
                  />
                )}
                <div>
                  <strong>{item.name}</strong>
                  <p style={{ margin: 0 }}>{item.description}</p>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default SearchBar;
