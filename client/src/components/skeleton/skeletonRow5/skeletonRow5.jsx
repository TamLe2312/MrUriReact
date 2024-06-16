import "./skeletonRow5.css";

const SkeletonRow5 = () => {
  return (
    <tr className="skeletonRow5Container">
      <td className="skeletonRow5Item">
        <div className="loader"></div>
      </td>
      <td className="skeletonRow5Item">
        <div className="loader"></div>
      </td>
      <td className="skeletonRow5Item">
        <div className="loader"></div>
      </td>
      <td className="skeletonRow5Item">
        <div className="loader"></div>
      </td>
      <td className="skeletonRow5Item">
        <div className="loader"></div>
      </td>
    </tr>
  );
};

export default SkeletonRow5;
