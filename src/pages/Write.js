import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Write() {
  const navigation = useNavigate();

  const [data, setData] = React.useContext({
    title: "",
    body: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 작성 = async () => {
    await axios({
      url: "http://localhost:4000/write",
      method: "POST",
      data: data,
    }).then((response) => {
      if (response.data.code === "success") {
        alert(response.data.message);
        navigation("/article");
      }
    });
  };

  return (
    <div>
      <h2>게시글 작성</h2>
      <h3>제목</h3>
      <input name="title" onChange={데이터변경} />
      <h3>내용</h3>
      <textarea
        name="body"
        onChange={데이터변경}
        cols="50"
        rows="10"
      ></textarea>
      <button type="button" style={{ marginTop: 12 }} onClick={작성}>
        작성하기
      </button>
    </div>
  );
}

export default Write;
