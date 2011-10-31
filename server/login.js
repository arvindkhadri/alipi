/* Copyright (c) 2007 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Sample code for Blogger's JavaScript client library. 
 * Provides an embeded blog post editor which grabs the title and location
 * of the current page for promotion on a user's blog.
 * @author api.jscudder@gmail.com (Jeffrey Scudder)
 */

// Load the Google data Blogger JavaScript library.
google.load('gdata', '2.x', {packages: ['blogger']});
google.setOnLoadCallback(addEditorToPage);
   
// Global object to hold constants and "global" variables.
var blogThis = {
  // URL constants.
  BLOG_LIST_URL: 'https://www.blogger.com/feeds/default/blogs',
  AUTH_URL: 'https://www.blogger.com/feeds',
  // Document element ID constants.
  SAMPLE_CONTAINER: 'blog_this',
  POST_BODY_INPUT: 'blog_post_body',
  EDITOR_DIV: 'blog_this_div',
  LOGIN_BUTTON: 'login_button',
  BLOG_SELECTOR: 'available_blogs',
  TITLE_INPUT: 'blog_post_title',
  TAGS_INPUT: 'blog_post_tags',
  RESULT_DIV: 'status_display'
};

/**
 * Simple error handler which displays the error in an alert box.
 * @param {Object} e An error passed in from the google.gdata.service 
 *     object when the HTTP call failed. 
 */
function handleError(e) {
  var statusDiv = document.getElementById(blogThis.RESULT_DIV);
  statusDiv.appendChild(document.createTextNode('Error: ' + 
      (e.cause ? e.cause.statusText : e.message)));
  statusDiv.appendChild(document.createElement('br'));
};

/**
 * Performs HTML escapes on special characters like double quotes, 
 * less-than, greater-than, and the ampersand. This function is used
 * on the page title to ensure that special characters do not lead to
 * invalid HTML when it is included in the atom:content.
 * I recommend using something like this on any text that you want
 * to be treated as plaintext within HTML content. 
 * @param {String} inputString The string which will be scrubbed.
 * @return {String} The input string with special characters replaced
 *     by their HTML-safe equivalents.
 */
function htmlEscape(inputString) {
  return inputString.replace(/&/g, '&amp;').replace(/"/g, '&quot;'
      ).replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

/**
 * Adds the HTML for the login and blog post editor to the sample 
 * container div. It also populates the contents of the blog post edit form
 * with a link to the current page. The current page's title is used as the 
 * anchor text.
 */
function addEditorToPage() {
  var sampleContainerDiv = document.getElementById(blogThis.SAMPLE_CONTAINER);
  sampleContainerDiv.innerHTML = [
      '<div id="login_button">',
      ' <input type="button" value="Login" onclick="login();"></input>',
      '</div>',
      '<div id="blog_this_div" style="display: none;">',
      '  Choose blog: <select id="available_blogs">',
      '    <option value="">Loading...</option>',
      '  </select><br/>',
      '  Title:<br/>',
      '  <input type="text" id="blog_post_title" size="80"></input><br/>',
      '  Post Body:<br/>',
      '  <div id="blog_post_body"></div><br/>',
      '  Labels (comma separated):<br/>',
      '  <input type="text" id="blog_post_tags" size="80"></input><br/>',
      '  <input type="button" value="Publish Post" ',
      '         onclick="insertBlogEntry();"></input>',
      '  <input type="button" value="Logout" onclick="logout();"></input><br/>',
      '</div>',
      '<div id="status_display"></div>'].join('');

  // Create the Blogger client object which talks to the blogger servers.
  blogThis.service = new google.gdata.blogger.BloggerService(
            'GoogleInc-blogThisEmbeddedEditor-1')
  // Get the title and address of the current page.
  var currentPageUrl = window.location.href;
  var pageTitle = document.title;
  // Set the contents of the body input field.
  var blogPostBody = document.getElementById(blogThis.POST_BODY_INPUT);
 // blogPostBody.value = ['<a href="', currentPageUrl, '">',htmlEscape(pageTitle), '</a>'].join('');
    y = localStorage.myContent.split('###');
    abc = [];
    for(var i=0;i<y.length;i++)
    {
	x=[];
	for(var j=0;j<y[i].split('&').length;j++)
	{
	    x[y[i].split('&')[j].split('=')[0]] = y[i].split('&')[j].split('=')[1];
	}
	abc.push(x);
    }
    postData = '';
    for (var i = 0;i<abc.length;i++)
    {
	if(abc[i].elementtype == 'audio/ogg')
	{
	    var aud = sprintf('<audio controls="controls" src="%s" about="%s" xpath="%s" alipius="lang:%s,elementtype:%s,location:%s,author:%s,style:%s"></audio>',decodeURIComponent(abc[i].data),decodeURIComponent(abc[i].about),decodeURIComponent(abc[i].xpath),decodeURIComponent(abc[i].lang),decodeURIComponent(abc[i].elementtype),decodeURIComponent(abc[i].location),decodeURIComponent(abc[i].author),decodeURIComponent(abc[i].style));
	    postData = postData + aud + '<br/>';
	}
	else if(abc[i].elementtype.match('image'))
	{
	    var width = decodeURIComponent(abc[i].data).split(',')[0].split('x')[0];
	    var height = decodeURIComponent(abc[i].data).split(',')[0].split('x')[1];
	    var img = sprintf('<img src="%s" about="%s" xpath="%s" alipius="lang:%s,elementtype:%s,location:%s,author:%s,style:%s" height=%s width=%s></img>',decodeURIComponent(abc[i].data).split(',')[1],decodeURIComponent(abc[i].about),decodeURIComponent(abc[i].xpath),decodeURIComponent(abc[i].lang),decodeURIComponent(abc[i].elementtype),decodeURIComponent(abc[i].location),decodeURIComponent(abc[i].author),decodeURIComponent(abc[i].style),height, width);
	    postData =postData + img + '<br/>';
	}
	else
	{
	    var p = sprintf('<p about="%s" xpath="%s" alipius="lang:%s,elementtype:%s,location:%s,author:%s,style:%s">%s</p>',decodeURIComponent(abc[i].about),decodeURIComponent(abc[i].xpath),decodeURIComponent(abc[i].lang),decodeURIComponent(abc[i].elementtype),decodeURIComponent(abc[i].location),decodeURIComponent(abc[i].author),decodeURIComponent(abc[i].style),decodeURIComponent(abc[i].data));
	    postData = postData + p + '<br/>';
	}
    }
    blogPostBody.innerHTML = postData;
    determineEditorVisibility();
};

/**
 * Populates the contents of the blog post edit form with a link to the
 * current page. The current page's title is used as the anchor text.
 */
function initializeBlogPostInput() {
  // Create the Blogger client object which talks to the blogger servers.
  blogThis.service = new google.gdata.blogger.BloggerService(
            'GoogleInc-blogThisEmbeddedEditor-1')
  // Get the title and address of the current page.
  var currentPageUrl = window.location.href;
  var pageTitle = document.title;
  // Set the contents of the body input field.
  var blogPostBody = document.getElementById(blogThis.POST_BODY_INPUT);
  blogPostBody.value = ['<a href="', currentPageUrl, '">', 
                        htmlEscape(pageTitle), '</a>'].join('');
  determineEditorVisibility();
};

/**
 * Makes the blog post editor div visible if the user is authenticated. If
 * the user is not authenticated with Blogger, the editor div is hidden
 * and the login button is made visible.
 */
function determineEditorVisibility() {
  var blogThisDiv = document.getElementById(blogThis.EDITOR_DIV);
  var loginButton = document.getElementById(blogThis.LOGIN_BUTTON);
  if (google.accounts.user.checkLogin(blogThis.AUTH_URL)) {
    // If the user is logged in, show the blow editor.
    blogThisDiv.style.display = 'inline';
    loginButton.style.display = 'none';
    // Request the feed to populate the editor's blog selection menu.
    blogThis.service.getBlogFeed(blogThis.BLOG_LIST_URL, receiveBlogList,
                                 handleError);
  } else {
    // The user cannot get a list of blogs, so display the login button.
    blogThisDiv.style.display = 'none';
    loginButton.style.display = 'inline';
  }
};

/**
 * Requests an AuthSub token for interaction with the Calendar service.
 */
function login() {
  var token = google.accounts.user.login(blogThis.AUTH_URL);
  determineEditorVisibility();
};

/**
 * Creates options in the blog editor's drop down blog selector box.
 * This method receives the results of a query for a list of the current
 * viewer's blogs. 
 * @param {Object} blogList An object containing a 
 *     google.gdata.blogger.BlogFeed. 
 */
function receiveBlogList(blogList) {
  // Clear any existing options from the blog selector.
  var selector = document.getElementById(blogThis.BLOG_SELECTOR);
  selector.innerHTML = '';
  // Find the titles and post links for each blog and populate the 
  // blog select options.
  var numBlogs = blogList.feed.getEntries().length;
  var newOption;
  for (var i = 0, entry; entry = blogList.feed.getEntries()[i]; ++i) {
    newOption = document.createElement('option');
    newOption.value = entry.getEntryPostLink().href;
    newOption.appendChild(document.createTextNode(
        entry.getTitle().getText()));
    // Add this as an option to the blog selector.
    selector.appendChild(newOption);
  }
};

/**
 * Revokes the authentication token for this application.
 * The editor div is then hidden and the login button is displayed.
 */
function logout() {
  google.accounts.user.logout();
  // Hide the editor div and make the login button visible.
  var blogThisDiv = document.getElementById(blogThis.EDITOR_DIV);
  var loginButton = document.getElementById(blogThis.LOGIN_BUTTON);
  blogThisDiv.style.display = 'none';
  loginButton.style.display = 'inline';
};

/**
 * Reads the contents of the blog post editor and sends it to the Blogger
 * servers as a new blog post.
 */
function insertBlogEntry() {
  // Find the target blog and the post URL.
  var blogSelector = document.getElementById(blogThis.BLOG_SELECTOR);
  var targetUrl = blogSelector.options[blogSelector.selectedIndex].value;
  // Create event.
  var blogPost = new google.gdata.blogger.PostEntry();
  // Add title - from the input field.
  var title = document.getElementById(blogThis.TITLE_INPUT).value;
  blogPost.setTitle(google.gdata.atom.Text.create(title));
  // Get the body from the input field.
  var body = document.getElementById(blogThis.POST_BODY_INPUT).innerHTML;
  // Set the content to be the body of the input form and tell the server
  // to interpret it as html.
  blogPost.setContent(google.gdata.atom.Text.create(body, 'html'));
  // Read the tags from the input form and add them as categories to 
  // the blog post entry.
  var tags = document.getElementById(blogThis.TAGS_INPUT).value;
  var tagList = tags.split(',');
  for (var i = 0, tag; tag = tagList[i]; ++i) {
    blogPost.addCategory(new google.gdata.atom.Category(
        {'scheme':'http://www.blogger.com/atom/ns#', 
         // Remove leading and trailing whitespace from the tag text.
         // If the tag begins or ends with whitespace, the Blogger server 
         // will remove the whitespace but send back 2 category elements,
         // one with the original term, and another with the stripped term.
         'term':tag.replace(/^\s+/g, '').replace(/\s+$/g, '')}));
  }
  blogThis.service.insertEntry(targetUrl, blogPost, handlePostSuccess, 
                               handleError);
};

/**
 * Displays the contents of the new blog post after the Blogger server 
 * responds to the POST request.
 * @param {Object} newBlogPost An object containing the 
 *     google.gdata.blogger.BlogPostEntry sent back from the server.
 */
function handlePostSuccess(newBlogPost) {
  // Get the div which displays the posted blog entries.
  var resultDiv = document.getElementById(blogThis.RESULT_DIV);
  resultDiv.appendChild(
      document.createTextNode('Your post about this page:'));
  resultDiv.appendChild(document.createElement('br'));
      
  // Create a link to the blog post with the post's title as the anchor 
  // text.
  var titleElement = document.createElement('a');
  titleElement['href'] = newBlogPost.entry.getHtmlLink().href;
  titleElement.appendChild(
      document.createTextNode(newBlogPost.entry.getTitle().getText()));
  
  var bodyElement = document.createElement('<div>');
  // Displays the source HTML of the post's body. To display the actual
  // HTML (render it instead of displaying the source text) you could
  // set the innerHTML of the body element instead of creating a text 
  // node.
  bodyElement.innerHTML = newBlogPost.entry.getContent().getText();

  // Display the tags for this entry in a paragraph below the body.
  var tagsElement = document.createElement('p');
  var myTagsList = [];
  var categories = newBlogPost.entry.getCategories();
  for (var i = 0, category; category = newBlogPost.entry.getCategories()[i]; ++i) {
    myTagsList.push(category.term);
  }
  tagsElement.appendChild(document.createTextNode(myTagsList.join(', ')));

  resultDiv.appendChild(titleElement);
  resultDiv.appendChild(bodyElement);
  resultDiv.appendChild(tagsElement);

    var xhr = new XMLHttpRequest();
    xhr.open('POST','http://dev.a11y.in/scrape',true)
    xhr.send('url='+newBlogPost.entry.getHtmlLink().href);
};

