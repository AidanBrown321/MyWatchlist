# MyWatchlist

## General Theme

MyWatchlist is a simple movie watchlist web app. The main idea is to give users a way to track movies they want to watch, movies they’ve already watched, and see statistics of their watch history. It is just a clean, minimal way for someone to keep their own private list of films that they can show others if they would like.

This project fits in the category of a personal utility app. It is not social media or anything extravagant, it's just a helpful little tool to organize movie watching and maybe even discover patterns in your own taste over time.

## What Will It Do?

MyWatchlist will allow users to:

- Add a movie to their list by entering the title, genre, and whether they’ve watched it or not.
- View all their movies in a single place.
- Filter their list by status (Watched or To Watch), or by genre (Action, Comedy, Drama, etc.).
- Delete movies from the list when they change their mind.
- Edit movies if they made a mistake when adding it.
- View basic stats, like how many movies they’ve watched vs. how many are still in their queue.

It’ll have a clean, friendly design and it’ll be easy to use with no logins, no accounts, just open it up and start using it.

## Target Audience

This app is for anyone who wants a simple way to keep track of movies they want to watch. That could include:

- Movie lovers who don’t want to use big platforms just to track films
- Casual users who always forget what they were going to watch next
- Friends or family members who want to see each other's movie lists

Basically, anyone with a love of movies and a tendency to forget movie recommendations could find this useful.

## What Sort of Data Will It Manage?

MyWatchlist will handle user-generated data, all coming from form input. That includes:

- Movie Title (text input)
- Genre (dropdown or typed input)
- Status (Watched or To Watch, radio buttons or dropdown)
- Movie ID (used internally for editing or deleting entries)

All of this data will be stored in a database on AWS and managed through front-end forms and JavaScript. The data will be able to be retrieved, filtered, and displayed, and users will be able to interact with the movie list in real time.

## Stretch Goals

Once the core features are in place, here are a few things I’d like to explore as bonus features if there is time left in the semester or I want to continue the project on my own:

- Dark Mode: Let users toggle between light and dark themes.
- Movie Poster Lookup: Use an external movie API (like OMDB or TMDB) to automatically fetch posters when a user adds a movie.
- Ratings: Let users rate movies they’ve watched (1–5 stars or thumbs up/down).
- Sharing a Watchlist: Generate a shareable link to let someone else view your list (read-only).

