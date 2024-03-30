import "./userSkeleton.css";
const UserSkeleton = () => {
  return (
    <tr className="userSkeletonContainer">
      <td className="userSkeletonItem">
        <div className="loader"></div>
      </td>
      <td className="userSkeletonItem">
        <div className="loader"></div>
      </td>
      <td className="userSkeletonItem">
        <div className="loader"></div>
      </td>
      <td className="userSkeletonItem">
        <div className="loader"></div>
      </td>
    </tr>
  );
};

export default UserSkeleton;
