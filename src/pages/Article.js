import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Article() {
  const { seq } = useParams();

  const [article, setArticle] = React.useState({});

  const [reply, setReply] = React.useState([]);

  const 게시판상세정보가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/article_row",
      params: {
        seq: seq,
      },
    }).then((response) => {
      setArticle(response.article);
      setReply(response.reply);
    });
  };

  React.useEffect(() => {
    게시판상세정보가져오기();
  }, []);

  const [replyText, setReplyText] = React.useState("");

  const 댓글정보저장 = (event) => {
    setReplyText(event.target.value);
  };

  const 댓글쓰기 = async () => {
    await axios({
      url: "http://localhost:4000/reply",
      method: "POST",
      data: {
        replyText: replyText,
        seq: seq,
      },
    }).then((response) => {});
  };

  return (
    <div className="ui-wrap">
      게시판 상세정보
      <div className="ui-body-wrap">
        <div className="ui-body">
          <h2>{article.title}</h2>
          <p>{article.body}</p>
        </div>

        <h3>댓글</h3>
        <div className="ui-reply">
          {reply.length > 0 &&
            reply.map((item, index) => {
              return <div>{item.body}</div>;
            })}
        </div>

        <form>
          <textarea onChange={댓글정보저장}></textarea>
          <button type="button" className="ui-blue-button" onClick={댓글쓰기}>
            댓글 쓰기
          </button>
        </form>
      </div>
    </div>
  );
}

export default Article;
