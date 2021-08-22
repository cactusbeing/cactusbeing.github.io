class Artical {
    // Private
    parse_number;
    subtitle;

    // Public
    constructor(title, date, poster) {
        this.title = title;
        this.date = date;
        this.poster = poster;
    }
}

var postlist = [
    new Artical("有多少人覺得：理組腦、不被情緒左右、賺很多錢，三者兼具才是成功？", "July 23, 2021", "準純"),
    new Artical("是平權還是特權？是為你好，還是二次傷害？", "July 30, 2021", "準純"),
    new Artical("情緒行為障礙各類型疾患&介入方法", "July 11, 2021", "準純"),
    new Artical("淺談情緒行為障礙", "July 11, 2021", "準純"),
    new Artical("家長大哉問 - 親師合作一起解決問題！", "July 7, 2021", "準純"),
    new Artical("融合教育是什麼？準備新制教師資格考必看！", "July 7, 2021", "準純"),
]

var set_hot_post = new Artical("是平權還是特權？是為你好，還是二次傷害？", "July 30, 2021", "準純");
set_hot_post.subtitle = "積極差別待遇不是特權，可是……什麼是「合理的」積極差別待遇?";

// List
if (document.getElementById("post-preview") != null) {
    // Parse Date Value
    for (var i = 0; i < postlist.length; i++) {
        postlist[i].parse_number = Date.parse(postlist[i].date);
    }

    // Sort By date
    postlist.sort(function (a, b) {
        return (b.parse_number - a.parse_number);
    })

    var post_preview = document.getElementById("post-preview");
    for (var i = 0; i < postlist.length; i++) {
        post_preview.innerHTML += `
            <div class="post-preview">
            <a href=${postlist[i].title}.html>
                <h2 class="post-title">${postlist[i].title}</h2>
            </a>
            <p class="post-meta">
                Posted by
                <a href="https://medium.com/@cactusbeing"> ${postlist[i].poster} </a>
                on ${postlist[i].date}
            </p>
            </div>
        `;

        if (i != postlist.length - 1) {
            post_preview.innerHTML += `
            <!-- Divider-->
            <hr class="my-4" />
            `;
        }
    }
}

// Hot Post
if (document.getElementById("hotpost") != null) {
    var hp = document.getElementById("hotpost");
    
    hp.innerHTML = `
        <div class="post-preview">
        <a href=${set_hot_post.title}.html>
            <h2 class="post-title">${set_hot_post.title}</h2>
            <h3 class="post-subtitle">${set_hot_post.subtitle}</h3>
        </a>
        <p class="post-meta">
            Posted by
            <a href="https://medium.com/@cactusbeing"> ${set_hot_post.poster} </a>
            on ${set_hot_post.date}
        </p>
        `;
}