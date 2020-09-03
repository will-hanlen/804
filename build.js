var md = require('markdown-it')();
var fs = require('fs');
var hb = require('handlebars');

// Blog Index: all of the files to be displayed and their metadata
blog = {
  essay: [
    {
      title: "Tool Traps",
      description: "Sometimes tools are just a distraction.",
      file: "tool_traps"
    },
    {
      title: "The Creativity Necessity",
      description: "How humans are made to build things.",
      file: "the_creativity_necessity"
    }
  ]
}


var homepageHandlebars = fs.readFileSync('index.handlebars', {encoding: "utf-8"});
var homepageTemplateFunction = hb.compile(homepageHandlebars);
var homepageHTML = homepageTemplateFunction(blog);

fs.writeFileSync('public/index.html', homepageHTML);


var blogHandlebars = hb.compile(fs.readFileSync('blog.handlebars', {encoding: "utf-8"}));
//var homepageHTML = homepageTemplateFunction(blog);

// Empty blog directory
if (fs.existsSync('public/blog')) {
  for (file of  fs.readdirSync("public/blog")) {
    fs.unlinkSync(`public/blog/${file}`);
  }
}

// Delete the blog directory
if (fs.existsSync('public/blog')) {
  fs.rmdirSync('public/blog', { recursive: true })
}

// Create a new, blank blog directory
fs.mkdirSync("public/blog")

// Go through the blog directory
for (file of  fs.readdirSync("blog")) {

  // Ignore files that have underscores at the beginning
  if (file[0] != "_") {

    // Get the markdown filename without the .md extension
    let filename = file.slice(0, file.indexOf("\."))

    // Read the markdown file
    let contents = fs.readFileSync(`blog/${file}`, {encoding: "utf8"});

    // Use first line as document title (without the # header symbol)
    title = contents.substr(2, contents.indexOf("\n"));

    // Render contents
    let article = md.render(contents)


    newHTML = blogHandlebars({content: article})


    // Write the new HTMl file
    fs.writeFileSync(`public/blog/${filename}.html`, newHTML);
  }
}
