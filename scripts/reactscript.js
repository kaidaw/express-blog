import React from "react";
import ReactDOM from "react-dom";

function App() {
  let [blogs, setBlogs] = React.useState([]);
  React.useEffect(() => {
    fetch("/api/blog")
      .then((response) => {
        return response.json();
      })
      .then((info) => {
        setBlogs(info);
      });
  }, []);

  return (
    <div>
      <NewPost setBlogs={setBlogs}></NewPost>
      <OldPosts blogs={blogs} setBlogs={setBlogs}></OldPosts>
    </div>
  );
}

ReactDOM.render(<App></App>, document.getElementById("root"));

function NewPost({ setBlogs }) {
  let [postText, setPostText] = React.useState("");
  let newBlogText = "";
  return (
    <div>
      <button
        onClick={() => {
          let newId = JSON.stringify(Math.random());
          newBlogText = {
            title: postText,
            author: "(Unknown)",
            body: "(Empty)",
            image: "/images/redsquare.jpeg",
            id: newId,
          };

          fetch(`/blog/api/?newText=${JSON.stringify(newBlogText)}`, {
            method: "post",
          })
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              setBlogs(data);
            });
        }}
      >
        POST
      </button>
      <input
        onChange={(event) => {
          setPostText(event.target.value);
        }}
      ></input>
    </div>
  );
}

function OldPosts({ blogs, setBlogs }) {
  let [name, setName] = React.useState("");
  let [author, setAuthor] = React.useState("");
  let [body, setBody] = React.useState("");
  let [editMode, setEditMode] = React.useState(false);
  return blogs.map((blog, i) => {
    return (
      <div>
        <div>
          _________________________________________________________________
        </div>
        <div>
          _________________________________________________________________
        </div>
        <button
          onClick={() => {
            setEditMode(!editMode);
          }}
        >
          EDIT
        </button>
        {editMode ? (
          <div>
            <div>
              <input
                onChange={(event) => {
                  setName(event.target.value);
                }}
              ></input>
              <button
                onClick={() => {
                  fetch(`/blog/api/?edit=${blog.id}&name=${name}`, {
                    method: "post",
                  })
                    .then((response) => {
                      return response.json();
                    })
                    .then((data) => {
                      setBlogs(data);
                    });
                }}
              >
                RENAME
              </button>
            </div>
            <div>
              <input
                onChange={(event) => {
                  setAuthor(event.target.value);
                }}
              ></input>
              <button
                onClick={() => {
                  fetch(`/blog/api/?edit=${blog.id}&sign=${author}`, {
                    method: "post",
                  })
                    .then((response) => {
                      return response.json();
                    })
                    .then((data) => {
                      setBlogs(data);
                    });
                }}
              >
                SIGN
              </button>
            </div>
            <div>
              <input
                onChange={(event) => {
                  setBody(event.target.value);
                }}
              ></input>
              <button
                onClick={() => {
                  fetch(`/blog/api/?edit=${blog.id}&update=${body}`, {
                    method: "post",
                  })
                    .then((response) => {
                      return response.json();
                    })
                    .then((data) => {
                      setBlogs(data);
                    });
                }}
              >
                EDIT BLOG
              </button>
            </div>
          </div>
        ) : null}
        <div>
          <button
            onClick={() => {
              fetch(`/blog/api/?del=${blog.id}`, { method: "delete" })
                .then((response) => {
                  return response.json();
                })
                .then((data) => {
                  setBlogs(data);
                });
            }}
          >
            X
          </button>
          Title: {blog.title}
        </div>
        <div>Author: {blog.author}</div>
        <div>Blog: {blog.body}</div>
      </div>
    );
  });
}
