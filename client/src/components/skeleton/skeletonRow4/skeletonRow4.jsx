import "./skeletonRow4.css";

const SkeletonRow4 = () => {
  return (
    <tr className="skeletonRow4Container">
      <td className="skeletonRow4Item">
        <div className="loader"></div>
      </td>
      <td className="skeletonRow4Item">
        <div className="loader"></div>
      </td>
      <td className="skeletonRow4Item">
        <div className="loader"></div>
      </td>
      <td className="skeletonRow4Item">
        <div className="loader"></div>
      </td>
    </tr>
  );
};

export default SkeletonRow4;
