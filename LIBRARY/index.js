const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%BOOKNAME%}/g, product.bookname);
  output = output.replace(/{%WRITER%}/g, product.writer);
  output = output.replace(/{%PRICE%}/g, product.price);

  return output;
};

const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  ////// overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%BOOKS_CARDS%}", cardHtml);

    res.end(output);
  }
  /// Not found
  else {
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end("<h1>page not found!</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Lisrening to requests on port 8000");
});
