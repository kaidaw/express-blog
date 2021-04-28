export default function render(data) {
  document.body.innerHTML = "";
  var newPost = document.createElement("div");
  var post = document.createElement("button");
  var postMe = document.createTextNode("POST");
  post.appendChild(postMe);
  var inputField = document.createElement("input");
  inputField.id = "inputField";
  newPost.appendChild(post);
  newPost.appendChild(inputField);
  document.body.appendChild(newPost);
  let newBlogText = "";
  post.onclick = () => {
    let newId = JSON.stringify(Math.random());
    newBlogText = {
      title: document.getElementById("inputField").value,
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
        render(data);
      });
  };

  var blogs = document.createElement("div");
  for (let blog of data) {
    let where = "Blog: ";
    where += blog.title;
    let who = "By: ";
    who += blog.author;
    let what = "- ";
    what += blog.body;
    var del = document.createElement("button");
    var deleteMe = document.createTextNode("DEL");
    del.appendChild(deleteMe);
    del.onclick = () => {
      fetch(`/blog/api/?del=${blog.id}`, { method: "delete" })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          render(data);
        });
    };

    var editBox = document.createElement("input");
    editBox.id = blog.id;

    var edit = document.createElement("button");
    var editMe = document.createTextNode("EDIT");
    edit.appendChild(editMe);
    edit.onclick = () => {
      let update = document.getElementById(blog.id).value;
      fetch(`/blog/api/?edit=${blog.id}&update=${update}`, {
        method: "post",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          render(data);
        });
    };

    var sign = document.createElement("button");
    var signMe = document.createTextNode("SIGN");
    sign.appendChild(signMe);
    sign.onclick = () => {
      let sign = document.getElementById(blog.id).value;
      fetch(`/blog/api/?edit=${blog.id}&sign=${sign}`, {
        method: "post",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          render(data);
        });
    };

    var name = document.createElement("button");
    var nameMe = document.createTextNode("RENAME");
    name.appendChild(nameMe);
    name.onclick = () => {
      let name = document.getElementById(blog.id).value;
      fetch(`/blog/api/?edit=${blog.id}&name=${name}`, {
        method: "post",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          render(data);
        });
    };

    var blogTitle = document.createElement("div");
    var blogAuthor = document.createElement("div");
    var blogBody = document.createElement("div");
    var newBlog = document.createElement("div");
    var title = document.createTextNode(where);
    var author = document.createTextNode(who);
    var body = document.createTextNode(what);

    blogTitle.appendChild(title);
    newBlog.appendChild(name);

    blogAuthor.appendChild(author);
    newBlog.appendChild(sign);

    blogBody.appendChild(body);
    newBlog.appendChild(edit);

    blogTitle.className = "title";

    blogAuthor.className = "author";

    blogBody.className = "body";

    newBlog.appendChild(blogTitle);
    newBlog.appendChild(blogAuthor);
    newBlog.appendChild(blogBody);
    blogs.appendChild(del);
    blogs.appendChild(editBox);

    blogs.appendChild(newBlog);

    var spacer = document.createElement("div");
    var space = document.createTextNode(
      "==================================================="
    );
    spacer.appendChild(space);

    spacer.className = "spacer";

    var image = document.createElement("img");
    image.src = blog.image;
    blogs.appendChild(image);

    blogs.appendChild(spacer);
  }
  document.body.appendChild(blogs);
}
