// for dark mode
//https://flaviocopes.com/dark-mode/
const chk = document.getElementById('darkModeToggle');
chk.addEventListener('change', () => {
	console.log('local mode: ' + localStorage.getItem('mode'))
	if (localStorage.getItem('mode') === 'dark'){
		localStorage.setItem('mode', 'light'); 
		document.querySelector('body').classList.remove('dark')
		document.getElementById("darkModeToggle").checked = false;
	}
	else {
		localStorage.setItem('mode', 'dark'); 
		document.querySelector('body').classList.add('dark');
		document.getElementById("darkModeToggle").checked = true;
	}
 //    document.body.classList.toggle('dark');
	// document.getElementsByTagName('img')[0].classList.toggle('dark');
});

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',afterDOMLoaded);
} else {
    afterDOMLoaded();
}

function afterDOMLoaded(){
	console.log('init local mode: ' + localStorage.getItem('mode'))
  	if (localStorage.getItem('mode') === 'dark'){
		document.querySelector('body').classList.add('dark')
		document.getElementById("darkModeToggle").checked = true;
	}
	else {
		document.querySelector('body').classList.remove('dark');
		document.getElementById("darkModeToggle").checked = false;
	}
}

document.getElementById('_yPushState').addEventListener('y-push-state-load', function() {
	console.log('init local mode: ' + localStorage.getItem('mode'))
  	if (localStorage.getItem('mode') === 'dark'){
		document.querySelector('body').classList.add('dark')
		document.getElementById("darkModeToggle").checked = true;
	}
	else {
		document.querySelector('body').classList.remove('dark');
		document.getElementById("darkModeToggle").checked = false;
	}
});

// For back to top button
const showOnPx = 1000;
const backToTopButton = document.querySelector(".back-to-top")

const scrollContainer = () => {
  return document.documentElement || document.body;
};

document.addEventListener("scroll", () => {
  if (scrollContainer().scrollTop > showOnPx) {
    backToTopButton.classList.remove("hidden")
  } else {
    backToTopButton.classList.add("hidden")
  }
})

const goToTop = () => {
	document.body.scrollIntoView({
		behavior: "smooth",
	});
};

backToTopButton.addEventListener("click", goToTop)


// For reading progress bar
const pageProgressBar = document.querySelector(".progress-bar")
document.addEventListener("scroll", () => {
  const scrolledPercentage =
      ( (scrollContainer().scrollTop+10) /
        (scrollContainer().scrollHeight - scrollContainer().clientHeight)) *
      100;
  
  pageProgressBar.style.width = `${scrolledPercentage}%`
  
  if (scrollContainer().scrollTop > showOnPx) {
	pageProgressBar.style.opacity = '70%';
  } else {
    pageProgressBar.style.opacity = '0%';
  }
});


// For translate button
const translateButton = document.querySelector(".translate-button")

const translatePage = () => {
  const text = document.getElementById("_main").innerText
  const cjkChars = (text.match(/[\u3400-\u9fff]/g) || []).length
  const latinWords = (text.match(/[A-Za-z]+/g) || []).length
  const targetLang = cjkChars > latinWords ? "en" : "zh-CN"
  const pageUrl = location.href.split("#")[0]
  window.open(
    `https://translate.google.com/translate?sl=auto&tl=${targetLang}&u=${encodeURIComponent(pageUrl)}`,
    "_blank",
    "noopener"
  )
}

// Google's translated view (*.translate.goog) has its own language toolbar
if (location.hostname.endsWith(".translate.goog")) {
  translateButton.remove()
} else {
  translateButton.addEventListener("click", translatePage)
}