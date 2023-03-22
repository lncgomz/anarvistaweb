function takeScreenshot() {
    var iframe = document.getElementById("vrIFrame");
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    innerDoc
      .querySelector("a-scene")
      .components.screenshot.capture("equirectangular");
  }

  function retrieveLinks() {
    fetch("./links.json")
      .then((response) => response.json())
      .then((json) => {
        var iframe = document.getElementById("vrIFrame");
        var innerDoc =
          iframe.contentDocument || iframe.contentWindow.document;
        innerDoc.getElementById("links").value = json;
      });
  }