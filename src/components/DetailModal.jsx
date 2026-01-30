import { useEffect, useRef } from "react";
import * as bootstrap from "bootstrap";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

function DetailModal({ tempProduct, isOpen, onClose }) {
  const modalRef = useRef(null);
  const bsModalRef = useRef(null);

  // modal 開關設定
  // 初始化
  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    // 建立實體
    const modalInstance = new bootstrap.Modal(modalElement, {
      backdrop: true, // 可以點背景關閉
      keyboard: true, // 可以點 esc 關閉
    });
    bsModalRef.current = modalInstance;

    // 只有在元件真的要消失時，才 dispose modal
    return () => {
      modalInstance.dispose();
    };
  }, []); // 空陣列 -> 保證只建立一次

  // 監聽 isOpen 狀態
  useEffect(() => {
    const modalInstance = bsModalRef.current;
    if (!modalInstance) return;

    if (isOpen) {
      modalInstance.show();
    } else {
      modalInstance.hide();
    }
  }, [isOpen]); // 只有 isOpen 變了才執行 show/hide

  // 監聽 modal 的關閉事件 -> 同步到 state
  useEffect(() => {
    const modalElement = modalRef.current;
    // 監聽 Bootstrap 原生的 hidden.bs.modal 事件
    const performClose = () => {
      if (isOpen) {
        onClose();
      }
    };

    modalElement.addEventListener("hidden.bs.modal", performClose);

    // cleanup function
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", performClose);
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal fade" ref={modalRef} tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header bg-dark">
            <h5 className="modal-title text-light">商品明細</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            {tempProduct ? (
              <>
                {tempProduct.imageUrl ? (
                  <img
                    src={tempProduct.imageUrl}
                    className="img-fluid mb-3 rounded-3"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                    alt={tempProduct.title || "商品圖片"}
                  />
                ) : (
                  <div
                    className="bg-light d-flex align-items-center justify-content-center"
                    style={{ width: "200px", height: "200px" }}
                  >
                    <span className="text-waring">暫無圖片</span>
                  </div>
                )}

                <h6 className="fs-2 fw-bold">
                  {tempProduct.title}
                  <span className="fs-6 badge bg-dark ms-2 fw-medium">
                    {tempProduct.category}
                  </span>
                </h6>
                <p>商品內容：{tempProduct.content}</p>
                <p>商品描述：{tempProduct.description}</p>
                <p>商品人氣：{tempProduct.trending}</p>
                <p>
                  商品售價：
                  <del className="mx-1 text-muted">
                    {tempProduct.origin_price}
                  </del>
                  /
                  <span className="fw-bold mx-1 text-success">
                    {tempProduct.price}
                  </span>
                </p>

                <div className="imagesUrl">
                  {tempProduct.imagesUrl?.length > 0 ? (
                    <Swiper
                      className="custom-swiper"
                      modules={[Navigation]}
                      spaceBetween={12}
                      slidesPerView={3}
                      navigation
                      style={{
                        paddingBottom: "40px",
                        paddingLeft: "50px",
                        paddingRight: "50px",
                      }}
                    >
                      {tempProduct.imagesUrl.map((url, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={url}
                            className="rounded-3"
                            style={{
                              width: "100%",
                              height: "120px",
                              objectFit: "cover",
                            }}
                            alt={`副圖 ${index + 1}`}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <p className="text-muted">無其他圖片</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-secondary">請選擇一個商品查看細節</p>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
