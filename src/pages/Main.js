import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Main() {
  const StoreContext = React.createContext({});
  const navigation = useNavigate();
  const { loginUser } = React.useContext(StoreContext);
  const [article, setArticle] = React.useContext([]);

  const 게시글정보가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/article",
      method: "GET",
    }).then((response) => {
      setArticle(response.data);
    });
  };

  React.useEffect(() => {
    게시글정보가져오기();
  }, []);

  const 글등록페이지이동 = () => {
    navigation("/write");
  };

  return (
    <div>
      안녕하세요 {loginUser.nickname}님!
      <div>
        <h2>빵 후기 미리보기</h2>
        <table className="ui-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>내용</th>
              <th>작성자</th>
            </tr>
          </thead>
          <tbody>
            {article.length > 0 &&
              article.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>{item.body}</td>
                    <td>{item.user_seq}</td>
                  </tr>
                );
              })}
          </tbody>
          <button className="ui-brown-button" onClick={글등록페이지이동}>
            글 등록
          </button>
        </table>
      </div>
    </div>
  );
}

export default Main;
