(function() {
  "use strict";
  var url = "http://perltricks.com/perlybot/links.json";
  var httpRequest, response, ul, i, div, css_link, head;

  if (window.XMLHttpRequest) {
      httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = buildLinksList;
      httpRequest.open("GET", url, true);
      httpRequest.send();
  }

  function buildLinksList() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        response = JSON.parse(httpRequest.responseText);
        ul = '<ul>';
        for (i=0; i < 10; i++){
          ul += '<li><a href="' + response[i].url + '">' + response[i].title + '</a><br/>' + extractDomain(response[i].url) + '</li>';
        }
        ul += '</ul>';
        var div = document.getElementById("toplinks");
        div.innerHTML = '<div class="toplinksheader">LATEST COMMUNITY ARTICLES</div>' + ul;

        // now append css
        head = document.getElementsByTagName('head')[0];
        css_link = document.createElement('link');
        css_link.setAttribute('rel','stylesheet');
        css_link.setAttribute('type','text/css');
        css_link.setAttribute('href','/widgets/toplinks/style.css');
        head.appendChild(css_link);
      }
      else {
        console.log("Error requesting " + url);
      }
    }
  }
  function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
  }
})();
