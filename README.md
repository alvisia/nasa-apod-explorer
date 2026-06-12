# Cosmic Explorer

A responsive NASA Astronomy Picture of the Day app built with HTML, CSS, and JavaScript. Cosmic Explorer lets users browse random NASA APOD entries, search by date, save favorite discoveries, sort saved items, and view different APOD media types including images and videos.

This project was customized from a JavaScript course project and expanded with additional features, stronger UI states, accessibility improvements, error handling, and responsive design polish to make it more portfolio-ready.

## Live Demo

https://alvisia.github.io/nasa-apod-explorer/

## Screenshots

### Desktop Results

<img width="1920" height="947" alt="Cosmic Explorer desktop results page showing the navigation, date search, and APOD image" src="https://github.com/user-attachments/assets/d23d77df-2fa0-45fc-8953-ff14686f1f81" />

<img width="1920" height="952" alt="Cosmic Explorer desktop APOD card showing the title, favorite button, explanation, and date" src="https://github.com/user-attachments/assets/baa1fcf8-492c-40d4-8a54-99c2edf35fef" />


### Mobile Results

<img width="396" height="797" alt="Cosmic Explorer mobile results page showing the responsive navigation, date search, and APOD image" src="https://github.com/user-attachments/assets/e9579c03-9b43-4dec-adad-7fe659c50fdc" />

### Favorites Page

<img width="1913" height="948" alt="Cosmic Explorer favorites page showing a saved APOD entry and sorting dropdown" src="https://github.com/user-attachments/assets/68f8bd7e-f86d-478a-a391-4c2b1674296e" />

### Error State

<img width="1913" height="948" alt="Cosmic Explorer error state showing a temporary API error message and retry button" src="https://github.com/user-attachments/assets/80d26bc2-3b15-4079-b4d1-7c01e2088782" />

## Features 

- Fetch random Astronomy Picture of the Day entries from NASA's APOD API
- Display APOD images, titles, explanations, dates, and copyright information when available
- Search the APOD archive by a specific date
- Save APOD entries to favorites with localStorage
- Remove saved favorites
- Sort favorites by newest or oldest date
- Handle image APOD entries
- Handle video APOD entries with a custom video placeholder
- Show a fallback placeholder for unsupported media types
- Display a loading screen while API requests are running
- Show an error state with a retry button when a request fails
- Responsive layout for desktop, tablet, and mobile screens
- NASA APOD API credit footer
- Keyboard focus styles and basic accessibility improvements

## Technologies Used

- HTML5
- CSS3
- JavaScript
- NASA APOD API
- Axios
- localStorage
- Font Awesome
- Git
- GitHub Pages

## What I Customized

This project started as a course-based NASA APOD project from ZTM. I expanded it into a more complete astronomy explorer by adding new features, improving the interface, handling more API response types, and polishing the responsive experience.

Key customizations include:

- Rebranded the project as Cosmic Explorer
- Created a custom title, subtitle, and visual theme
- Built a date search feature for exploring specific APOD archive dates
- Limited the date picker so users cannot select future dates
- Added favorites sorting by newest or oldest date
- Refined localStorage behavior for saved APOD entries
- Created an empty favorites state
- Added support for video APOD entries
- Built a fallback UI for unsupported APOD media types
- Designed a loading state with custom loader text
- Added API error handling with a user-friendly message
- Created a retry button for failed requests
- Reduced the random APOD request count for better performance
- Polished the layout across desktop, tablet, and mobile screen sizes
- Used responsive media sizing for video and unavailable media placeholders
- Added a footer crediting NASA's APOD API
- Added accessibility improvements including aria labels, focus-visible styles, role="alert", and aria-live messaging

## What I Learned

While building and customizing this project, I practiced:

- Working with third-party APIs
- Handling asynchronous JavaScript with API requests
- Managing loading, empty, and error states
- Using localStorage for persistent favorites
- Creating DOM elements dynamically with JavaScript
- Sorting saved data by date
- Handling different API response types
- Improving responsive layouts with CSS
- Using responsive media sizing with `aspect-ratio`
- Adding accessibility-focused UI details
- Turning a course project into a more personalized portfolio project

## Future Improvements

Possible future improvements include:

- Add an expanded detail modal for APOD entries
- Add search or filtering within saved favorites
- Add clearer duplicate favorite feedback
- Add a backend proxy for protecting a personal API key in a full-stack version
- Add animations for card rendering and page transitions

## Setup

To run the project locally:

1. Clone the repository
2. Open `index.html` in your browser

You can also run the project with a local development server such as the VS Code Live Server extension.
