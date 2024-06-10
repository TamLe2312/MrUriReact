import "./skeletonRow3.css";
const SkeletonRow3 = () => {
  return (
    <tr className="skeletonRow3Container">
      <td className="skeletonRow3Item">
        <div className="loader"></div>
      </td>
      <td className="skeletonRow3Item">
        <div className="loader"></div>
      </td>
      <td className="skeletonRow3Item">
        <div className="loader"></div>
      </td>
    </tr>
  );
};

export default SkeletonRow3;
