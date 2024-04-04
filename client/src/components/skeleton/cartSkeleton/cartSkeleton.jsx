import "./cartSkeleton.css";

const CartSkeleton = () => {
  return (
    <>
      <tr className="cartSkeletonContainer">
        <td className="cartSkeletonItem">
          <div className="loader"></div>
        </td>
        <td className="cartSkeletonItem">
          <div className="loader"></div>
        </td>
        <td className="cartSkeletonItem">
          <div className="loader"></div>
        </td>
        <td className="cartSkeletonItem">
          <div className="loader"></div>
        </td>
        <td className="cartSkeletonItem">
          <div className="loader"></div>
        </td>
        <td className="cartSkeletonItem">
          <div className="loader"></div>
        </td>
      </tr>
    </>
  );
};

export default CartSkeleton;
