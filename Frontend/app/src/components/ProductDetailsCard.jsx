import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Rate,
  Row,
  Col,
  Image,
  notification,
  Tooltip,
  Skeleton,
  Collapse,
} from "antd";
import { CardText, CardTitle } from "reactstrap";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import "../css/ProductDetailsCard.css";
import { addToCart } from "../services/ProductService/ShoppingCardService";
import {
  addFavorite,
  removeFavorite,
} from "../services/ProductService/FavoriteService";
import { getReviewCount } from "../services/ProductService/ReviewService";

const { Panel } = Collapse;

const ProductDetailsCard = ({ product, images }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (product) {
      setIsFavorite(
        product.favorite?.some((fav) => fav.product_id === product.id)
      );
    }

    if (product?.id) {
      getReviewCount(product.id)
        .then(setReviewCount)
        .catch((err) =>
          console.error("Yorum sayısı alınırken hata oluştu:", err)
        );
    }
  }, [product]);

  const toggleFavoriteHandler = async () => {
    try {
      let success;
      if (isFavorite) {
        success = await removeFavorite(product.id);
        if (success) setIsFavorite(false);
      } else {
        success = await addFavorite({
          id: product.id,
          categoryId: product.category_id,
          price: product.price,
          name: product.name,
        });
        if (success) setIsFavorite(true);
      }

      if (success) {
        notification.success({
          message: isFavorite
            ? "Favorilerden Kaldırıldı"
            : "Favorilere Eklendi",
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Hata",
        description: "Bir hata oluştu.",
        placement: "topRight",
      });
    }
  };

  const addToCartHandler = async () => {
    try {
      console.log("Seçilen Beden: ", selectedSize);
      const token = localStorage.getItem("token");
      if (!token) {
        notification.info({
          message: "Giriş Yapın",
          description: "Sepete ürün eklemek için giriş yapmalısınız.",
          placement: "topRight",
        });
        return;
      }
      if (!selectedSize) {
        notification.warning({
          message: "Beden Seçimi Gerekli",
          description: "Lütfen sepete eklemeden önce bir beden seçin.",
          placement: "topRight",
        });
        return;
      }

      await addToCart({
        product_id: product.id,
        size: selectedSize,
        quantity: 1,
        price: product.price,
        name: product.name,
      });

      notification.success({
        message: "Başarılı",
        description: "Ürün sepete eklendi.",
        placement: "topRight",
      });
    } catch (error) {
      notification.error({
        message: "Hata",
        description: "Sepete ekleme sırasında bir sorun oluştu.",
        placement: "topRight",
      });
    }
  };
  const availableSizes = React.useMemo(() => {
    if (typeof product?.quantity === "object" && product.quantity !== null) {
      const sizes = Object.entries(product.quantity)
        .filter(([size, count]) => count > 0)
        .map(([size, count]) => ({
          size,
          count,
        }));
      console.log("Available Sizes:", sizes); // Burada loglama yapıyoruz
      return sizes;
    }
    return [];
  }, [product]);

  return (
    <Card className="product-details-card">
      <Row gutter={16}>
        <Col span={10}>
          {images[0] ? (
            <Image
              className="zoom-image"
              width={400}
              src={images[0]}
              placeholder={
                <Skeleton.Image
                  active
                  style={{ width: 400, height: 400, borderRadius: "8px" }}
                />
              }
              preview={true}
            />
          ) : (
            <Skeleton.Image
              active
              style={{ width: 400, height: 400, borderRadius: "8px" }}
            />
          )}
        </Col>
        <Col span={14}>
          <h2 className="product-details-title">{product.name}</h2>

          <Tooltip title={`${reviewCount} yorum`}>
            <Rate
              allowHalf
              disabled
              defaultValue={product.averageRating || 0}
            />
          </Tooltip>
          <CardText className="product-info">
            Açıklama:
            <ul className="description-list">
              {product.description
                .split(".") // Noktaya göre ayır
                .filter((item) => item.trim() !== "") // Boş cümleleri at
                .map((item, index) => (
                  <li key={index} className={`font-style-${index % 3}`}>
                    {item.trim()}.
                  </li>
                ))}
            </ul>
          </CardText>

          <p style={{ marginTop: 4 }}>{reviewCount} yorum</p>

          <p className="product-details-price">{product.price} TL</p>

          {availableSizes.length > 0 && (
            <div className="size-selection">
              <p>Beden Seçin:</p>
              <div className="size-buttons">
                {availableSizes.map(({ size, count }) => (
                  <Button
                    key={size}
                    type={selectedSize === size ? "primary" : "default"}
                    disabled={count <= 0}
                    onClick={(e) => {
                      e.stopPropagation(); // kart yönlendirmesini engelle
                      setSelectedSize(size);
                      console.log("seçilen beden:", size);
                    }}
                    style={{ marginRight: "5px", marginBottom: "5px" }}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button type="primary" size="large" onClick={addToCartHandler}>
            Sepete Ekle
          </Button>

          <button
            className={`favoriteButton ${isFavorite ? "active" : ""}`}
            onClick={toggleFavoriteHandler}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {isFavorite ? (
              <HeartFilled style={{ color: "red", fontSize: "24px" }} />
            ) : (
              <HeartOutlined style={{ fontSize: "24px" }} />
            )}
          </button>

          {/* Açılır/Kapanır Bilgi Alanları */}
          <Collapse className="extra-collapse" bordered={false}>
            <Panel header="Model Bilgileri" key="1">
              <ul className="extra-info-list">
                <li>Modelin Üzerindeki Beden: S</li>
                <li>Modelin Ölçüleri: </li>
                <li>Boy: 175 cm</li>
                <li> Göğüs: 86 cm </li>
                <li>Bel: 60 cm</li>
                <li>Basen: 90 cm</li>
              </ul>
            </Panel>
            <Panel header="Satış Şartları" key="2">
              <ul className="extra-info-list">
                <li>Ücretsiz kargo ile gönderim</li>
                <li>14 gün içinde iade garantisi</li>
                <li>Kapıda ödeme seçeneği mevcut</li>
                <li>Tüm kredi kartlarına taksit imkanı</li>
              </ul>
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductDetailsCard;
