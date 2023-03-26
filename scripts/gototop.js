	
var elem = document.createElement('button');
elem.title = "Go to top";
elem.onclick = function (){
  var bodyRect = document.body.getBoundingClientRect()
  var rect = document.getElementById("intro").getBoundingClientRect();
  var rect2 = document.getElementById("topnav").getBoundingClientRect();
  document.body.scrollTop = rect.bottom - bodyRect.top - rect2.bottom;
  //document.documentElement.scrollTop = rect.bottom - bodyRect.top - rect2.bottom;
  window.scroll({ 
    top: rect.bottom - bodyRect.top - rect2.bottom, // could be negative value
      left: 0, 
      behavior: 'smooth' 
  });
};
elem.style.cssText = 'display: block; width: 50px; height: 50px; position: fixed; bottom: -50px; opacity: 0; right: 30px; z-index: 99; font-size: 16px; border: 2px solid #777; outline: none; background-color: white; color: #777; cursor: pointer; padding: 13px; text-align: center; border-radius: 50%; -webkit-transition: bottom 500ms, opacity 500ms; /* Safari */ transition: bottom 500ms, opacity 500ms;';
elem.classList.add('shadow', 'fa', 'fa-chevron-up', 'gototop');
document.body.appendChild(elem);

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = 'button.gototop:hover {background-color: #777 !important; color: white !important;}';
document.getElementsByTagName('head')[0].appendChild(style);

window.onscroll = function() {
  if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
    elem.style.bottom = "50px";
    elem.style.opacity = "1";
  } else {
    elem.style.bottom = "-50px";
    elem.style.opacity = "0";
  }
}
