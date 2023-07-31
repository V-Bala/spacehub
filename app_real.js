document.addEventListener('DOMContentLoaded', function() {

  //Youtube Video section starts
const videoThumbnails = document.querySelectorAll(
    ".video-gallery .all-videos .thumbnail"
  );
  const videoPlayer = document.querySelector(
    ".video-gallery .featured-video iframe"
  );
  const videoTitle = document.querySelector(".video-gallery .video-title");
  
  const showVideo = (videoId, title) => {
    let videoUrl = `https://www.youtube.com/embed/${videoId}?controls=0`;
    videoPlayer.setAttribute("src", videoUrl);
    videoTitle.innerHTML = title;
  };
  
  videoThumbnails.forEach((v) => {
    v.addEventListener("click", () => {
      showVideo(v.dataset.id, v.dataset.title);
    });
  });
  // Youtube Video section ends

  // Nav Section starts
  
  // Hamburger menu selections
  const hamburger = document.querySelector("#hamburger");
  const navMenu = document.querySelector("ul");
  const navLink = document.querySelectorAll("#nav-link");

  // Hamburger menu functionality
  hamburger.addEventListener("click", openMenu);
  function openMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  }

  // Close menu on nav menu clicks
  navLink.forEach((n) => n.addEventListener("click", closeMenu));
  function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }
  // Nav Section ends

  // NASA API section starts
  const apiKey = 'VTjgXcg5vyAyUcd6EabyCt2q6bnKytzBI23hqcv6';
  const baseUrl = 'https://api.nasa.gov/planetary/apod?api_key=';

  // Function to create a video card element
  function createVideoCard(apodData) {
    const videoCard = document.createElement('div');
    videoCard.classList.add('video-card');

    const videoCardTitle = document.createElement('p');
    videoCardTitle.classList.add('video-card-title');
    videoCardTitle.textContent = apodData.title;
    videoCard.appendChild(videoCardTitle);

    const videoCardDate = document.createElement('p');
    videoCardDate.classList.add('video-card-date');
    const formattedDate = new Date(apodData.date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedStartDateStr = formattedDate.toLocaleDateString('en-US', options);
    videoCardDate.textContent = `${formattedStartDateStr}`;
    videoCard.appendChild(videoCardDate);
    
    const videoCardDescription = document.createElement('p');
    videoCardDescription.classList.add('video-card-description');
    videoCardDescription.textContent = apodData.explanation;
    videoCard.appendChild(videoCardDescription);

    const expandButton = document.createElement('button');
    expandButton.classList.add('video-card-expand-button');
    expandButton.textContent = 'Expand';
    expandButton.addEventListener('click', function() {
      videoCardDescription.style.maxHeight = 'none';
      expandButton.style.display = 'none';
    });
    videoCard.appendChild(expandButton);

    const videoThumbnail = document.createElement('div');
    videoThumbnail.classList.add('video-thumbnail');
    videoCard.appendChild(videoThumbnail);

    // Add image or video element based on media type
    if (apodData.media_type === 'image') {
      const image = document.createElement('img');
      image.src = apodData.url;
      image.alt = apodData.title;
      image.classList.add('thumb-img');
      videoThumbnail.appendChild(image);
    } else if (apodData.media_type === 'video') {
      const video = document.createElement('iframe');
      video.src = apodData.url;
      video.frameborder = '2';
      video.width = '560';
      video.height = '350';
      video.classList.add('thumb-video');
      videoThumbnail.appendChild(video);
    }

    return videoCard;
  }

  // Function to display video cards
  function displayVideoCards(apodDataArray) {
    const videoCardContainer = document.querySelector('.video-card-container');
    videoCardContainer.innerHTML = '';

    apodDataArray.forEach(apodData => {
      const videoCard = createVideoCard(apodData);
      videoCardContainer.appendChild(videoCard);
    });
  }

  // Function to fetch APOD data
  async function fetchApodData(startDate, endDate) {
    const requestUrl = `${baseUrl}${apiKey}&start_date=${startDate}&end_date=${endDate}`;
    //const requestUrl = '';
    const response = await fetch(requestUrl);
    const data = await response.json();
    const apodDataArray = [];
    for (const date in data) {
      const apodData = data[date];
      apodDataArray.push(apodData);
    }
    return apodDataArray;
  }

  // Fetch and display the initial APOD data for the last 6 days
  const today = new Date();
  const last6Days = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    last6Days.push(dateString);
  }

    // Format the start and end dates
    const formattedStartDate = new Date(last6Days[5]);
    const formattedEndDate = new Date(last6Days[0]);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedStartDateStr = formattedStartDate.toLocaleDateString('en-US', options);
    const formattedEndDateStr = formattedEndDate.toLocaleDateString('en-US', options);

    //Create header element with current date range .date-range-header-value
    const dateRangeHeader = document.createElement('p');
    const videoCardContainer = document.querySelector('.date-range-header');
    dateRangeHeader.textContent = "Current Selection:";
    videoCardContainer.appendChild(dateRangeHeader);

    const dateRangeHeaderValue = document.createElement('h4');
    const dateRangeHeaderValueDiv = document.querySelector('.date-range-header-value');
    dateRangeHeaderValue.textContent = `${formattedStartDateStr} - ${formattedEndDateStr}`;
    dateRangeHeaderValueDiv.appendChild(dateRangeHeaderValue);

    fetchApodData(last6Days[5], last6Days[0])
      .then(apodDataArray => {
        displayVideoCards(apodDataArray.reverse());
      })
      .catch(error => {
        console.log('Error:', error);
      });

  // Date picker event listener
  const startDatePicker = document.querySelector('#start-date-picker');
  const endDatePicker = document.querySelector('#end-date-picker');
  const fetchButton = document.querySelector('#fetch-button');

  fetchButton.addEventListener('click', function() {
    const startDate = startDatePicker.value;
    const endDate = endDatePicker.value;

    const fstartDate = new Date(startDatePicker.value);
    const fendDate = new Date(endDatePicker.value);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedStartDateStr = fstartDate.toLocaleDateString('en-US', options);
    const formattedEndDateStr = fendDate.toLocaleDateString('en-US', options);

    //Create header element with current date range .date-range-header-value
    const dateRangeHeaderValueDiv = document.querySelector('.date-range-header-value h4');
    dateRangeHeaderValueDiv.textContent = `${formattedStartDateStr} - ${formattedEndDateStr}`;

    fetchApodData(startDate, endDate)
      .then(apodDataArray => {
        displayVideoCards(apodDataArray.reverse());
      })
      .catch(error => {
        console.log('Error:', error);
      });
  });
  //NASA API Section ends

  var sections = document.querySelectorAll(".reveal-section");
  var revealPoint = window.innerHeight * 0.8;

  function revealSections() {
    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      var sectionTop = section.getBoundingClientRect().top;

      if (sectionTop < revealPoint) {
        section.classList.add("reveal");
      } else {
        section.classList.remove("reveal");
      }
    }
  }

  // Throttle the scroll event to improve performance
  function throttle(func, limit) {
    var inThrottle;
    return function() {
      var args = arguments;
      var context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() {
          inThrottle = false;
        }, limit);
      }
    };
  }

  // Attach the reveal function to the scroll event
  window.addEventListener("scroll", throttle(revealSections, 200));

  // Call the reveal function on page load to handle initial scroll position
  revealSections();

  // Fade in Text Code
  var fadeElements = document.querySelectorAll(".fade");

  function revealFadeElements() {
    for (var i = 0; i < fadeElements.length; i++) {
      var element = fadeElements[i];
      var elementTop = element.getBoundingClientRect().top;
      var revealPoint = window.innerHeight * 0.8;

      if (elementTop < revealPoint) {
        element.classList.add("fade-in");
      } else {
        element.classList.remove("fade-in");
      }
    }
  }

  // Throttle the scroll event to improve performance
  function throttle(func, limit) {
    var inThrottle;
    return function() {
      var args = arguments;
      var context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() {
          inThrottle = false;
        }, limit);
      }
    };
  }

  // Attach the reveal function to the scroll event
  window.addEventListener("scroll", throttle(revealFadeElements, 200));

  // Call the reveal function on page load to handle initial scroll position
  revealFadeElements();

//END ALL
});