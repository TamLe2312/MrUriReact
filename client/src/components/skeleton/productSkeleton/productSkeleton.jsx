import "./productSkeleton.css";
const ProductSkeleton = () => {
  return (
    <div className="productSkeletonContainer">
      <div className="productSkeleton_img"></div>
      <div className="p-4 border border-secondary border-top-0 rounded-bottom productSkeletonRow">
        <div className="productSkeleton_title"></div>
        <div className="productSkeleton_description"></div>
        <div className="productSkeleton_price"></div>
        <div className="productSkeleton_button"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
