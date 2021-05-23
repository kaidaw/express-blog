import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

function App() {
  let [blogs, setBlogs] = React.useState([]);
  let [editMode, setEditMode] = React.useState({});

  React.useEffect(() => {
    fetch("/api/blog")
      .then((response) => {
        return response.json();
      })
      .then((info) => {
        setBlogs(info);
      })
      .then(() => {
        let editTracker = {};
        for (let blog of blogs) {
          editTracker[blog.id] = false;
        }
        setEditMode(editTracker);
      });
  }, []);

  return (
    <div>
      <Banner></Banner>
      <NewPost setBlogs={setBlogs}></NewPost>
      <OldPosts
        blogs={blogs}
        setBlogs={setBlogs}
        editMode={editMode}
        setEditMode={setEditMode}
      ></OldPosts>
      <Friends></Friends>
    </div>
  );
}

NewPost.propTypes = { setBlogs: PropTypes.function };

OldPosts.propTypes = {
  blogs: PropTypes.array,
  setBlogs: PropTypes.function,
  editMode: PropTypes.object,
  setEditMode: PropTypes.function,
};

ReactDOM.render(<App></App>, document.getElementById("root"));

function Banner() {
  return <div className="banner">BLOG</div>;
}

function useFriends() {
  let [friends, setFriends] = React.useState([]);

  React.useEffect(() => {
    fetch("/friends")
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        setFriends(data);
      });
  }, []);
  return friends;
}

function Friends() {
  let friends = useFriends();

  return friends.map((entry, i) => {
    return <div key={i}>FRIEND: {entry}</div>;
  });
}

function NewPost({ setBlogs }) {
  let [postText, setPostText] = React.useState("");
  let newBlogText = "";
  return (
    <div className="postbar">
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

function OldPosts({ blogs, setBlogs, editMode, setEditMode }) {
  let [name, setName] = React.useState("");
  let [author, setAuthor] = React.useState("");
  let [body, setBody] = React.useState("");

  // let obj = { one: 1 };

  return blogs.map((blog, i) => {
    return (
      <div key={blog.id}>
        <div className="divider">
          <div>
            _________________________________________________________________
          </div>
          <div>
            _________________________________________________________________
          </div>
        </div>
        <button
          id={i}
          onClick={() => {
            setEditMode({ ...editMode, [blog.id]: !editMode[blog.id] });
          }}
        >
          EDIT
        </button>
        {editMode[blog.id] ? (
          <div>
            <div>
              <input
                onChange={(event) => {
                  setName(event.target.value);
                }}
              ></input>
              <button
                className="submit"
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
                className="submit"
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
                className="submit"
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
            <button
              onClick={() => {
                for (let button of document.getElementsByClassName("submit")) {
                  button.click();
                }
                setEditMode({ ...editMode, [blog.id]: !editMode[blog.id] });
              }}
            >
              SUBMIT ALL CHANGES
            </button>
          </div>
        ) : null}
        <div className="blogtitle">
          <button
            className="deletebutton"
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
        <div className="blogauthor">Author: {blog.author}</div>
        <div className="blogbody">Blog: {blog.body}</div>
        <img className="img" src={blog.image} />
      </div>
    );
  });
}
