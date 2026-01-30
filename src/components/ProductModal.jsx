import { useEffect, useRef } from "react";
import * as bootstrap from "bootstrap";
import { uploadImage } from "../api/Api";

function ProductModal({
  // 從父層傳來
  isOpen,
  onClose,
  modalMode, // 新增或修改
  tempProduct, // 資料本身
  onInputChange,
  onImageChange,
  onAddImage,
  onRemoveImage,
  onSubmit,
  onUploadImage,
}) {
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

  // 關閉時通知父層
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal fade" ref={modalRef} tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {modalMode === "create" ? "新增產品" : "編輯產品"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          <div className="modal-body">
            <form>
              <div className="row text-start">
                {/* 商品標題 */}
                <div className="col-12 mb-2">
                  <label htmlFor="title" className="form-label">
                    商品標題
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={tempProduct.title}
                    onChange={onInputChange}
                    placeholder="請輸入商品標題"
                  />
                </div>

                {/* 商品描述 */}
                <div className="col-6 mb-5">
                  <label htmlFor="content" className="form-label">
                    商品描述
                  </label>
                  <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    value={tempProduct.content}
                    onChange={onInputChange}
                    placeholder="請輸入商品描述"
                    rows={3}
                  />
                </div>
                {/* 商品說明 */}
                <div className="col-6 mb-3">
                  <label htmlFor="description" className="form-label">
                    商品說明
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={tempProduct.description}
                    onChange={onInputChange}
                    placeholder="請輸入商品說明"
                    rows={3}
                  />
                </div>

                {/* 商品原價 */}
                <div className="col-3 mb-3">
                  <label htmlFor="origin_price" className="form-label">
                    商品原價
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="origin_price"
                    name="origin_price"
                    value={tempProduct.origin_price}
                    onChange={onInputChange}
                    placeholder="請輸入商品原價"
                    min="0"
                  />
                </div>
                {/* 商品售價 */}
                <div className="col-3 mb-3">
                  <label htmlFor="price" className="form-label">
                    商品售價
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={tempProduct.price}
                    onChange={onInputChange}
                    placeholder="請輸入商品售價"
                    min="0"
                  />
                </div>
                {/* 商品單位 */}
                <div className="col-3 mb-3">
                  <label htmlFor="unit" className="form-label">
                    商品單位
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="unit"
                    name="unit"
                    value={tempProduct.unit}
                    onChange={onInputChange}
                    placeholder="例如：塊"
                  />
                </div>

                {/* 商品分類 */}
                <div className="col-3 mb-3">
                  <label htmlFor="category" className="form-label">
                    商品分類
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    name="category"
                    value={tempProduct.category}
                    onChange={onInputChange}
                    placeholder="請輸入商品分類"
                  />
                </div>

                {/* 上傳圖片區 */}
                <div className="col-12 mb-3">
                  <label htmlFor="fileUpload" className="form-label">
                    上傳圖片
                  </label>
                  <input
                    className="form-control mb-1"
                    type="file"
                    name="fileUpload"
                    id="fileUpload"
                    accept=".jpg, .jepg, .png"
                    onChange={onUploadImage}
                  />
                </div>
                {/* 商品主圖 */}
                <div className="col-12 mb-3">
                  <label htmlFor="imageUrl" className="form-label">
                    商品主圖片網址
                  </label>
                  <input
                    type="url"
                    className="form-control mb-2"
                    id="imageUrl"
                    name="imageUrl"
                    value={tempProduct.imageUrl}
                    onChange={onInputChange}
                    placeholder="請輸入圖片網址"
                  />
                  {/* 預覽圖片 */}
                  {tempProduct.imageUrl && (
                    <img
                      src={tempProduct.imageUrl}
                      alt="預覽主圖"
                      className="img-fluid mt-2"
                      style={{ height: "100px" }}
                    />
                  )}
                </div>

                {/* 商品副圖 */}
                <div className="col-12 mb-3 border border-primary p-3">
                  <div className="row">
                    <p className="col-12">更多圖片</p>
                  </div>
                  <div className="col-12 d-flex gap-2">
                    {tempProduct.imagesUrl?.map((url, index) => (
                      <div key={index} className="mb-3">
                        <label className="form-label">副圖 {index + 1}</label>
                        <input
                          type="url"
                          className="form-control mb-1"
                          value={url}
                          onChange={(e) => onImageChange(index, e.target.value)}
                          placeholder="請輸入副圖網址"
                        />
                        {/* 預覽圖 */}
                        {url && (
                          <img
                            src={url}
                            alt={`副圖${index + 1}`}
                            className="img-fluid"
                            style={{ height: "100px", objectFit: "cover" }}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 多圖新增 + 刪除按鈕 */}
                  <div className="col-12 btn-group ">
                    {/* 如果陣列為空或最後一格有寫東西 -> 才能新增下一張 */}
                    {tempProduct.imagesUrl?.length < 5 &&
                      tempProduct.imagesUrl[
                        tempProduct.imagesUrl.length - 1
                      ] !== "" && (
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={onAddImage}
                        >
                          新增圖片
                        </button>
                      )}

                    {/* 如果有圖片才顯示刪除按鈕 */}
                    {tempProduct.imagesUrl?.length > 0 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={onRemoveImage}
                      >
                        刪除最後一張
                      </button>
                    )}
                  </div>
                </div>

                {/* 商品是否啟用 */}
                <div className="col-12">
                  <p className="mb-2">是否啟用</p>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="is_enabled"
                      id="is_enabled"
                      value="1"
                      checked={tempProduct.is_enabled === 1}
                      onChange={onInputChange}
                    />
                    <label className="form-check-label" htmlFor="is_enabled">
                      啟用
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="is_enabled"
                      id="is_unabled"
                      value="0"
                      checked={tempProduct.is_enabled === 0}
                      onChange={onInputChange}
                    />
                    <label className="form-check-label" htmlFor="is_unabled">
                      未啟用
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSubmit}
            >
              {modalMode === "create" ? "確認新增" : "確認修改"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
