import React from "react";
import axios from "axios";

function MyPage() {
  const [pic, setPic] = React.useState();

  const 추천받은목록가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/myBread",
      method: "GET",
    }).then((response) => {
      setPic(response.data);
    });
  };

  React.useEffect(() => {
    추천받은목록가져오기();
  }, []);

  return (
    <div>
      <h2>추천 받은 빵</h2>
    </div>
  );
}

export default MyPage;
